import React, {Component} from 'react';
import {Row, Col, Button, ButtonGroup} from 'reactstrap';
import InputField from '../../util/InputField';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Button2 from '@material-ui/core/Button';
import swal from "sweetalert2";
import Spinner from 'react-spinkit';

import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import ReactDropzone from "react-dropzone";
import "react-image-gallery/styles/css/image-gallery.css";
import './snippet'
import { buildPayloadSample, doFetch, doFetchTest } from './snippet';

class KycForm extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    docNum: '',

    year: null, month: null, day: null,

    options: countryList().getData(),
    value: null,

    valueDocType: 0,
    labelDocType: "Passport",

    urlFile: "",
    fileBase64: [],

    spinnerShow: false,

    showModal: false,
    isProcessing: false
  };

  changeHandler = value => {
    this.setState({ value })
  }

  displayDOB = () => {
    return (
      <div>
        <Row>
          <Col md={4}>  
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
              value={this.state.year}
              // mandatory
              onChange={(year) => {
                this.setState({ year });
                console.log(year);
              }}
              id={'year'}
              name={'year'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col md={4}>
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
              year={this.state.year}
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.month}
              // mandatory
              onChange={(month) => {
                // month = Number(month) + 1
                this.setState({ month });
                console.log(month);
              }}
              id={'month'}
              name={'month'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
          <Col md={4}>
            <DayPicker
              defaultValue={'Day'}
              // mandatory
              year={this.state.year}
              // mandatory
              month={this.state.month}
              // mandatory if end={} is given in YearPicker
              endYearGiven
              // default is false
              required={true}
              // default is false
              // disabled={true}
              // mandatory
              value={this.state.day}
              // mandatory
              onChange={(day) => {
                this.setState({ day });
                console.log(day);
              }}
              id={'day'}
              name={'day'}
              classes={'form-control wg-text-field'}
              optionClasses={'option classes'}
            />
          </Col>
        </Row>
			</div>
		);
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value,
    })
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
      showModal: !showModal,
      resourceHandleErr: false,
      isProcessing: false
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

  handleSubmit = () => {
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
    // fileBase64

    const {
      firstName,
      lastName,
      email,
      docNum,
      year, month, day,
      value,
      fileBase64
    } = this.state;

    // const data = {
    //   firstName, lastName, email, 
    //   dob: `${year}-${parseFloat(month)+1}-${day}`, 
    //   country: value.label,
    //   fileBase64, docNum, 
    //   // docType: this.state.​valueDocType === 0 ? 'passport' : 'id_card'
    // }

    const payload = buildPayloadSample(fileBase64)
    const result = doFetch(payload)
    // const result = doFetchTest()

  }

  onFileDrop = (files) => {
    if (files && files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.setState({
          fileBase64: reader.result,
          urlFile: e.target.result,
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  render() {
    const {urlFile} = this.state
    let docTypes = [];
    docTypes.push({ label: "Passport", value: 0 });
    docTypes.push({ label: "ID Card", value: 1 });

    const previewStyle = {
      display: 'inline',
      width: '100%',
      height: '100%'
    };

    return (
      <div className='container step-widget widget-1'>
          <div className='widget-header'>
            <div>
              <p className='title'>KYC Submission Tool</p>
            </div>
          </div>
          {
            this.state.spinnerShow ?
              <div>
                <Spinner 
                  className='justify-content-center align-items-center mx-auto' 
                  name='three-bounce' color='#00B1EF' style={{ width: 100, margin: 250 }}
                  noFadeIn
                />
              </div>
              :
              <div className='wg-content'>
                <Row>
                  <Col md={6}>
                    <InputField 
                      id='firstName' nameLabel='First Name' type='text' 
                      onChange={this.handleChange} value={this.state.firstName}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col md={6}>
                    <InputField 
                      id='lastName' nameLabel='Last Name' type='text' 
                      onChange={this.handleChange} value={this.state.lastName}
                          hasError={this.state.errorAddress}/>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <InputField 
                      id='email' nameLabel='Email' type='text' 
                      onChange={this.handleChange} value={this.state.email}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col md={6}>
                    <label className='wg-label'>Date of Birth</label>
                    {this.displayDOB()}
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <InputField 
                      id='docNum' nameLabel='Document Number' type='text' 
                      onChange={this.handleChange} value={this.state.docNum}
                          hasError={this.state.errorAddress}/>
                  </Col>
                  <Col md={6}>
                    <label className='wg-label'>Country</label>
                    <Select
                      options={this.state.options}
                      value={this.state.value}
                      onChange={this.changeHandler}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <label className='wg-label'>Document Type</label>
                    <Select
                      value={docTypes[this.state.valueDocType]}
                      onChange={this.handleChangeSelectDocType}
                      options={docTypes}
                      placeholder=""
                    />
                  </Col>
                  <Col md={6}>
                    <div style={{paddingTop: '27px'}}>
                      <ReactDropzone
                      
                        style={{position: 'relative', width: '200px', height: '200px', borderWidth: '2px', borderColor: '#f0f0f0', borderStyle: 'dashed', borderRadius: '5px', ariaDisabled: "false"}}

                        accept="image/*"
                        onDrop={this.onFileDrop}
                      >
                        {urlFile === "" ?
                            "Drag & Drop Your Document"
                          :
                          <img
                            src={urlFile}
                            style={previewStyle}
                          />
                        }
                      </ReactDropzone>
                    </div>
                  </Col>
                </Row>
                
                <Row style={{paddingTop: '20px'}}>
                  <Col md={6} className='float-left'>
                    <Button
                      onClick={this.handleSubmit}
                      variant='contained' size='lg' color="secondary"
                    >
                        Submit
                    </Button>
                  </Col>
                </Row>
              </div>
          }
        </div>
    );
  }
}

KycForm.propTypes = {
  id: PropTypes.number.isRequired,
};

export default KycForm;