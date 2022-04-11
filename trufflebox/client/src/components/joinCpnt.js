import React from 'react';
import { 
  getPlayers, 
  getIdeaOne, 
  putUpdateIdea,
  putUpdateHold,
  dltHold } from "../api.js";
import './modal.css';

// 子コンポーネント（モーダル）
export class JoinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null,
      title: null,
    };
  }
  
  componentDidUpdate = (prevProps) => {
    console.log(this.props);
    if (this.props.content !== prevProps.content && this.props.content.userId !== undefined){
      this.getTitle(this.props.content.teamId)
      this.getPlayerAddr(this.props.content.userId);
    }
    else{
      console.log('there is no update');
    }
  }
  getTitle = async(_teamId) => {
    const team = await getIdeaOne(_teamId);
    console.log(team.title);
    this.setState({title: team.title});
  }

  getPlayerAddr = async(_userId) => {
    await getPlayers(_userId).then((data) => {
      //console.log('v: ', data);
      this.setState({editor: data.sub});
    })
  }
  
  modalDown = () => this.props.onClick();

  alertStatus = () => {
    const mode = this.props.content.status;
    console.log(mode);
    if(mode === 0){
      return(
        <Type_zero
          content={this.props.content}
          title={this.state.title}
          editor={this.state.editor}
          onClick={this.props.onClick}
        />
      )
    }
    else if(mode === 1){
      return(
        <Type_join
          content={this.props.content}
          title={this.state.title}
          account={this.props.account}
          contract={this.props.contract}
          onClick={this.props.onClick}
        />
      )
    }
    else{
      return(
        <Type_reject
          content={this.props.content}
          title={this.state.title}
          onClick={this.props.onClick}
      />)
    }
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
            <this.alertStatus></this.alertStatus>
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}

class Type_zero extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      account: this.props.account,
    };
  }

  allowJoin = async(_status) => {
    const record = {
      status: _status,
      holdId: this.props.content.id
    }
    await putUpdateHold(record);
  }

  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・참가요청</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.props.title}</p>
          <p>변경내용: {this.props.content.description}</p>
          <p>요구지분: {this.props.content.reqstake}</p>
          <p>투자토큰: {this.props.content.tokn}</p>
          <p>요청자: {this.props.editor}</p>
        </section>
        <button onClick={this.props.onClick}>close</button>
        <button onClick={() => {
          this.allowJoin(1);
          this.modalDown();
        }}>허가함</button>
        <button onClick={() => {
          this.allowJoin(2);
          this.modalDown();
        }}>거부함</button>
        {this.props.content.tokn === null ? ( 
          <button onClick={this.props.onClick}>review</button>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
        
      </>
    )
  }
}

class Type_join extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      account: this.props.account,
    };
  }

  joinIdea = async() => {
    console.log(this.props.content);
    const record = {
      teamid: this.props.content.teamId,
      stake: this.props.content.reqstake,
      userid: this.props.content.userId,
    };
    (async () => {
      await putUpdateIdea(record);
    })();
    await dltHold(this.props.content.id);
  }

  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・참여인정됨</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.props.title}</p>
          <p>변경내용: {this.props.content.description}</p>
          <p>요구지분: {this.props.content.reqstake}</p>
          <p>투자토큰: {this.props.content.tokn}</p>
        </section>
        <button onClick={() => {
          this.joinIdea();
          this.modalDown();
        }}>confirm</button>
      </>
    )
  }
}

class Type_reject extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      account: this.props.account,
    };
  }

  dltIdea = async() => {
    await dltHold(this.props.content.id);
  }
  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・참여거절됨.</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.props.title}</p>
          <p>변경내용: {this.props.content.description}</p>
          <p>요구지분: {this.props.content.reqstake}</p>
          <p>투자토큰: {this.props.content.tokn}</p>
        </section>
        <button onClick={() => {
          this.dltIdea();
          this.modalDown();
        }}>confirm</button>
      </>
    )
  }
}