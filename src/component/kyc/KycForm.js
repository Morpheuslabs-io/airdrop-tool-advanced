import React, {Component} from 'react';
import {Row, Col, Button, Modal, ModalBody, ModalHeader} from 'reactstrap';
import InputField from '../../util/InputField';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Button2 from '@material-ui/core/Button';
import Swal from "sweetalert2";
import Spinner from 'react-spinkit';

import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import ReactDropzone from "react-dropzone";
import "react-image-gallery/styles/css/image-gallery.css";
import './snippet'
import { buildPayload, buildPayloadSample, doFetch, doFetchTest } from './snippet';

import docVerifyImg from '../../assets/img/document.webp.png'
import faceVerifyImg from '../../assets/img/face.webp.png'

import emailList from './email-list'

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

    valueDocType: 0,
    labelDocType: "Passport",

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
    console.log(selectedOption);
    this.setState({
        value: selectedOption.value,
        label: selectedOption.label
    });
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

  isEmailAllowed = (email) => {
    for (let i=0; i<emailList.length; i++) {
      if (email.toLowerCase() === emailList[i].toLowerCase()) {
        return true
      }
    }
    return false
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  };

  handleBlur = () => {

    if (!this.isEmailAllowed(this.state.email)) {
      Swal.fire({
        type: 'error',
        title: 'KYC submission aborted',
        text: 'Email not whitelisted'
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
  
  handleChangeSelectDocType = selectedOption => {
    this.setState({
        valueDocType: selectedOption.value,
        labelDocType: selectedOption.label
    });
  };

  handleSubmit = async () => {
    // day: "2"
    // docNum: "123"
    // email: "midotrinh@gmail.com"
    // firstName: "Mila"
    // isProcessing: false
    // labelDocType: "Passport"
    // ​valueDocType: 0,
    // lastName: "Trinh"
    // month: "4"
    // value: {…}
    //   label: "Viet Nam"
    //   value: "VN"
    // year: "1930"
    // fileDocBase64

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

    if (email === "") {
      Swal.fire({
        type: 'info',
        title: 'KYC Submission',
        text: 'Please enter an email'
      })
      return
    }

    if (fileDocBase64 === "") {
      Swal.fire({
        type: 'info',
        title: 'KYC Submission',
        text: 'Please upload your document'
      })

      return
    }

    if (fileFaceBase64 === "") {
      Swal.fire({
        type: 'info',
        title: 'KYC Submission',
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
    //     title: 'KYC Submission',
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

  render() {
    const {urlFileDoc, urlFileFace} = this.state
    let docTypes = [];
    docTypes.push({ label: "Passport", value: 0 });
    docTypes.push({ label: "ID Card", value: 1 });

    const previewStyle = {
      display: 'inline',
      width: '100%',
      height: '100%'
    };

    return (
      <div className='container step-widget'>
          <div className='widget-header'>
            <div>
              <p className='title'>KYC Submission</p>
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
                <Row>
                  <Col sm={4}>
                    <div style={{paddingTop: '27px'}}>
                      <img 
                        src={docVerifyImg} className='wg-label'
                        width='200px'
                      />
                      <ReactDropzone
                      
                        style={{position: 'relative', width: '200px', height: '200px', borderWidth: '2px', borderColor: '#f0f0f0', borderStyle: 'dashed', borderRadius: '5px', ariaDisabled: "false"}}
                        onDrop={this.onDropDoc}
                      >
                        {urlFileDoc === "" ?
                            "Drag & Drop Your Passport (JPG, JPEG, PNG, PDF with max 16MB)"
                          :
                          <img
                            src={urlFileDoc}
                            style={previewStyle}
                          />
                        }
                      </ReactDropzone>
                    </div>
                  </Col>
                  <Col sm={1}/>
                  <Col sm={2} className='float-left'>
                    <div className='wg-label' style={{paddingTop: '100px'}}>
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
                  </Col>
                  <Col sm={1}/>
                  <Col sm={4}>
                    <div style={{paddingTop: '27px'}}>
                      <img 
                        src={faceVerifyImg} className='wg-label'
                        width='200px'
                      />
                      <ReactDropzone
                      
                        style={{position: 'relative', width: '200px', height: '200px', borderWidth: '2px', borderColor: '#f0f0f0', borderStyle: 'dashed', borderRadius: '5px', ariaDisabled: "false"}}
                        onDrop={this.onDropFace}
                      >
                        {urlFileFace === "" ?
                            "Drag & Drop Your Face Image (JPG, JPEG, PNG with max 16MB)"
                          :
                          <img
                            src={urlFileFace}
                            style={previewStyle}
                          />
                        }
                      </ReactDropzone>
                    </div>
                  </Col>
                </Row>
              </div>
          <Modal
            size='sm'
            isOpen={this.state.showModal}
            // toggle={this.handleToggleModal}
          >
            <ModalHeader>
              <div className='fs-16 clr-base tc'>KYC Submission Process</div>
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
