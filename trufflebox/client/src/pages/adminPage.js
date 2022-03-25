import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getTeamPlayers, putUpdateBlock } from '../api.js';

export class AdminOpt extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      ptcp: [],
      stake: [],
      price: 0,
      item: '',
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getTeamAddr = async(_teamId) => {
    const history = await getTeamPlayers(_teamId);
    //this.setState({itemList: history});
    console.log('h ', history);
    let copyPtcp = [...this.state.ptcp];
    let copyStake = [...this.state.stake];
    this.despenser(_teamId, history, copyPtcp, copyStake);
  }
  despenser = (_teamId, _history, _copyPtcp, _copyStake) => {
    const ptcpLen = _history.length;
    let iter = 1;
    // _copyStake.push(_history[0]); <- this is team title
    this.setState({price: _history[0]});
    while(iter != ptcpLen){
      _copyPtcp.push(_history[iter]);
      _copyStake.push(_history[iter+1]);
      iter += 2;
    }
    this.setState({ptcp: _copyPtcp});
    this.setState({stake: _copyStake});
    //console.log('v ', this.state.ptcp);
    const allotArr = allotVar(this.state.stake, this.state.price);
    console.log('v: ', allotArr);
    this.setBlockChain(_teamId, allotArr);
  }
  setBlockChain = async(_teamId, _allotStake) => {
    console.log('v ', _teamId, this.state.ptcp, this.state.stake);
    await this.state.contract.methods.putBlock(
      _teamId,
      this.state.ptcp,
      _allotStake,
      this.state.price
    ).send({ from: this.state.accounts[0] });
    this.createRecord();
  }
  createRecord = async() => {
    const record = {
      teamId: this.state.item,
      blocked: true,
      display: true
    }
    await putUpdateBlock(record);
  }

  handleFormSubmit = (evt) => {
    alert('was submitted: ' + this.state.item);
    this.getTeamAddr(this.state.item);
    evt.preventDefault();
  }
  handleOnChange = (evt) => {
    this.setState({item: evt.target.value});
  }
  getptcp = async() => {
    let ptcp = await this.state.contract.methods.getPtcp(this.state.item).call();
    console.log(ptcp);
  }

  render(){
    return(
      <div className="App-header">
        <header >
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p>PROTO : MINT</p>
        <form onSubmit={this.handleFormSubmit}>
            <input name="name" className="input" placeholder='teamId' 
              value={this.state.item} onChange={this.handleOnChange}/>
            <p></p><button type="submit" className="button is-warning">
            chain
            </button>
        </form>
        <button onClick={this.getptcp}>ptcp</button>
      </div>
    )
  }
}

const allotVar = (_stake, _price) => {
  const stakeLen = _stake.length;
  let conversionFactor = [];
  let total = 0;
  let iter = 0;

  while(iter != stakeLen){
    total += _stake[iter++];
  }iter = 0;
  //const resultVar = (5*1000)/(145*5*145);
  const resultVar = (_price*1000)/(total**2*_price);

  while(iter != stakeLen){
    const cf = total*_price*_stake[iter++]*resultVar;
    conversionFactor.push(parseInt(cf));
  }
  //console.log('r: ', conversionFactor);
  return conversionFactor;
}