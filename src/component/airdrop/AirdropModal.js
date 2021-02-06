import React, { Component } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Collapse,
  Alert,
  Row, Col
} from 'reactstrap'
import Spinner from 'react-spinkit'
import swal from "sweetalert2";
import {getNormalGasPrice} from "../../util/Util";

import AIRDROP_CONTRACT from '../../artifacts/Airdrop';

const BATCH_SIZE_MAX = process.env.REACT_APP_BATCH_SIZE_MAX;


const GASLIMIT = process.env.REACT_APP_GASLIMIT

class AirdropModalContainer extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      tokenInfo: {},

      airdropAddressBatch: [],
      airdropAmountBatch: [],
      airdropTokenAmount: 0,
      airdropReceiverAmount: 0,
      gasPrice: 0,

      metamaskNet: ''
    }

    this.erc20ContractInst = null
    this.erc20ABI = null
  }

  handleAirdropWithMetaMask = () => {
    let {tokenInfo, airdropTokenAmount, airdropAddressBatch, airdropAmountBatch} = this.state

    console.log('airdropAddressBatch:', airdropAddressBatch);
    console.log('airdropAmountBatch:', airdropAmountBatch);

    if (!tokenInfo.name || tokenInfo.name === '' || isNaN(tokenInfo.userBalance)) {
      swal('Error', `The specified token does not exist on ${this.state.metamaskNet}`)
      return
    }
    
    // Check if user has enough tokens for airdrop
    if (parseFloat(airdropTokenAmount) > parseFloat(tokenInfo.userBalance)) {
      swal('Error', 'Not enough tokens for doing airdrop')
      return
    }

    this.props.setIsProcessing(true)
    this.props.setResourceHandleErr(false)

    this.approveAndDoAirdrop()
  }

  getAllowance = () => {
    let {tokenInfo, airdropContractAddress} = this.state
    let instance = this.erc20ContractInst

    return new Promise((resolve, reject) => instance.methods.allowance(this.props.web3.eth.defaultAccount, airdropContractAddress, (err, res) => {
      if (err) return reject(err);
      else return resolve(Number(res));
    }));
  };

  doAirdrop = async (erc20Address, addresses, amounts) => {
    const {web3, airdropAddress} = this.props
    const instance = new web3.eth.Contract(AIRDROP_CONTRACT.abi, airdropAddress);
  
    console.log('doAirdrop - erc20Address:', erc20Address, ', airdropAddress:', airdropAddress, ', addresses:', addresses, ', amounts:', amounts);
    
    return new Promise((resolve, reject) => {
      instance.methods.doAirDrop(erc20Address, amounts, addresses)
        .send({from: web3.eth.defaultAccount})
          .on('confirmation', (confirmationNumber, receipt) => {
            resolve(receipt.transactionHash)
          })
          .on('error', (error => {
            reject(error)
          }))
      })
  };

  doAirdropBatch = (erc20Address, airdropContractAddress, airdropAddressBatch, airdropAmountBatch, i) => {
    
    this.doAirdrop(erc20Address, airdropAddressBatch[i], airdropAmountBatch[i])
      .then(res => {
        console.log('doAirdrop (index:', i, ') - res:', res);
        if (++i < airdropAddressBatch.length) {
          this.doAirdropBatch(erc20Address, airdropContractAddress, airdropAddressBatch, airdropAmountBatch, i)
        } else {
          this.props.setIsProcessing(false)
          this.props.setResourceHandleErr('Success')
        }
      })
  }

  approveAndDoAirdrop = () => {
    let {tokenInfo, airdropTokenAmount, gasPrice, airdropAddressBatch, airdropAmountBatch} = this.state
    let instance = this.erc20ContractInst
    
    // const GAS = process.env.REACT_APP_GAS;
    // const GASPRICE = process.env.REACT_APP_GAS_PRICE;

    const airdropContractAddress = this.props.airdropAddress

    const gasOpt = {
      gas: GASLIMIT,
      gasPrice: gasPrice,
      from: this.props.web3.eth.defaultAccount
    };

    airdropTokenAmount *= 10**tokenInfo.decimals
    let i=0

    this.getAllowance()
      .then(allowance => {
        if (allowance === 0) {
          console.log('approveAndDoAirdrop - No allowance yet');

          return new Promise((resolve, reject) => instance.approve(airdropContractAddress, airdropTokenAmount, gasOpt, (err, res) => {
            if (err) return reject(err);
            else {
              console.log('approveAndDoAirdrop for allowance:', res);
              
              setTimeout(() => {
                this.doAirdropBatch(tokenInfo.address, airdropContractAddress, airdropAddressBatch, airdropAmountBatch, i)
              }, 30*1000);

              return resolve(res);
            }
          }));

        } else {
          console.log('approveAndDoAirdrop - Has already allowance:', allowance);

          // First, must approve 0
          return new Promise((resolve, reject) => instance.approve(airdropContractAddress, 0, gasOpt, (err, res) => {
            if (err) return reject(err);
            else {
              console.log('approveAndDoAirdrop for 0 allowance:', res);
              return new Promise((resolve, reject) => instance.approve(airdropContractAddress, airdropTokenAmount, gasOpt, (err, res) => {
                if (err) return reject(err);
                else {
                  console.log('approveAndDoAirdrop for allowance:', res);
                  
                  setTimeout(async () => {
                    this.doAirdropBatch(tokenInfo.address, airdropContractAddress, airdropAddressBatch, airdropAmountBatch, i)
                  }, 30*1000);

                  return resolve(res);
                }
              }));
            }}
          ));
        }
      });
  }

  getERC20TokenDetails = async (erc20Address) => {

    this.erc20ContractInst = new this.props.web3.eth.Contract(this.erc20ABI, erc20Address)
    console.log('erc20Address:', erc20Address);

    let instance = this.erc20ContractInst
    const name = await instance.methods.name().call()
    console.log(name);

    const symbol = await instance.methods.symbol().call()
    console.log(symbol);

    const decimals = await instance.methods.decimals().call()
    console.log(decimals);

    const userBalance = await instance.methods.balanceOf(this.props.web3.eth.defaultAccount).call()
    console.log(userBalance);

    return {
      name,
      symbol,
      decimals,
      userBalance: Number(userBalance) / 10**Number(decimals),
    };
  }

  componentWillReceiveProps(nextProps) {
    const {web3} = this.props
    if (this.props.erc20Address !== nextProps.erc20Address) {
      let erc20Address = nextProps.erc20Address
      // console.log('erc20Address:', erc20Address);
      if (erc20Address && web3.utils.isAddress(erc20Address)) {
        this.getERC20TokenDetails(erc20Address, this.props.web3.eth.defaultAccount)
          .then(tokenInfo => {
            tokenInfo.address = erc20Address
            this.setState({
              tokenInfo
            })

            getNormalGasPrice().then(gasPrice => {
              console.log('gasPrice:', gasPrice);
              this.setState({
                gasPrice
              })
            })
          })
      }
    }

    if (this.props.airdroplist !== nextProps.airdroplist) {
      let airdroplist = nextProps.airdroplist
      // console.log('airdroplist:', airdroplist);
      let airdropTokenAmount = 0
      
      let airdropAddressBatch = []
      let airdropAddressBatchEntry = []

      let airdropAmountBatch = []
      let airdropAmountBatchEntry = []

      for (let i=0; i<airdroplist.length; i++) {
        let airdropListEntry = airdroplist[i]
        // console.log('airdropListEntry:', airdropListEntry);
        airdropTokenAmount += parseFloat(airdropListEntry.amount)

        if (airdropAddressBatchEntry.length >= BATCH_SIZE_MAX) {
          airdropAddressBatch.push(airdropAddressBatchEntry)
          airdropAmountBatch.push(airdropAmountBatchEntry)

          airdropAddressBatchEntry = []
          airdropAmountBatchEntry = []
        }

        airdropAddressBatchEntry.push(airdropListEntry.address)
        airdropAmountBatchEntry.push(airdropListEntry.amount * (10**this.state.tokenInfo.decimals))
      }

      airdropAddressBatch.push(airdropAddressBatchEntry)
      airdropAmountBatch.push(airdropAmountBatchEntry)

      this.setState({
        airdropAddressBatch,
        airdropAmountBatch,
        airdropTokenAmount,
        airdropReceiverAmount: airdroplist.length
      })
    }
  }

  async componentDidMount() {
    let {web3, erc20Address} = this.props
    this.erc20ABI = await (await fetch("./erc20.abi.json")).json();
  }

  render () {
    const { tokenInfo, airdropTokenAmount, airdropReceiverAmount } = this.state
    const { showModal, isProcessing, handleToggleModal, erc20Address, resourceHandleErr } = this.props
    return (
      <div>
        <Modal
          isOpen={showModal}
          className={this.props.className}
          size='lg'
        >
          <ModalHeader toggle={handleToggleModal}>
            <div>Please confirm the following Airdrop </div>
          </ModalHeader>
          <ModalBody>
            <div>
              <Collapse isOpen={resourceHandleErr !== false} size='sm'>
                {resourceHandleErr === 'Success' ? (
                  <Alert color='success'>
                    <div>
                      <div>
                        <b>Airdrop done! Please check transactions on EtherScan via your Metamask</b>
                      </div>
                    </div>
                  </Alert>
                ) : (
                  <Alert color='danger'>{resourceHandleErr}</Alert>
                )}
              </Collapse>
            </div>
            <div>
              <ul>
                <li>
                  <b> Token info </b>
                    <ul>
                      <li>
                        Address: {erc20Address}
                      </li>
                      <li>
                        Name: {tokenInfo.name}
                      </li>
                      <li>
                        Symbol: {tokenInfo.symbol}
                      </li>
                      <li>
                        Decimals: {tokenInfo.decimals}
                      </li>
                    </ul>
                </li>
                <li>
                  <b> Airdrop token amount: </b> {new Intl.NumberFormat().format(airdropTokenAmount)}
                </li>
                <li>
                  <b> Airdrop receiver amount: </b> {new Intl.NumberFormat().format(airdropReceiverAmount)}
                </li>
                <li>
                  <b> Your current token balance: </b> {new Intl.NumberFormat().format(tokenInfo.userBalance)}
                </li>
                <li>
                  <b> Your current account address: </b> {this.props.web3.eth.defaultAccount}
                </li>
                <li>
                  <b> Your current network: </b> {this.props.checkNetwork()}
                </li>
              </ul>
            </div>
            <div>
              <Row>
                <Col className='float-left'>
                  <Button
                    color='primary'
                    onClick={() => {this.handleAirdropWithMetaMask()}}
                  >
                    {isProcessing ?
                      <Spinner
                        name='three-bounce'
                        color='white'
                        fadeIn='none'
                      />
                      : 
                      <span>Submit</span>
                    }
                  </Button>
                </Col>
                <Col className='float-right'>
                  <Button
                    color='secondary'
                    onClick={handleToggleModal}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default AirdropModalContainer;