		/**
		* NOTE:
		* Install or include the js-sha256 library to calculate the response in sha256 hash
		* Install via npm:
		* - npm i js-sha256
		* or include from cdn:
		* - https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js
		**/
		let payload = {
      //your unique request reference
      "reference"					 : `SP_REQUEST_${Math.random()}`,
      //URL where you will receive the webhooks from Shufti Pro
      "callback_url"				 : "https://yourdomain.com/profile/sp-notify-callback",
      //end-user email
      "email"							 : "johndoe@example.com",
      //end-user country
      "country"						 : "",
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
  payload['face'] = ""
  //document onsite verification without OCR
  payload['document'] = {
        name : {
          first_name		 : 'Your first name',
          last_name		 : 'You last name',
          fuzzy_match	 : '1'
      },
      dob								: '1992-10-10',
      document_number	: '2323-5629-5465-9990',
      expiry_date				: '2025-10-10',
      issue_date					: '2015-10-10',
      supported_types		: ['id_card','passport']
  }
  //background check/AML verification without OCR
  payload['background_checks'] = {
      name : {
          first_name			: 'Your first name',
          middle_name	: 'Your middle name',
          last_name			: 'You last name',
      },
      dob		: '1994-01-01',
  }

  var token = btoa("k9GsyCBYStdmWoGHa6i8Yp2JLTDwpkWMYZNIRZRJYIZK3qlpi31570863056:$2y$10$yY0MK0wJd10b9h4IS00SFO0nnsnNo96VvEQyVpch2o50n7Fg9G1Zu"); //BASIC AUTH TOKEN
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
      responsesignature = response.headers.get('Signature');
      return response.json();
  }).then(function(data) {
      if(validatesignature(data,responsesignature,'$2y$10$yY0MK0wJd10b9h4IS00SFO0nnsnNo96VvEQyVpch2o50n7Fg9G1Zu')){
          console.log('signature validated',data)
      }else{
          console.log('signature not validated',data)
      }
  });
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