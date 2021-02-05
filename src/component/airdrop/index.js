import React, {Component} from 'react';
import logo from '../../assets/img/brand/logo-small.png'

import { Navbar, Nav, Badge } from 'react-bootstrap'

import AirdropList from './AirdropList';

class Airdrop extends Component {

  state = {
    radioSelected: 'rinkeby'
  };

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
    console.log('onRadioBtnClick: ', radioSelected);
  }

  render() {
    return (
      <div>
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="info" variant="dark">
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="150"
              height="60"
              alt="Morpheus Labs Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" style={{flex:1,justifyContent: "center",alignItems: "center"}}>
              <Badge pill variant="primary">
                <h3> 
                  Airdrop Tool 
                </h3>
              </Badge>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='page-content'>
          <div className='page-wrapper d-flex flex-column'>
            <div className='step-content'>
              <div className='container step-widget pt-0'>
                <AirdropList
                  radioSelected={this.state.radioSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Airdrop;
