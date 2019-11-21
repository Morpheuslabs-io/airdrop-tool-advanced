import React, {Component} from 'react';
import {Row, Col, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
import InputField from '../../util/InputField';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Swal from "sweetalert2";
import Spinner from 'react-spinkit';
import {isMobile} from 'react-device-detect';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import ReactDropzone from "react-dropzone";
import "react-image-gallery/styles/css/image-gallery.css";
import './snippet'
import { buildPayload, doFetch, getCustomerList } from './snippet';

import docVerifyImg from '../../assets/img/document.webp.png'
import faceVerifyImg from '../../assets/img/face.webp.png'

// import emailList from './email-list'
// import restrictedCountryList from './restricted-country'
import {reactLocalStorage} from 'reactjs-localstorage'

import Webcam from "react-webcam";

const MAX_FILE_SIZE = 2*1024*1024 // 2MB

let emailList = process.env.REACT_APP_EMAIL_WHITELIST || ''
emailList = emailList.toLowerCase()

let restrictedCountryList = process.env.REACT_APP_COUNTRY_BLACKLIST || ''
restrictedCountryList = restrictedCountryList.toLowerCase()

const kycTitle = process.env.REACT_APP_WEB_APP_TITLE || 'KYC Submission'

class KycForm extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    docNum: '',

    yearDob: '', monthDob: '', dayDob: '',
    yearIssue: '', monthIssue: '', dayIssue: '',
    yearExpire: '', monthExpire: '', dayExpire: '',

    options: countryList().getData(),
    value: '',
    label: '',

    valueDocAttachOption: 0,
    labelDocAttachOption: "Drag & Drop",

    valueFaceAttachOption: 0,
    labelFaceAttachOption: "Drag & Drop",

    urlFileDoc: "",
    fileDocBase64: "",

    urlFileFace: "",
    fileFaceBase64: "",

    spinnerShow: false,
    showModal: false,
  };

  changeHandler = value => {
    this.setState({ value })
  }

  changeHandlerCountry = selectedOption => {
    // console.log(selectedOption);
    if (this.isCountryRestricted(selectedOption.label)) {
      Swal.fire({
        type: 'error',
        title: `${kycTitle} denied`,
        text: `Country is not given access`
      }).then(result => {
        window.location.reload();
      })
    } else {
      this.setState({
          value: selectedOption.value,
          label: selectedOption.label
      });
    }
  };

  displayDOB = () => {
    return (
      <div>
        <Row>
          <Col sm={4}>
            <YearPicker
              defaultValue={'Year'}
              // default is 1900
              start={1930}
              // default is current year
              end={2004}
              // default is ASCENDING
              // reverse
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.yearDob}
              // mandatory
              onChange={(yearDob) => {
                this.setState({ yearDob });
                console.log(yearDob);
              }}
              id={'yearDob'}
              name={'yearDob'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <MonthPicker
              defaultValue={'Month'}
              // to get months as numbers
              numeric
              // default is full name
              short
              // default is Titlecase
              caps
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // mandatory
              year={this.state.yearDob}
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.monthDob}
              // mandatory
              onChange={(monthDob) => {
                // month = Number(month) + 1
                this.setState({ monthDob });
                console.log(monthDob);
              }}
              id={'monthDob'}
              name={'monthDob'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <DayPicker
              defaultValue={'Day'}
              // mandatory
              year={this.state.yearDob}
              // mandatory
              month={this.state.monthDob}
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.dayDob}
              // mandatory
              onChange={(dayDob) => {
                this.setState({ dayDob });
                console.log(dayDob);
              }}
              id={'dayDob'}
              name={'dayDob'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
        </Row>
			</div>
		);
  }

  displayIssue = () => {
    return (
      <div>
        <Row>
          <Col sm={4}>  
            <YearPicker
              defaultValue={'Year'}
              // default is 1900
              start={1930}
              // default is current year
              // end={2004}
              // default is ASCENDING
              // reverse
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.yearIssue}
              // mandatory
              onChange={(yearIssue) => {
                this.setState({ yearIssue });
                console.log(yearIssue);
              }}
              id={'yearIssue'}
              name={'yearIssue'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <MonthPicker
              defaultValue={'Month'}
              // to get months as numbers
              numeric
              // default is full name
              short
              // default is Titlecase
              caps
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // mandatory
              year={this.state.yearIssue}
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.monthIssue}
              // mandatory
              onChange={(monthIssue) => {
                // month = Number(month) + 1
                this.setState({ monthIssue });
                console.log(monthIssue);
              }}
              id={'monthIssue'}
              name={'monthIssue'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <DayPicker
              defaultValue={'Day'}
              // mandatory
              year={this.state.yearIssue}
              // mandatory
              month={this.state.monthIssue}
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.dayIssue}
              // mandatory
              onChange={(dayIssue) => {
                this.setState({ dayIssue });
                console.log(dayIssue);
              }}
              id={'dayIssue'}
              name={'dayIssue'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
        </Row>
			</div>
		);
  }

  displayExpire = () => {
    return (
      <div>
        <Row>
          <Col sm={4}>  
            <YearPicker
              defaultValue={'Year'}
              // default is 1900
              start={1930}
              // default is current year
              end={(new Date()).getFullYear() + 20}
              // default is ASCENDING
              // reverse
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.yearExpire}
              // mandatory
              onChange={(yearExpire) => {
                this.setState({ yearExpire });
                console.log(yearExpire);
              }}
              id={'yearExpire'}
              name={'yearExpire'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <MonthPicker
              defaultValue={'Month'}
              // to get months as numbers
              numeric
              // default is full name
              short
              // default is Titlecase
              caps
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // mandatory
              year={this.state.yearExpire}
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.monthExpire}
              // mandatory
              onChange={(monthExpire) => {
                // month = Number(month) + 1
                this.setState({ monthExpire });
                console.log(monthExpire);
              }}
              id={'monthExpire'}
              name={'monthExpire'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col sm={4}>
            <DayPicker
              defaultValue={'Day'}
              // mandatory
              year={this.state.yearExpire}
              // mandatory
              month={this.state.monthExpire}
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.dayExpire}
              // mandatory
              onChange={(dayExpire) => {
                this.setState({ dayExpire });
                console.log(dayExpire);
              }}
              id={'dayExpire'}
              name={'dayExpire'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
        </Row>
			</div>
		);
  }

  // isEmailAllowed = (email) => {
  //   for (let i=0; i<emailList.length; i++) {
  //     if (email.toLowerCase() === emailList[i].toLowerCase()) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  isEmailAllowed = (email) => {

    if (emailList.indexOf(email.toLowerCase()) !== -1) {
      return true
    }
    else {
      return false
    }
  }

  isCountryRestricted = (country) => {
    if (restrictedCountryList.indexOf(country.toLowerCase()) !== -1) {
      return true
    }
    else {
      return false
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  };

  handleBlur = () => {
    const {email} = this.state
    if (email === '') return
    if (!this.isEmailAllowed(email)) {
      Swal.fire({
        type: 'error',
        title: `${kycTitle} denied`,
        text: 'Email address is not given access'
      }).then(result => {
        window.location.reload();
      })
    }

    const submittedEmail = reactLocalStorage.get('email', '', true)
    if (submittedEmail.toLowerCase() === email.toLowerCase()) {
      Swal.fire({
        type: 'error',
        title: `${kycTitle} denied`,
        text: 'Email address has already been submitted'
      }).then(result => {
        window.location.reload();
      })
    }
  };

  handleUploadCSV = event => {
    const file = event.target.files[0];
    if (file) {
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        this.setState({
          airdroplist: []
        })
        let csv = Papa.parse(fileReader.result);
        let airdroplist = [];
        for (const idx in csv.data) {
          let addr = csv.data[idx][0]
          let amount = parseFloat(csv.data[idx][1])
        }
      };
      fileReader.readAsText(file);
      event.target.value = null;
    }
  };

  handleToggleModal = () => {
    const { showModal } = this.state
    this.setState({
      showModal: !showModal
    })
  }

  setIsProcessing = (val) => {
    this.setState({
      isProcessing: val
    })
  }
  
  handleChangeDocAttachOption = selectedOption => {
    this.setState({
        valueDocAttachOption: selectedOption.value,
        labelDocAttachOption: selectedOption.label,
        fileDocBase64: "",
        urlFileDoc: ""
    });
  };

  handleChangeFaceAttachOption = selectedOption => {
    this.setState({
        valueFaceAttachOption: selectedOption.value,
        labelFaceAttachOption: selectedOption.label,
        fileFaceBase64: "",
        urlFileFace: ""
    });
  };

  handleSubmit = async () => {

    const {
      firstName,
      lastName,
      email,
      docNum,
      yearDob, monthDob, dayDob,
      yearIssue, monthIssue, dayIssue,
      yearExpire, monthExpire, dayExpire,
      value,
      fileDocBase64,
      fileFaceBase64,
    } = this.state;

    // await getCustomerList();

    console.log('process.env.REACT_APP_EMAIL_WHITELIST:', process.env.REACT_APP_EMAIL_WHITELIST)

    if (email === "") {
      Swal.fire({
        type: 'info',
        title: `${kycTitle}`,
        text: 'Please enter an email'
      })
      return
    }

    if (fileDocBase64 === "") {
      Swal.fire({
        type: 'info',
        title: `${kycTitle}`,
        text: 'Please upload your document'
      })

      return
    }

    if (fileFaceBase64 === "") {
      Swal.fire({
        type: 'info',
        title: `${kycTitle}`,
        text: 'Please upload your face image'
      })

      return
    }

    this.setState({
      spinnerShow: true,
      showModal: true
    })

    const data = {
      firstName, lastName, email, 
      dob: `${yearDob}-${parseFloat(monthDob)+1}-${dayDob}`, 
      country: value,
      fileDocBase64, fileFaceBase64, docNum, 
      issue: `${yearIssue}-${parseFloat(monthIssue)+1}-${dayIssue}`,
      expire: `${yearExpire}-${parseFloat(monthExpire)+1}-${dayExpire}`,
      docType: ''
      // docType: this.state.​valueDocType === 0 ? 'passport' : 'id_card'
    }

    // const payload = buildPayloadSample(fileDocBase64)
    const payload = buildPayload(data)
    const result = await doFetch(payload)

    this.setState({
      spinnerShow: false,
      showModal: false
    })

    // if (result === null) {
    //   Swal.fire({
    //     type: 'error',
    //     title: `${kycTitle}`,
    //     text: 'Signature not validated'
    //   })
    // } else {
    //   Swal.fire({
    //     type: result.text === '' ? 'success' : 'error',
    //     title: result.title,
    //     text: result.text
    //   })
    // }

    Swal.fire({
      type: 'info',
      title: 'Thank you',
      text: 'KYC verification data submitted'
    })

    reactLocalStorage.set('email', email)
  }

  onDropRejected = (docInfo, err) => {
    if (err) {
      console.log('onDropRejected - err:', err)
      if (docInfo === 'Passport') {
        this.setState({
          urlFileDoc: "",
          fileDocBase64: ""
        })
      } else {
        this.setState({
          urlFileFace: "",
          fileFaceBase64: ""
        })
      }

      Swal.fire({
        type: 'error',
        title: `${kycTitle} denied`,
        text: `${docInfo} file size exceeds the limit of 2MB`
      }).then(result => {
        // window.location.reload();
      })
    }
  }

  onDropDoc = (files) => {
    if (files && files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.setState({
          fileDocBase64: reader.result,
          urlFileDoc: e.target.result,
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  onDropFace = (files) => {
    if (files && files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.setState({
          fileFaceBase64: reader.result,
          urlFileFace: e.target.result,
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  handleCapturePhotoDoc = (e) => {
    e.preventDefault();
    const capturedPhotoDoc = this.props.captureDoc()
    console.log('handleCapturePhotoDoc:', capturedPhotoDoc)
    this.setState({
      fileDocBase64: capturedPhotoDoc
    })
    Swal.fire({
      type: 'success',
      title: 'Passport Photo',
      text: 'Captured!',
      timer: 2000
    })
  }

  handleCapturePhotoFace = (e) => {
    e.preventDefault();
    const capturedPhotoFace = this.props.captureFace()
    console.log('handleCapturePhotoFace:', capturedPhotoFace)
    this.setState({
      fileFaceBase64: capturedPhotoFace
    })
    Swal.fire({
      type: 'success',
      title: 'Face Photo',
      text: 'Captured!',
      timer: 2000
    })
  }

  displayWebcamDoc = () => {
    const {webcamRefDoc, captureDoc} = this.props
    const videoConstraints = {
      // width: 1280,
      // height: 720,
      facingMode: "user"
    };
    return (
      <>
        <Webcam
          audio={false}
          height='100%'
          ref={webcamRefDoc}
          screenshotFormat="image/jpeg"
          width='100%'
          videoConstraints={videoConstraints}
        />
        <div style={{paddingTop: '8px'}}/>
        <Button
          onClick={(e) => {this.handleCapturePhotoDoc(e)}}
          variant='contained' size='sm' color="secondary"
        >
          Capture Photo
        </Button>
      </>
    );
  }

  displayWebcamFace = () => {
    const {webcamRefFace, captureFace} = this.props
    const videoConstraints = {
      // width: 1280,
      // height: 720,
      facingMode: "user"
    };
    return (
      <>
        <Webcam
          audio={false}
          height='100%'
          ref={webcamRefFace}
          screenshotFormat="image/jpeg"
          width='100%'
          videoConstraints={videoConstraints}
        />
        <div style={{paddingTop: '8px'}}/>
        <Button
          onClick={(e) => {this.handleCapturePhotoFace(e)}}
          variant='contained' size='sm' color="secondary"
        >
          Capture Photo
        </Button>
      </>
    );
  }

  displayDocZone = () => {
    const {urlFileDoc, fileDocBase64} = this.state
    
    let docAttachOptions = [];
    docAttachOptions.push({ label: "Drag & Drop", value: 0 });
    docAttachOptions.push({ label: "Webcam", value: 1 });

    const previewStyle = {
      display: 'inline',
      width: '100%',
      height: '100%'
    };

    return (
    <div style={{paddingTop: '27px'}}>
      <img 
        src={docVerifyImg} className='wg-label'
        width='100%'
      />
      <div style={{paddingTop: '15px'}}/>
      <Select
        value={docAttachOptions[this.state.valueDocAttachOption]}
        onChange={this.handleChangeDocAttachOption}
        options={docAttachOptions}
        placeholder=""
        width='100%'
      />
      <div style={{paddingTop: '15px'}}/>
      { this.state.valueDocAttachOption === 0 ?
        <ReactDropzone
        
          style={{position: 'relative', width: '100%', height: '100%', borderWidth: '2px', borderColor: '#f0f0f0', borderStyle: 'dashed', borderRadius: '5px', ariaDisabled: "false"}}
          onDrop={this.onDropDoc}
          maxSize={MAX_FILE_SIZE}
          onDropRejected={(err) => {this.onDropRejected('Passport', err)}}
        >
          {urlFileDoc === "" ?
            <>
              <p></p>
              <p style={{textAlign: 'center'}}>Drag & Drop Your Passport</p>
              <p style={{textAlign: 'center'}}>(JPG, JPEG, PNG, PDF with <b style={{color: '#ff0000'}}>max 2MB</b>)</p>
            </>
            :
            <img
              src={urlFileDoc}
              style={previewStyle}
            />
          }
        </ReactDropzone>
        :
            fileDocBase64 === "" ?
              this.displayWebcamDoc()
            :
              <img
                src={fileDocBase64}
                style={previewStyle}
              />
      }
    </div>
    )
  }

  displayFaceZone = () => {
    const {urlFileFace, fileFaceBase64} = this.state
    
    let faceAttachOptions = [];
    faceAttachOptions.push({ label: "Drag & Drop", value: 0 });
    faceAttachOptions.push({ label: "Webcam", value: 1 });

    const previewStyle = {
      display: 'inline',
      width: '100%',
      height: '100%'
    };

    return (
      <div style={{paddingTop: '27px'}}>
        <img 
          src={faceVerifyImg} className='wg-label'
          width='100%'
        />
        <div style={{paddingTop: '15px'}}/>
        <Select
          value={faceAttachOptions[this.state.valueFaceAttachOption]}
          onChange={this.handleChangeFaceAttachOption}
          options={faceAttachOptions}
          placeholder=""
          width='100%'
        />
        <div style={{paddingTop: '15px'}}/>
        { this.state.valueFaceAttachOption === 0 ?
          <ReactDropzone
          
            style={{position: 'relative', width: '100%', height: '100%', borderWidth: '2px', borderColor: '#f0f0f0', borderStyle: 'dashed', borderRadius: '5px', ariaDisabled: "false"}}
            onDrop={this.onDropFace}
            maxSize={MAX_FILE_SIZE}
            onDropRejected={(err) => {this.onDropRejected('Face', err)}}
          >
            {urlFileFace === "" ?
              <>
                <p></p>
                <p style={{textAlign: 'center'}}>Drag & Drop Your Face Photo</p>
                <p style={{textAlign: 'center'}}>(JPG, JPEG, PNG with <b style={{color: '#ff0000'}}>max 2MB</b>)</p>
              </>
              :
              <img
                src={urlFileFace}
                style={previewStyle}
              />
            }
          </ReactDropzone>
          :
            fileFaceBase64 === "" ?
                this.displayWebcamFace()
              :
                <img
                  src={fileFaceBase64}
                  style={previewStyle}
                />
        }
      </div>
    )
  }

  displayButtonSubmit = () => {
    return (
      <div className='wg-label'>
        <Button
          onClick={this.handleSubmit}
          variant='contained' size='lg' color="secondary"
        >
          {
            this.state.spinnerShow ?
              <Spinner 
                name='three-bounce' color='#00B1EF'
                noFadeIn
              />
              :
              'Submit'
          }  
          
        </Button>
      </div>
    )
  }

  render() {
    
    return (
      <div className='container step-widget'>
          <div className='widget-header'>
            <div>
              <p className='title'>{kycTitle}</p>
            </div>
          </div>
          <div className='wg-content'>
                <Row>
                  <Col sm={5}>
                    <InputField 
                      id='firstName' nameLabel='First Name' type='text' 
                      onChange={this.handleChange} value={this.state.firstName}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col sm={2}></Col>
                  <Col sm={5}>
                    <InputField 
                      id='lastName' nameLabel='Last Name' type='text' 
                      onChange={this.handleChange} value={this.state.lastName}
                          hasError={this.state.errorAddress}/>
                  </Col>
                </Row>

                <Row>
                  <Col sm={5}>
                    <InputField 
                      id='email' nameLabel='Email' type='text' 
                      onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.email}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col sm={2}></Col>
                  <Col sm={5}>
                    <label className='wg-label'>Date of Birth</label>
                    {this.displayDOB()}
                  </Col>
                </Row>
                {
                  isMobile && <br/>
                }
                <Row>
                  <Col sm={5}>
                    <InputField 
                      id='docNum' nameLabel='Passport Number' type='text' 
                      onChange={this.handleChange} value={this.state.docNum}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col sm={2}></Col>
                  <Col sm={5}>
                    <label className='wg-label'>Country</label>
                    <Select
                      options={this.state.options}
                      value={{value: this.state.value, label: this.state.label}}
                      onChange={this.changeHandlerCountry}
                    />
                  </Col>
                </Row>
                {
                  isMobile && <br/>
                }
                { isMobile ?
                    <>
                    <Row>
                      <Col sm={5}>
                        <label className='wg-label'>Passport Issuance</label>
                        {this.displayIssue()}
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col sm={5}>
                        <label className='wg-label'>Passport Expiry</label>
                        {this.displayExpire()}
                      </Col>
                    </Row>
                    </>
                    : 
                    <Row>
                      <Col sm={5}>
                        <label className='wg-label'>Passport Issuance</label>
                        {this.displayIssue()}
                      </Col>
                      <Col sm={2}></Col>
                      <Col sm={5}>
                        <label className='wg-label'>Passport Expiry</label>
                        {this.displayExpire()}
                      </Col>
                    </Row>
                }
                { isMobile ? 
                  <>
                  <Row>
                    <Col sm={4}>
                      {this.displayDocZone()}
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col sm={4}>
                      {this.displayFaceZone()}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={2} style={{paddingTop: '30px'}}>
                      {this.displayButtonSubmit()}
                    </Col>
                  </Row>
                  </>
                  :
                  <Row>
                    <Col sm={4}>
                      {this.displayDocZone()}
                    </Col>
                    <Col sm={1}/>
                    <Col sm={2} style={{paddingLeft: '35px', paddingTop: '100px'}}>
                      {this.displayButtonSubmit()}
                    </Col>
                    <Col sm={1}/>
                    <Col sm={4}>
                      {this.displayFaceZone()}
                    </Col>
                  </Row>
                }
              </div>
          <Modal
            size='sm'
            isOpen={this.state.showModal}
            // toggle={this.handleToggleModal}
          >
            <ModalHeader>
              <div className='fs-16 clr-base tc'>{`${kycTitle} Process`}</div>
            </ModalHeader>
            <ModalBody>
              <p>It may take a couple of minutes.</p>
              <p>Please do not reload or close the page.</p>
            </ModalBody>
          </Modal>
      </div>
    );
  }
}

KycForm.propTypes = {
  id: PropTypes.number.isRequired,
};

export default KycForm;
