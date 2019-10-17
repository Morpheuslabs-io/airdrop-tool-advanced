import { sha256 } from 'js-sha256';

		/**
		* NOTE:
		* Install or include the js-sha256 library to calculate the response in sha256 hash
		* Install via npm:
		* - npm i js-sha256
		* or include from cdn:
		* - https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js
		**/

  export function buildPayload(data) {

    const {
      firstName, lastName, email, dob, country, fileDocBase64, fileFaceBase64,
      docType, docNum, issue, expire
    } = data

    let payload = {
      //your unique request reference
      "reference"					 : `SP_REQUEST_${Math.random()}`,
      //URL where you will receive the webhooks from Shufti Pro
      "callback_url"				 : "https://yourdomain.com/profile/sp-notify-callback",
      //end-user email
      "email"							 : email,
      //end-user country
      "country"						 : country,
      //what kind of proofs will be provided to Shufti Pro for verification?
      "verification_mode"		 : "image_only",
      //allow end-user to upload verification proofs if the webcam is not accessible
      "allow_offline"				 : "1",
      //privacy policy screen will be shown to end-user
      "show_privacy_policy" : "1",
      //verification results screen will be shown to end-user
      "show_results"				 : "1",
      //consent screen will be shown to end-user
      "show_consent"			 : "1"
    }

    //face onsite verification
    payload['face'] = {
      proof          : fileFaceBase64,
      allow_offline  : "1",
    };
    //document onsite verification with OCR
    payload['document'] = {
      name : {
        first_name	 : firstName,
        last_name		 : lastName,
        fuzzy_match	 : '1'
      },
      proof             : fileDocBase64,
      // dob								: dob,
      // document_number	  : docNum,
      expiry_date				: expire,
      // issue_date				: issue,
      supported_types		: ['passport']
    }
    //background check/AML verification with OCR
    payload['background_checks'] = {
      name : {
          first_name			: firstName,
          middle_name	    : '',
          last_name			  : lastName,
      },
      dob		: dob,
    }

    return payload

  }

  export function doFetch(payload) {
    return new Promise((resolve, reject) => {
      console.log('payload:', payload);
      
      const {token, signature} = getTokenAndSignature()

      var responsesignature = null;
      //Dispatch request via fetch API or with whatever else which best suits for you
      fetch('https://shuftipro.com/api/',
      {
          method : 'post',
          headers : {
              'Accept'				: 'application/json',
              'Content-Type'	: 'application/json',
              'Authorization'	: 'Basic ' +token
          },
      body: JSON.stringify(payload)
      })
      .then(function(response) {
          console.log('response:', response);
          responsesignature = response.headers.get('Signature');
          return response.json();
      }).then(function(data) {
          if(validatesignature(data,responsesignature, signature)){
              console.log('signature validated - data:',data)
              resolve({title: data.event, text: data.declined_reason || ''})
          }else{
              console.log('signature not validated - data:',data)
              resolve(null)
          }
      });
    });
  }

  function getTokenAndSignature() {
    // Mido test
    var tokenMido = btoa("k9GsyCBYStdmWoGHa6i8Yp2JLTDwpkWMYZNIRZRJYIZK3qlpi31570863056:$2y$10$yY0MK0wJd10b9h4IS00SFO0nnsnNo96VvEQyVpch2o50n7Fg9G1Zu"); //BASIC AUTH TOKEN
    var signatureMido = '$2y$10$yY0MK0wJd10b9h4IS00SFO0nnsnNo96VvEQyVpch2o50n7Fg9G1Zu';

    // Company test
    var tokenCompanyTest = btoa("GvXnRQliVTnvFlJ1eRtsRsZSSQBvoRqiJruTut8grEZTJFQojN1569493654:$2y$10$kdLlHoSudzzfy3n853xrZeJ1/.z0KI4keqh0xEjXc3noo/4svLXvS"); //BASIC AUTH TOKEN
    var signatureCompanyTest = '$2y$10$kdLlHoSudzzfy3n853xrZeJ1/.z0KI4keqh0xEjXc3noo/4svLXvS';

    // Company production
    var tokenCompanyProd = btoa("gfSKbmdvAqWtqkeX8PkkNUuLQqqr8D5nhvCvSSfXAu0ObiAyCe1569554062:$2y$10$I4vRzbe3bEYpLWHoWzrE4OWFHYdfFTr4eFz.eIz.5kyrnXAwtvOyW"); //BASIC AUTH TOKEN
    var signatureCompanyProd = '$2y$10$I4vRzbe3bEYpLWHoWzrE4OWFHYdfFTr4eFz.eIz.5kyrnXAwtvOyW';

    var token = tokenCompanyProd
    var signature = signatureCompanyProd

    return {token, signature}
  }

  //this method is used to validate the response signature
  function validatesignature(data,signature,SK){
    data = JSON.stringify(data);
    data = data.replace(/\//g,"\\/")
    data = `${data}${SK}`;

    sha256(data);
    var hash = sha256.create();
    hash.update(data);

    if(hash.hex() == signature){
        return true;
    }else{
        return false;
    }
  }

  export function getCustomerList() {
    return new Promise((resolve, reject) => {
      
      const {token, signature} = getTokenAndSignature()

      var responsesignature = null;
      //Dispatch request via fetch API or with whatever else which best suits for you
      fetch('https://shuftipro.com/backoffice/customers',
      {
          method : 'get',
          headers : {
              'Accept'				: 'application/json',
              'Content-Type'	: 'application/json',
              'Authorization'	: 'Basic ' +token
          },
      // body: JSON.stringify(payload)
      })
      .then(function(response) {
          console.log('response:', response);
          responsesignature = response.headers.get('Signature');
          return response.json();
      }).then(function(data) {
          if(validatesignature(data,responsesignature, signature)){
              console.log('signature validated - data:',data)
              resolve({title: data.event, text: data.declined_reason || ''})
          }else{
              console.log('signature not validated - data:',data)
              resolve(null)
          }
      });
    });
  }