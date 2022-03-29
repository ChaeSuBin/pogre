import logo from '../logo.svg';
import '../components/modal.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListItemsCompnt from '../components/ItemsCpnt';
import JoinModal from '../components/joinCpnt';
import ExitCall from '../components/mExitCpnt';
import { registChecker } from '../components/registCatch';
import { getTeams, getIdeaOne, getHold, putUpdateTokn,
  getPlayersId , getPlayers
} from '../api.js';

export class UserOpt extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModal2: false,
      itemList: [],
      alertList: [],
      count: null,
      ptcp: null,
      cont: null,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount = async() => {
    this.setState({ptcp: await registChecker(this.props.accounts[0])});
    this.getPtcpIdeas(this.state.ptcp);
  }

  getPtcpIdeas = async(_uid) => {
    await getTeams(_uid).then((data) => {
      console.log('v: ', data);
      this.setState({count: data.length});
      let copyList = [...this.state.itemList];
      let copyAlert = [...this.state.alertList];
      for(let iter = 0; iter < this.state.count; ++iter){
        this.putItemList(iter, copyList, copyAlert, data);
      }
    });
    //console.log.dig
  }

  putItemList = async(_iterNum, _copyList, _copyAlert,_teamId) => {
    await getIdeaOne(_teamId[_iterNum]).then((data) => {
      _copyList.push(data);
    });
    this.setState({itemList: _copyList});
    //console.log(this.state.itemList);
    if(this.state.itemList[_iterNum] == null){
      console.log('not');
    }
    else{
      await getHold(this.state.itemList[_iterNum].title).then((data) => {
        _copyAlert.push(data);
      });
      this.setState({alertList: _copyAlert});
      console.log(this.state.alertList);
    }
  }

  handleClick = (_searchItems) => {
    console.log('v ', _searchItems);
    this.setState({cont: _searchItems});

    if(_searchItems.ideaToken == null){
      this.setState({showModal: true});
    }
    else{
      this.setState({showModal2: true});
    }
    
  }
  modalClose = () => {
    this.setState({showModal: false});
    this.setState({showModal2: false});
    window.location.reload();
  }

  tempswich = () => {
    console.log('wow');
  }

  render(){
    return(
      <div className="App-header">
        <header >
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p>PROTO : USER</p>
        UID-{this.state.ptcp}
        <Link to="/ntcollect"><button>NFT collection</button></Link>
        <p>관여한 문서 {this.state.count}건이 검색됨.</p>
        {this.state.itemList.map(searchItems => (
          <ListItemsCompnt
            key={searchItems.title}
            title = {searchItems.title}
            description = {searchItems.description}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
        <ExitCall
            account={'this.state.accounts'} showFlag={this.state.showModal2}
            content = {this.state.cont}
            onClick={()=>{this.modalClose()}}
          />
        <p>참가 요청 {this.state.alertList.length}건이 검색됨.</p>
        {this.state.alertList.map(searchItems => (
          <ListItemsCompnt
            key={searchItems.title}
            title = {searchItems.title}
            description = {searchItems.description}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
        { this.state.alertList.length ? <JoinModal
          account={'this.state.accounts'} showFlag={this.state.showModal}
          content = {this.state.cont}
          onClick={()=>{this.modalClose()}}
        />: <></> }
        
        <PurchasePoint
          account={this.state.accounts[0]} contract={this.state.contract}
        />
        <VendingMachin
          account={this.state.accounts[0]} contract={this.state.contract}
        />
      </div>
    )
  }
}
class VendingMachin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mytoken: 0,
      account: this.props.account,
      contract: this.props.contract
    };
  }
  componentDidMount = async() => {
    const btokn_balance = await this.state.contract.methods.balanceOf(
      this.state.account).call();
    this.setState({mytoken: btokn_balance});
    console.log(btokn_balance);
  }

  CA_BalButton = async() => {
    const response = await this.state.contract.methods.ca_ethBal().call();
    console.log(response);
  }
  sellTokn = async() => {
    const balanceOfCA = await this.state.contract.methods.ca_ethBal().call();
    const mytoken = this.state.mytoken / 100;
    const BN = mytoken.toString();
    //console.log(mytoken, BN);
    if(balanceOfCA > mytoken){
      await this.state.contract.methods.sellTokn(BN).send(
        { from: this.state.account });
    }
    else{
      console.log('no remain eth of ca address');
    }
  }

  render(){
    return(
      <div>
        <p>-----Vending Machin-----</p>
        <button onClick={this.CA_BalButton}>ca-ethBal</button>
        <button onClick={this.sellTokn}>sell-001</button>
        <p>B-Tokn: {this.state.mytoken/(10 * 10 ** 17)}</p>
      </div>
    )
  }
}

class PurchasePoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mytoken: 0,
      amount: 0,
      account: this.props.account,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount = async() => {
    const playerId = await getPlayersId(this.state.account);
    //console.log('l: ', playerId.token);
    this.setState({mytoken: playerId.token});
  }

  createRecord = async() => {
    const record = {
      useraddr: this.state.account,
      token: this.state.amount
    }
    await putUpdateTokn(record);
  }

  handleFormSubmit = async(evt) => {
    const price = this.state.amount * 10**16;
    const BN = price.toString();
    alert('was submitted: ' + price);
    await this.state.contract.methods.changePoint(this.state.amount, BN).send(
      { from: this.state.account,
        gas: 3000000,
        value: price
       });
    evt.preventDefault();
    this.createRecord();
  }
  handleOnChange = (evt) => {
    this.setState({amount: evt.target.value});
  }

  render(){
    return(
      <div>
        <p>-----purchase func-----</p>
        <input name="name" className="input" placeholder='token amount' 
              value={this.state.item} onChange={this.handleOnChange}/>
        <button onClick={this.handleFormSubmit} className="btn-trx">
          purchase</button>
        <p>T-Tokn: {this.state.mytoken}</p>
      </div>
    )
  }
}