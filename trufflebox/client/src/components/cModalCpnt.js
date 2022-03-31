import React from 'react';
import { 
  getIdeaPlayers, getPlayers, 
  getIdeaPoints, putUpdateTokn, 
  dltTeam, getPlayersId, putFundIdea,
  putViewIdea, getDcuDown  } from "../api.js";
import { Link } from "react-router-dom";
import './modal.css';

// 子コンポーネント（モーダル）
export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editors: [],
      points: [],
      score: 0,
    };
  }
  
  componentDidUpdate = (prevProps) => {
    //console.log(this.props);
    if (this.props.content !== prevProps.content){
      this.getPlayer();
    }
    else{
      console.log('there is no update');
    }
    //this.getPlayer();
  }
  
  getPlayer = async() => {
    if(this.props.content == null){
      console.log('-');
    }
    else{
      //console.log(props.content.origin);
      let ideaid = this.props.content.id;
      await getIdeaPoints(ideaid).then((data) => {
        let copyPoint = [...this.state.points];
        let tempScore = 0;
        //copyPoint.push(100);
        for(let iter = 0; iter < data.length; ++iter){
          console.log(data[iter]);
          copyPoint.push(data[iter]);
          this.setState({points: copyPoint});
          tempScore += data[iter];
        }
        console.log(this.state.points);
        this.setState({score: tempScore});
      });
      await getIdeaPlayers(ideaid).then((data) => {
        let copyEditors = [...this.state.editors];
        for(let iter = 0; iter < data.length; ++iter){
          //console.log(data[iter].playerId);
          this.innerSync(data[iter].playerId, copyEditors);
        }
      });
    }
  }
  
  innerSync = async(_playerId, _copyEditors) => {
    const p = await getPlayers(_playerId);
    _copyEditors.push(p.sub);
    this.setState({editors: _copyEditors});
    //console.log('e: ',this.state.editors);
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents">
            <div>
              <p>{this.props.content.title}</p>
              <ul><div style={{fontSize: "15px"}}>이 아이디어에 아래의 참가자가 참가중</div>
                {this.state.editors.map((editor, index) => (
                  <li key={index}>
                    {editor} :-: {((this.state.points[index]/this.state.score)*100).toFixed(2)}%
                  </li>
                ))}
              </ul>
                <IdeaStatus
                  content={this.props.content}
                  onClick={this.props.onClick}
                  ptcps={this.state.editors}
                  contract={this.props.contract}
                  account={this.props.account}
                />
            </div>
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}

class IdeaStatus extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      userInput: 100000,
      showresult: false,
      allowcheck: false,
      // downlink: 'http://127.0.0.1:3039/downloadfile/',
      downlink: 'http://giparang.asuscomm.com:3039/downloadfile/',
      account: this.props.account,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount = async() => {
    const price = await this.state.contract.methods.getPrice(
      this.props.content.id).call();
    console.log('v :', price);
    this.setState({value: price});
  }

  createRecord = async() => {
    const record = {
      useraddr: this.state.account,
      token: this.state.value,
      mode: 'min'
    }
    await putUpdateTokn(record);
  }
  
  Purchase = async() => {
    console.log(this.props.content.id);
    console.log(this.state.account, this.props.ptcps);
    
    await this.state.contract.methods.purchase(
      this.props.content.id,
      this.state.account,
      this.props.ptcps
    ).send({ from: this.state.account });
    this.createRecord();
  }

  ideaFunding = async() => {
    this.setState({showresult: true});
    
    const userinfo = await getPlayersId(this.state.account);
    
    if(userinfo.token > this.state.userInput){
      const record = {
        useraddr: this.state.account,
        token: this.state.userInput,
        mode: 'min'
      };
      (async ()=> {
        await putUpdateTokn(record);
      })();
      this.excuteFunding(this.state.userInput, userinfo.id);
      console.log(this.props.content);
    }
    else{
      console.log('not enougth');
    }
  }

  excuteFunding = async(_stake, _userId) => {
    //console.log('k ', _stake,'u ', _userId);
    const record = {
      name: this.props.content.title,
      stake: _stake,
      userid: _userId
    };
    await putFundIdea(record);
  }

  updateInput = (_evt) => {
    console.log(_evt.target.value,)
    this.setState({userInput: _evt.target.value,});
  }

  docuDown = async() => {
    const result = window.confirm('You agree to keep this document confidential.\r\nYou can be legally responsible for unauthorized distribution.');
    const link = this.state.downlink + this.props.content.title;
    console.log(link);
    if(result){
      this.setState({allowcheck: true});
      this.setState({downlink: link});
    }
    else
      alert('disapproval');
    
    //await getDcuDown(this.props.content.title);
  }

  ideaStatus = () => {
    const mode = this.branch();
    if(mode === true){
      return(<>
        <button onClick={this.props.onClick}>Close</button>
        <button onClick={this.docuDown}>Download</button>
        <button onClick={this.Purchase}>Purchase</button>
        <p style={{margin: 0, fontSize: "15px"}}>status: progress</p>
        <p style={{margin: 0}}>value: {this.state.value}</p>
      </>)
    }
    else{
      return(<>
        <button onClick={this.props.onClick}>Close</button>
        <button onClick={this.docuDown}>Download</button>
        <Link to={{
          pathname: '/joinup',
          search: `title=${this.props.content.title}`,
          hash: `origin=${this.props.content.origin}`,
          state: {key: 'valuee'}
        }}>
        <button onClick={this.joinIdea}>Join</button>
        </Link>
        <button onClick={this.ideaFunding}>Fund</button>
        { this.state.showresult ? <input name="amount" className="input" 
        onChange={this.updateInput}/> : null }
        <p style={{margin: 0, fontSize: "15px"}}>status: cycle</p>
      </>)
    }
  }

  branch = () => {
    //true = progress, false = cycle
    if(this.props.content.cycle === this.props.content.blocked){
      return true;
    }
    else if(this.props.content.cycle === false){
      return true; 
    }
    else{
      return false;
    }
  }
  btn_d32 = async() => {
    await dltTeam(1);
  }
  render(){
    return(
      <div>
        <this.ideaStatus></this.ideaStatus>
        {this.state.allowcheck ? <a id="btn" 
        href={this.state.downlink}>download link</a>
         : null}
        {/* <button onClick={this.btn_d32}>btn_d32</button> */}
      </div>
    )
  }
}