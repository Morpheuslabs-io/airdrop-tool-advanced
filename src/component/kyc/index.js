import React, {Component, Suspense} from 'react';
import swal from "sweetalert2";
import logo from '../../assets/img/brand/logo-small.png'
import {Row, Col, Button, ButtonGroup, Container} from 'reactstrap';

import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap'

import KycForm from './KycForm';

class KycContainer extends Component {

  state = {

  };

  render() {

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
              <div className='container step-widget pt-0'>
                <KycForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KycContainer;
