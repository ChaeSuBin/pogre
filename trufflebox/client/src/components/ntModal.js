import React from 'react';
import { 
  getPicPlayers,
  getImgView, 
  putUpdateTokn, 
  getPlayersId, 
  putNftLimit } from "../api.js";
import { readImg } from './readImgCpnt.js';
import './modal.css';

// 子コンポーネント（モーダル）
export class NtModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkValue: null,
      editors: null,
      imagePreviewUrl: null,
      score: 0,
      account: this.props.account,
    };
  }
  componentDidUpdate = async(prevProps) => {
    if (this.props.content !== prevProps.content){
      //console.log(this.props.content);
      this.getPlayer();
      this.runBlockchain(this.props.contract);
      this.handleFileReader(await readImg(this.props.content.title));
    }
    else{
      console.log('there is no update');
    }
  }

  handleFileReader = (_blob) => {
    const reader = new FileReader()
    const file = _blob
    console.log(_blob);
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }); 
    }   
    reader.readAsDataURL(file);
  }

  runBlockchain = async(contract) => {
    //console.log(this.props.contract);
    const response = await contract.methods.connectionTecs().call();
    this.setState({ checkValue: response });
  }

  getPlayer = async() => {
    if(this.props.content == null){
      console.log('-');
    }
    else{
      await getPicPlayers(this.props.content.id).then((data) => {
        //console.log(data); account
        this.setState({editors: data});
      });
    }
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
          connection: <b>{this.state.checkValue}</b>
          <div><img src={this.state.imagePreviewUrl} /></div>
          <p style={{margin: 0}}> editor: </p>{this.state.editors}
          <NFTStatus
            content={this.props.content}
            onClick={this.props.onClick}
            contract={this.props.contract}
            account={this.props.account}
            viewMode={this.props.viewMode}
          />
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}

class NFTStatus extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.content.price,
      showresult: false,
      viewMode: this.props.viewMode,
      imgLink: 'http://giparang.asuscomm.com:3039/viewimg/',
      account: this.props.account,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount = () => {
    console.log(this.state.value);
    const viewLink = this.state.imgLink + this.props.content.title;
    this.setState({imgLink: viewLink});
  }

  Purchase = async() => {
    //console.log(this.props.content);
    const userinfo = await getPlayersId(this.state.account);
    if(userinfo.token >= this.state.value){
      const record = {
        useraddr: this.state.account,
        token: this.state.value,
        mode: 'min'
      }
      this.innerSync(record);
      (async ()=> {
        await putNftLimit({pieceId: this.props.content.id});
      })();
      
      this.excuteMint();
    }
    else{
      console.log('not enougth');
    }
  }
  innerSync = async(record) => {
    await putUpdateTokn(record);
  }

  excuteMint = async() => {
    await this.state.contract.methods.mintItem(
      this.state.account,
      this.props.content.title
    ).send({ 
      from: this.state.account,
      gas: 3000000 });
  }

  ideaStatus = () => {
    return(<>
      <button onClick={this.props.onClick}>Close</button>
      <button onClick={this.Purchase}>Purchase</button>
      <p style={{margin: 0, fontSize: "15px"}}>status: progress</p>
      <p style={{margin: 0}}>value: {this.state.value}</p>
    </>)
  }

  ResEnd = async() => {
    window.open(this.state.imgLink);
    //console.log(this.state.imgLink);
  }

  viewNft = () => {
    return(<>
      <button onClick={this.props.onClick}>Close</button>
      <button onClick={this.ResEnd}>View</button>
      <p style={{margin: 0, fontSize: "15px"}}>status: view</p>
      <p style={{margin: 0}}>value: {this.state.value}</p>
    </>)
  }
  render(){
    return(
      <div>
        {this.state.viewMode ? <this.viewNft>
        </this.viewNft> : <this.ideaStatus>
        </this.ideaStatus> }
        {/* <button onClick={this.btn_d32}>btn_d32</button> */}
      </div>
    )
  }
}