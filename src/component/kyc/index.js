import React, {Component, Suspense} from 'react';
import swal from "sweetalert2";
// import logo from '../../assets/img/logo-small.png'
import {Row, Col, Button, ButtonGroup, Container} from 'reactstrap';

import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap'

import KycForm from './KycForm';

const logo = process.env.REACT_APP_WEB_APP_LOGO_URL

class KycContainer extends Component {

  state = {

  };

  render() {

    console.log('process.env.REACT_APP_EMAIL_WHITELIST:', process.env.REACT_APP_EMAIL_WHITELIST)

    return (
      <div>
        <Navbar fixed="top" collapseOnSelect expand="lg" style={{backgroundColor: '#3d3780'}}>
          <Navbar.Brand>
            <img
              src={logo}
              width="160"
              height="26"
              alt="Morpheus Labs Logo"
            />
            
            <span className='BnBridge-Tool' style={{paddingTop: '10px', paddingLeft: '20px'}}>
              {}
            </span>
          </Navbar.Brand>
        </Navbar>
        <div className='page-content'>
          <div className='page-wrapper d-flex flex-column'>
            <div className='step-content'>
              <div className='container step-widget pt-0' style={{overflowX: 'hidden'}}>
                <KycForm 
                  webcamRefDoc={this.props.webcamRefDoc} 
                  captureDoc={this.props.captureDoc}
                  webcamRefFace={this.props.webcamRefFace} 
                  captureFace={this.props.captureFace}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KycContainer;
