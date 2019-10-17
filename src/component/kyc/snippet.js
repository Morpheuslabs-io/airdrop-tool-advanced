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
      dob								: dob,
      document_number	  : docNum,
      expiry_date				: expire,
      issue_date				: issue,
      supported_types		: ['id_card','passport']
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

  export function buildPayloadSample(fileBase64) {

    let payload = {
      //your unique request reference
      "reference"					 : `SP_REQUEST_${Math.random()}`,
      //URL where you will receive the webhooks from Shufti Pro
      "callback_url"				 : "https://yourdomain.com/profile/sp-notify-callback",
      //end-user email
      "email"							 : 'midotrinh@gmail.com',
      //end-user country
      "country"						 : 'Poland',
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
    // payload['face'] = fileBase64
    //document onsite verification with OCR
    payload['document'] = {
      name : {
        first_name	 : 'Anna',
        last_name		 : 'Kowalska',
        fuzzy_match	 : '1'
      },
      dob								: '1972-03-30',
      document_number	: 'ZS0000177',
      expiry_date				: '2016-07-13',
      issue_date					: '2006-07-13',
      supported_types		: ['id_card','passport']
    }
    //background check/AML verification with OCR
    payload['background_checks'] = {
      name : {
          first_name			: 'Anna',
          middle_name	: '',
          last_name			: 'Kowalska',
      },
      dob		: '1972-03-30',
    }

    return payload

  }

  export function buildPayloadSampleSimple(fileBase64) {

    let payload = {
      //your unique request reference
      "reference"					 : `SP_REQUEST_${Math.random()}`,
      //URL where you will receive the webhooks from Shufti Pro
      "callback_url"				 : "https://yourdomain.com/profile/sp-notify-callback",
      //end-user email
      "email"							 : "midotrinh@gmail.com",
      //end-user country
      "country"						 : "Germany",
      //what kind of proofs will be provided to Shufti Pro for verification?
      "verification_mode"		 : "any",
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
    payload['face'] = ""
    //document onsite verification with OCR
    payload['document'] = {
        
        name							: "",
        dob								: "",
        document_number	: "",
        expiry_date				: "",
        issue_date					: "",
        supported_types		: ['id_card','passport']
    }
    //background check/AML verification with OCR
    payload['background_checks'] = "" 
    
    return payload

  }

  export function doFetchTest() {

    fetch('https://www.24h.com.vn', 
    {
      method : 'get'
    })
    .then(function(response) {
      console.log('response:', response);
      return response.json();
    }).then(function(data) {
      console.log(data);
    })
  }

  export function doFetch(payload) {
    return new Promise((resolve, reject) => {
      console.log('payload:', payload);
      
      // var token = btoa("k9GsyCBYStdmWoGHa6i8Yp2JLTDwpkWMYZNIRZRJYIZK3qlpi31570863056:$2y$10$yY0MK0wJd10b9h4IS00SFO0nnsnNo96VvEQyVpch2o50n7Fg9G1Zu"); //BASIC AUTH TOKEN

      var token = btoa("GvXnRQliVTnvFlJ1eRtsRsZSSQBvoRqiJruTut8grEZTJFQojN1569493654:$2y$10$kdLlHoSudzzfy3n853xrZeJ1/.z0KI4keqh0xEjXc3noo/4svLXvS"); //BASIC AUTH TOKEN
      
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
          if(validatesignature(data,responsesignature,'$2y$10$kdLlHoSudzzfy3n853xrZeJ1/.z0KI4keqh0xEjXc3noo/4svLXvS')){
              console.log('signature validated - data:',data)
              resolve({title: data.event, text: data.declined_reason || ''})
          }else{
              console.log('signature not validated - data:',data)
              resolve(null)
          }
      });
    });
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