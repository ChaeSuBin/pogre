import React from 'react';
import { getPlayers, getIdeaPoints, putUpdateIdea, dltHold } from "../api.js";
import './modal.css';

// 子コンポーネント（モーダル）
class JoinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editors: null,
    };
  }
  
  componentDidUpdate = (prevProps) => {
    console.log(this.props);
    if (this.props.content !== prevProps.content){
      //this.getPlayerAddr(this.props.content.id);
    }
    else{
      console.log('there is no update');
    }
  }

  getPlayerAddr = async(_userId) => {
    await getPlayers(_userId).then((data) => {
      //console.log('v: ', data);
      this.setState({editors: data.sub});
    })
  }
  
  joinIdea = async() => {
    //console.log(this.props.content);
    const record = {
      name: this.props.content.title,
      desc: this.props.content.description,
      stake: this.props.content.reqstake,
      userid: this.props.content.userId,
    };
    (async () => {
      await putUpdateIdea(record);
    })();
  }
  dltIdea = async() => {
    console.log('d');
    await dltHold(this.props.content.id);
  }
  modalDown = () => this.props.onClick()
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
            <div>
              <p>・승인요청</p>
              <section style={{fontSize: "20px", lineHeight: "10px"}}>
                <p>문서제목: {this.props.content.title}</p>
                <p>변경내용: {this.props.content.description}</p>
                <p>요구지분: {this.props.content.reqstake}</p>
                <p>요청자: {this.state.editors}</p>
              </section>
              <button onClick={() => {
                this.joinIdea();
                this.dltIdea();
                this.modalDown();
              }}>허가함</button>
              <button onClick={() => {
                this.dltIdea();
                this.props.onClick();
              }}>거부함</button>
              <button onClick={this.props.onClick}>보류함</button>
              <button onClick={this.props.onClick}>review</button>
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

export default JoinModal;