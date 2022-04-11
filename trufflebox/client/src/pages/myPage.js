import logo from '../logo.svg';
import '../components/modal.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListItemsCompnt from '../components/ItemsCpnt';
import { JoinModal } from '../components/joinCpnt';
import ExitCall from '../components/mExitCpnt';
import { registChecker } from '../components/registCatch';
import { getTeams, getIdeaOne, getHold, putUpdateTokn,
  getPlayersId , getPlayers, getHoldEmit
} from '../api.js';

export class UserOpt extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showModal2: false,
      holdTitle: [],
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
  }

  putHoldList = async() => {
    let copyAlert = [...this.state.alertList];
    await getHoldEmit(this.state.ptcp).then((data) => {
      const length = data.length;
      for(let iter = 0; iter < length; ++iter){
        copyAlert.push(data[iter]);
      }
      this.setState({alertList: copyAlert});
    })
  }

  putItemList = async(_iterNum, _copyList, _copyAlert, _teamId) => {
    await getIdeaOne(_teamId[_iterNum]).then((data) => {
      _copyList.push(data);
      this.setState({itemList: _copyList});
    });
    
    if(this.state.itemList[_iterNum] !== null){
      console.log(this.state.itemList[_iterNum]);
      await getHold(this.state.itemList[_iterNum].id).then((data) => {
        const length = data.length;
        
        for(let iter = 0; iter < length; ++iter){
          console.log(data[iter].userId);
          if(data[iter].userId !== this.state.ptcp && data[iter].status === 0){
            _copyAlert.push(data[iter]);
          }
          else{
            console.log('no alert');
          }
          this.setState({alertList: _copyAlert});
          //this.forceUpdate();

          //console.log(data[iter]);
          //_copyAlert.push(data[iter]);
        }
      });
      // this.setState({alertList: _copyAlert});
      //console.log(this.state.alertList);
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

  getTitle = async(_teamId) => {
    const title = await getIdeaOne(_teamId).title;
    console.log(title);
    return title;
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
        <p>관여한 문서 {this.state.count}건.</p>
        {this.state.itemList.map(searchItems => (
          <ListItemsCompnt
            key={searchItems.id}
            title = {searchItems.title}
            description = {searchItems.description}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
        <ExitCall
            showFlag={this.state.showModal2}
            content = {this.state.cont}
            onClick={()=>{this.modalClose()}}
          />
        <p>알림 {this.state.alertList.length}건.</p>
        {this.state.alertList.map(searchItems => (
          <ListItemsCompnt
            key={searchItems.id}
            title = {this.state.holdTitle[searchItems.id]}
            description = {'click to confirm'}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
        <button onClick={this.putHoldList}>alert</button>
        { this.state.alertList.length ? <JoinModal
          showFlag={this.state.showModal}
          content = {this.state.cont}
          account = {this.state.accounts[0]}
          contract = {this.state.contract}
          onClick={()=>{this.modalClose()}}
        />: <></> }
      </div>
    )
  }
}
