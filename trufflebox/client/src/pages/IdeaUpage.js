import React from "react";
import { postCreateIdea } from "../api.js";

export class UploadIead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null,
      title: null,
      desc: null,
      fblob: null,
      uploadMode: null,
      modeCheck: false,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.modalClose = this.modalClose.bind(this);
  }

  componentDidMount = () => {
    // if(localStorage.getItem('desc').length > 2 && localStorage.getItem('title').length>2){
    //   this.setState({desc: localStorage.getItem('desc')});
    //   this.setState({title: localStorage.getItem('title')});
    // }
  }

  handleFormSubmit = async(event) => {
    const result = window.confirm('업로드한 아이디어는 모두에게 공개됩니다.\r\n업로드시 10포인트가 지급됩니다.\r\n아이디어를 업로드 하시겠습니까?');
    let record = null;
    event.preventDefault();
    if(result){
      const record = {
        name: event.target.elements.docuname.value,
        desc: event.target.elements.docudesc.value,
        useraddr: this.state.accounts[0],
        price: event.target.elements.price.value,
        mode: this.state.uploadMode,
        fbolb: this.state.fblob
      };
      localStorage.clear();
      await postCreateIdea(record);
      console.log('v: ', record);
      
      alert('아이디어가 업로드되었습니다.');
    }
  }
    
  onFileInputChange = (e) => {
    const reader = new FileReader();
    const fileByteArray = [];
    //console.log(evt.target.files[0]);
    
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = (_evt) => {
      if (_evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = _evt.target.result,
        array = new Uint8Array(arrayBuffer);
        for (const a of array) {
          fileByteArray.push(a);
        }
        console.log(fileByteArray);
        this.setState({fblob: fileByteArray});
      }
    }
  }
  onDescChange = (evt) => {
    this.setState({desc: evt.target.value});
    localStorage.setItem('desc', this.state.desc);
  }
  onTitleChange = (evt) => {
    this.setState({title: evt.target.value});
    localStorage.setItem('title', this.state.title);
  }
  // onNameChange = (evt) => {
  //   this.setState({desc: evt.target.value});
  // }
  tempsave = () => {
    console.log(this.state.desc);
  }

  inputForm = () => {
    return(<>
      <form onSubmit={this.handleFormSubmit}>
        {/* addr:
        <input name="addr" size='44' value={this.state.accounts} disabled="disabled"/>
        <br/> */}
        연락처<br/>
        <input name="contact" placeholder='호기심많은 열람자가 당신에게 연락할 수도 있어요' size='38'/>
        <br/>
        아이디어 제목<br/>
        <input name="docuname" size='38' placeholder='제목의 중요성은 열번 말해도 지나치지 않습니다' defaultValue={this.state.title} onChange={this.onTitleChange}/><br/>
        간단설명<br/>
        <textarea name="docudesc" rows='15' cols='42' placeholder="단순명쾌한 설명으로 사람들이 이 아이디어를 클릭하게 만들어주세요&#13;&#13;
        " defaultValue={this.state.desc} onChange={this.onDescChange}/>
        <br/>
        스토리텔링 파일<br/>
        <p style={{color: '#C6C6C6', fontSize: "16px", margin: 0}}>간단설명을 보고 들어온 사람들이 더 자세한 정보를 얻을 수 있도록 스토리텔링 파일을 업로드 해주세요</p>
        <input type='file' onChange={this.onFileInputChange}/>
        
        {this.state.uploadMode ? <>
          <br/><br/>
          상세설명파일<br/>
          <p style={{color: '#C6C6C6', fontSize: "16px", margin: 0}}>아이디어 낙찰자가 아이디어 인수를 결심할 수 있도록 아이디어에 대해 최대한 상세히 기술해주세요.</p>
          <input type='file' onChange={this.onFileInputChange}/>
          <br/><br/>
          경매시작가(토큰갯수):
          <input name="price" type="text" placeholder='amount of RED(Token)'/>
        </> : <> 
          <br/><br/>목표토큰갯수:<br/>
          <input name="price" type="text" placeholder='amount of RED(Token)'/>
        </>}
        <br/><br/>
        <button className="App-exeButton2" type="submit">
        작성완료
        </button>
      </form>
      {/* <button onClick={this.tempsave}>tempsave</button> */}
    </>)
  }

  checkRadio = (evt) => {
    console.log(this.state.uploadMode);
    switch(evt.target.value){
      case 'dirc':
        this.setState({uploadMode: 1});
        break;
      case 'cycl':
        this.setState({uploadMode: 2});
        break;
      case 'fund':
        this.setState({uploadMode: 0});
    }
    this.setState({modeCheck: true});
  }
  
  render(){
    return(
      <div className="App">
        <div className="App-header">
          <section className="App-display">
            {this.state.modeCheck ? <this.inputForm></this.inputForm> : <>
            <p>아이디어 업로드 방식을 정해주세요</p>
            <br/>
            <label style={{cursor: 'pointer'}}><input type="radio" name="color1" value="dirc" onChange={this.checkRadio}/> idea to sale</label>
            <ul style={{color: '#C6C6C6', fontSize: "18px", marginRight: '8em'}}><li>아이디어를 경매형식으로 판매합니다 </li>
            <li>경매에 입찰하는 모든 사람을 참여자, 상세설명파일 열람자격과 아이디어를 인수할 권리를 얻은자를 낙찰자, 최종적으로 아이디어를 인수하여 거래를 완료시킨자를 인수자라 칭합니다.</li>
            <li>경매 참여자중 가장 높은 금액을 제시한 참여자를 낙찰자로 선정합니다.</li>
            <li>낙찰자가 반드시 인수자가 된다는 보장은 없습니다.</li>
            <li>아이디어 문서는 100자 이내의 '간단설명'과 사람들의 경매 참여를 결심하게 할 '스토리텔링파일'(준 상세파일)
            그리고 아이디어의 실행/구현방법을 담은 '상세설명파일'로 이루어집니다.</li>
            <li>이 중 '상세설명파일'은 경매 종료 후 낙찰자에게만 공개되며 열람사실이 블록체인상에 기록됩니다.</li>
            <li>낙찰자는 인수결심을 위한 '상세설명파일'에 기재된 정보 이외의 추가 정보를 요구할 수 있으며 이 경우 열람사실 기록을 위해 반드시 '쓰레드 웹'을 통해 낙찰자에게 추가적인 파일을 전달해야 합니다.</li>
            <li>경매는 첫 입찰자가 참여한 후부터 3일간 진행됩니다.</li></ul><br/>
            {/* <label><input type="radio" name="color1" value="cycl" onChange={this.checkRadio}/> 다른 사람들과 협업하여 개선 후 팔기</label> */}
            <label style={{cursor: 'pointer'}}><input type="radio" name="color1" value="fund" onChange={this.checkRadio}/> idea to share</label>
            <p style={{color: '#C6C6C6', fontSize: "18px", margin: 0}}> 아이디어를 자유롭게 제안합니다<br/>
            아이디어의 조회수만큼 포인트를 획득할 수 있습니다.<br/>
            당신의 아이디어에 다른 사람들이 댓글을 달 수도, 후원을 할 수도 있습니다.
            </p>
            </>}
          </section>
        </div>
      </div>
    )
  }
}