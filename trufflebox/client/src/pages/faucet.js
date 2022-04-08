import logo from '../logo.svg';
import '../App.css';
import React from 'react';
import { 
  getMintedTokn,
  putUpdateTokn,
  getPlayersId
} from "../api.js";

export class Faucet extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      possesTokn: 0,
      mintedBlue: 0,
      myTokn: 0,
      myPoint: 0,
      storedEth: null, //this.props.storedEth,
      account: this.props.account,
      contract: this.props.contract
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps){
      this.setState({storedEth: this.props.storedEth});
    }
    else{
      console.log('there is no update');
    }
  }

  componentDidMount = () => {
    this.setState({storedEth: this.props.storedEth});
    this.getContractTokn();
    this.getAllPoint();
    this.getMyPoint();
    this.getMyTokn();
  }

  getMyTokn = async() => {
      const myTokn_amount = await this.state.contract.methods.balanceOf(
          this.state.account).call();
      //this.setState({myTokn: myTokn_amount / 10**18});
      this.setState({myTokn: myTokn_amount});
  }

  getMyPoint = async() => {
      const player = await getPlayersId(this.state.account);
      this.setState({myPoint: player.token});
  }
  getContractTokn = async() => {
    const tokn_amount = await this.state.contract.methods.balanceOf('0xB07a335b1e8dd472Cb63FAdF58edAEAeA75E7832').call();
    this.setState({possesTokn: tokn_amount});
    //console.log(tokn_amount);
  }

  getAllPoint = async() => {
    const bluePoint = await getMintedTokn();
    this.setState({mintedBlue: bluePoint});
  }

  faucet = async() => {
    const record = {
      useraddr: this.state.account,
      token: 5
    }
    await putUpdateTokn(record);
  }

  render(){
    return(
      <div className="App">
        <p style={{textAlign: 'left', margin: 0}}> {this.state.account} </p>
        <header className="App-header">
          <br/>
          <section className="App-display">
            contract Ether : { this.state.storedEth /10 ** 18 } <br/>
            contract Token: { this.state.possesTokn / 10 ** 18 } <br/>
            minted all blue: { this.state.mintedBlue }
          </section>
          <img src={logo} className="App-logo" alt="logo" />
          <section className="App-display">
            my BLUE : { this.state.myPoint } <br/>
            my RED : { this.state.myTokn / 10 ** 18 } <br/>
          
          <button onClick={this.faucet}>faucet</button><br/>
          <PurchasePoint 
            account={this.state.account} contract={this.state.contract}
          /> <br/>
          <VendingMachin
            account={this.state.account} contract={this.state.contract}
            storedEth={this.state.storedEth}
          /> <br/>
          </section>
      </header>
    </div>
    )
  }
}

class VendingMachin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sellToknAmount: 0,
        discharge: 0,
        storedEth: null, //this.props.storedEth
        account: this.props.account,
        contract: this.props.contract
      };
    }

    // componentDidMount = () => {
    //     this.setState({storedEth: this.props.storedEth});
    // }
    
    // componentDidUpdate = (prevProps) => {
    //   if (this.props.storedEth !== prevProps.storedEth){
    //     this.setState({storedEth: this.props.storedEth});
    //   }
    //   else{
    //     console.log('there is no update');
    //   }
    // }
    
    sellTokn = async() => {
      const discharge = this.state.discharge * 10000;
      const toknAmount = this.state.sellToknAmount * 10000;
      //console.log(discharge);
      if(this.state.storedEth > discharge * 10 ** 14){
        await this.state.contract.methods.sellTokn(discharge, toknAmount).send(
          { from: this.state.account });
      }
      else{
        console.log('no remain eth of ca address');
      }
    }

    inputRED = (evt) => {
        this.setState({sellToknAmount: evt.target.value});
    }
    checkDischarge = () => {
        const discharge = this.state.sellToknAmount * 0.0008;
        this.setState({storedEth: this.props.storedEth});
        this.setState({discharge: discharge});
        //console.log(this.state.discharge);
    }

    tempbutton = () => {
        console.log(this.state.storedEth);
    }
  
    render(){
      return(
        <div>
          ----------Sell RED <br/>
          <input name="name" className="input" placeholder='amount RED will be sell' 
            onChange={this.inputRED}/> <br/>
          {this.state.discharge} ETH
          <button onClick={this.checkDischarge}>check</button>
          <button className="App-exeButton" onClick={this.sellTokn}>exchange</button>
        </div>
      )
    }
  }

class PurchasePoint extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        buttonMode: true,
        myBlue: 0,
        willUseBlue: 0,
        amount: 0, //will purchase RED amount
        discharge: 0,
        account: this.props.account,
        contract: this.props.contract
      };
    }
  
    componentDidMount = async() => {
    }
  
    createRecord = async() => {
      const record = {
        useraddr: this.state.account,
        token: this.state.willUseBlue,
        mode: 'min'
      }
      await putUpdateTokn(record);
    }
    handleFormSubmit = async(evt) => {
      if(this.state.buttonMode){
        const price = this.state.discharge * 10**18;
        const BN = price.toString();
        const requiredRed = this.state.amount * 10000;
        alert('was submitted: ' + price);
        await this.state.contract.methods.changePoint(requiredRed, BN).send(
            { from: this.state.account,
            gas: 3000000,
            value: price
            });
        evt.preventDefault();
        this.createRecord();
      }
      else{
        const requiredRed = this.state.discharge * 10000;
        await this.state.contract.methods.changePoint(requiredRed, 0).send(
          { from: this.state.account,
            gas: 3000000,
            value: 0
          });
        evt.preventDefault();
        this.createRecord();
      }
      
    }

    inputRED = (evt) => {
      this.setState({amount: evt.target.value});
    }
    inputBLUE = (evt) => {
      this.setState({willUseBlue: evt.target.value});
    }

    checkDischarge = async(evt) => {
      //const price = this.state.amount * 10**16 - this.state.willUseBlue * 10**12
      const price = this.state.amount / 1000 - this.state.willUseBlue * 0.00001;
      //console.log(price);
      if(price < 0){
        this.setState({buttonMode: false});
        if(this.state.willUseBlue > 99 && this.state.willUseBlue % 100 == 0){
            const requiredRed = this.state.willUseBlue / 100;
            this.setState({discharge: requiredRed});
        }
        else{
            console.log('err339');
        }
      }
      else{
        this.setState({buttonMode: true})
        this.setState({discharge: price});
      }
    }
  
    render(){
      return(
        <div className=''>
          ----------get RED(B-Tokn) <br/>
          <input name="name" className="input" placeholder='amount RED will purchase' 
            onChange={this.inputRED}/> <br/>
          <input name="name" className="input" placeholder='Blue to use' 
            onChange={this.inputBLUE}/> <br/>
          {this.state.discharge} {this.state.buttonMode ? <>ETH</> 
          : <>RED</>}
          <button onClick={this.checkDischarge}>check</button>
          <button className="App-exeButton" onClick={this.handleFormSubmit}>exchange</button>
        </div>
      )
    }
  }