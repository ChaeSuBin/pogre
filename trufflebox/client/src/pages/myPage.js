import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { Link } from 'react-router-dom';
import {ListItemsCompnt, AlertCardCpnt} from '../components/ItemsCpnt';
import { JoinModal } from '../components/joinCpnt';
import { Modal } from'../components/cModalCpnt';
import { registChecker } from '../components/registCatch';
import { getTeams, getIdeaOne, getHoldBid, getHoldBidPtcp
} from '../api.js';

export class UserOpt extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ptcp: null,
      viewmode: 0,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount = async() => {
    this.setState({ptcp: await registChecker(this.props.accounts[0])});
    //this.getPtcpIdeas(this.state.ptcp);
  }
  
  setShowIdea = () => {
    const type = this.state.viewmode;
    if(type === 0){
      return(
        <>
        <p style={{margin: 15, fontSize: "19px"}}>
          my idea 버튼: 관여하거나 등록한 아이디어를 화면에 표시합니다<br/>
        alert 버튼: 수신된 알림을 화면에 표시합니다.</p></>
      )
    }
    else if(type === 2){
      return(
        <Type_alert
          ptcp={this.state.ptcp}
          account = {this.state.accounts[0]}
        />
      )
    }
    else if(type === 1){
      return(
        <Type_viewIdea
          ptcp={this.state.ptcp}
          account = {this.state.accounts[0]}
        />
      )
    }
    // else{
    //   return(
    //     <Type_request
    //       ptcp={this.state.ptcp}
    //       account = {this.state.accounts[0]}
    //     />
    //   )
    // }
  }

  // getTitle = async(_teamId) => {
  //   const title = await getIdeaOne(_teamId).title;
  //   console.log(title);
  //   return title;
  // }

  setViewMode = (_mode) => {
    this.setState({viewmode: _mode});
  }

  render(){
    return(
      <div className="App-header">
        <header >
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
        </header>
        USER ID-{this.state.ptcp}
        <div>
          <Link to="/ntcollect"><button>NFT collection</button></Link>
          <button onClick={() => {this.setViewMode(1)}}>my idea</button>
          <button onClick={() => {this.setViewMode(2)}}>alert</button>
          {/* <button onClick={() => {this.setViewMode(3)}}>request</button> */}
        </div>
        <this.setShowIdea></this.setShowIdea>
      </div>
    )
  }
}
class Type_viewIdea extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      alertList: [],
      count : null,
      cont: null,
      ptcp: this.props.ptcp,
      account: this.props.account,
    };
  }
  componentDidMount = async() => {
    const _uid = this.state.ptcp;
    console.log(_uid);
    await getTeams(_uid).then((data) => {
      console.log('v: ', data);
      this.setState({count: data.length});
      let copyList = [...this.state.itemList];
      for(let iter = 0; iter < this.state.count; ++iter){
        this.putItemList(iter, copyList, data);
      }
    });
  }
  putItemList = async(_iterNum, _copyList, _teamId) => {
    await getIdeaOne(_teamId[_iterNum]).then((data) => {
      _copyList.push(data);
      this.setState({itemList: _copyList});
    })
  }

  handleClick = (_searchItems) => {
    console.log('v ', _searchItems);
    this.setState({cont: _searchItems});
    this.setState({showModal: true})
  };
  modalClose = () => {
    this.setState({showModal: false}) 
    window.location.reload();
  };

  render(){
    return(
      <>
        <p>관여한 문서 {this.state.count}건.</p>
        {this.state.itemList.map(searchItems => (
          <ListItemsCompnt
            key={searchItems.id}
            title = {searchItems.title}
            description = {searchItems.description}
            teamid = {searchItems.id}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
      </>
    )
  }
}
class Type_alert extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      alertList: [],
      cont: null,
      ptcp: this.props.ptcp,
      account: this.props.account
    };
  }
  componentDidMount = async(_) => {
    let copyAlert = [...this.state.alertList];
    console.log(this.state.ptcp);
    
    await getHoldBidPtcp(this.state.ptcp).then((data) => {
      console.log(data);
      
      const length = data.length;
      for(let iter = 0; iter < length; ++iter){
        copyAlert.push(data[iter]);
      }
    })
    this.setState({alertList: copyAlert});
  }
  modalClose = () => {
    this.setState({showModal: false});
    window.location.reload();
  }
  handleClick = (_searchItems) => {
    console.log('v ', _searchItems);
    this.setState({cont: _searchItems});
    this.setState({showModal: true});
  }

  render(){
    return(
      <>
        <p>알림 {this.state.alertList.length}건.</p>
        {this.state.alertList.map(searchItems => (
          <AlertCardCpnt
            key={searchItems}
            title = {'경매장 낙찰 알림'}
            description = {'click to check'}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
        <JoinModal
          showFlag={this.state.showModal}
          content = {this.state.cont}
          account = {this.state.account}
          contract = {this.state.contract}
          onClick={()=>{this.modalClose()}}
        />
      </>
    )
  }
}
