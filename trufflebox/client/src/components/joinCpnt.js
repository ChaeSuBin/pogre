import React from 'react';
import { Link } from "react-router-dom";
import { getTeamAddr } from './cModalCpnt.js';
import { 
  getPlayers, 
  getIdeaOne, 
  putUpdateIdea,
  putUpdateHold,
  dltHold, 
  getTeamPlayers,
  putPrice} from "../api.js";
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
    else if(mode === 2){
      return(
        <Type_reject
          content={this.props.content}
          title={this.state.title}
          onClick={this.props.onClick}
        />
      )
    }
    else if(mode === 3){
      return(
        <Type_purchase
          content={this.props.content}
          title={this.state.title}
          onClick={this.props.onClick}
      />)
    }
    else if(mode === 4){
      return(
        <Type_purchaseXE
          content={this.props.content}
          title={this.state.title}
          account={this.props.account}
          contract={this.props.contract}
          onClick={this.props.onClick}
      />)
    }
    else if(mode ===5){
      return(
        <Type_bid
        content={this.props.content}
        onClick={this.props.onClick}
      />)
    }
    else{
      console.log('mode err')
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
      title : null,
      content: this.props.content,
      account: this.props.account,
      contract: this.props.contract
    };
  }
  componentDidMount = async() => {
    this.setState({title: await getDocuTitle(this.state.content.team_id)});
  }

  joinIdea = async() => {
    console.log(this.props.content);
    const record = {
      teamid: this.props.content.team_id,
      stake: this.props.content.reqstake,
      userid: this.props.content.user_id,
    };
    
    this.toknTransfer();
    
    (async () => {
      await putUpdateIdea(record);
    })();
    await dltHold(this.props.content.id);
  }

  toknTransfer = async() => {
    let ideaOwner;
    const amount = this.props.content.tokn* 10**18;
    const amountBN = amount.toString();
    //const temp = await this.state.contract.methods.transfer().call();
    await getTeamPlayers(this.props.content.team_id).then((data) => {
      ideaOwner = data[1];
    })
    await this.state.contract.methods.transfer(
      ideaOwner, amountBN).send({ 
        from: this.state.account,
        gas: 50000 
    });
  }

  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・참여인정됨</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.state.title}</p>
          <p>변경내용: {this.props.content.description}</p>
          <p>요구지분: {this.props.content.reqstake}</p>
          <p>투자토큰: {this.props.content.tokn}</p>
        </section>
        <button onClick={() => {
          this.joinIdea();
          // this.modalDown();
        }}>confirm</button>
        <button onClick={this.toknTransfer}>temp</button>
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
class Type_purchase extends React.Component{
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
  changePrice = async() => {
    await putPrice({
      teamId: this.props.content.teamId, 
      price: this.props.content.tokn
    });
  }

  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・거래요청</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>대상문서: {this.props.title}</p>
          <p>지급토큰: {this.props.content.tokn}</p>
        </section>
        <button onClick={this.props.onClick}>close</button>
        <button onClick={() => {
          this.allowJoin(4);
          this.changePrice();
          this.modalDown();
        }}>허가함</button>
        <button onClick={() => {
          this.allowJoin(2);
          this.modalDown();
        }}>거부함</button>
      </>
    )
  }
}
class Type_purchaseXE extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      account: this.props.account,
      contract: this.props.contract
    };
  }

  purchaseIdea = () => {
    getTeamAddr(this.props.content.team_id, this.state.account, this.state.contract);
  }
  dltIdea = async() => {
    await dltHold(this.props.content.id);
  }
  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・거래승인됨</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.props.title}</p>
          <p>가격: {this.props.content.tokn}</p>
        </section>
        <button onClick={() => {
          this.purchaseIdea();
          //this.dltIdea();
        }}>confirm</button>
      </>
    )
  }
}
class Type_bid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      content: this.props.content,
    };
  }
  componentDidMount = async() => {
    this.setState({title: await getDocuTitle(this.state.content.team_id)});
  }
  dltIdea = async() => {
    await dltHold(this.state.content.id);
  }
  modalDown = () => this.props.onClick();

  render(){
    return(
      <>
        <p>・아래와 같이 낙찰되었습니다.</p>
        <section style={{fontSize: "20px", lineHeight: "10px"}}>
          <p>문서제목: {this.state.title}</p>
          <p>입찰토큰: {this.state.content.tokn}</p>
          <p>입찰자: uid-{this.state.content.user_id}</p>
        </section>
        <button onClick={() => {
          //this.dltIdea();
          this.modalDown();
        }}>confirm</button>
        <Link to={'/ideadetails/' + this.state.content.team_id} style={{ textDecoration: 'none' }}>
        <button>해당 문서 이동</button></Link>
        <button>상세 파일 열람</button>
        <button>거래 확정</button>
      </>
    )
  }
}
const getDocuTitle = async(_teamId) => {
  const data = await getIdeaOne(_teamId);
  //console.log(data.title);
  return data.title;
}