import React from "react";
import { postCreateIdea } from "../api.js";

export class UploadIead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fblob: null,
      uploadMode: null,
      modeCheck: false,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.modalClose = this.modalClose.bind(this);
  }

  handleFormSubmit = async(event) => {
    event.preventDefault();
    let data;
    if (event.target.elements.price.value == '') {
      data = -1;
    }
    else{
      data = event.target.elements.price.value;
    }
      const record = {
        name: event.target.elements.docuname.value,
        desc: event.target.elements.docudesc.value,
        useraddr: event.target.elements.addr.value,
        price: data,
        mode: this.state.uploadMode,
        fbolb: this.state.fblob
      };
    await postCreateIdea(record);
    console.log('v: ', record);
    alert('submitted');
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

  inputForm = () => {
    return(<>
      <form onSubmit={this.handleFormSubmit}>
        {/* addr:
        <input name="addr" size='44' value={this.state.accounts} disabled="disabled"/>
        <br/> */}
        연락처:
        <input name="contact" placeholder='phone number / e-male / kakao talk ...etc' size='38'/>
        <br/>
        <input type='file' onChange={this.onFileInputChange}/>
        <br/><br/>
        title<br/>
        <input name="docuname" size='38'/><br/>
        description<br/>
        <textarea name="docudesc" rows='15' cols='45' />
        <br/>
        value:
        <input name="price" type="text" disabled={!this.state.uploadMode} placeholder='amount of RED(Token)'/>
        <br/><br/>
        <button className="App-exeButton2" type="submit">
        ideaUpload
        </button>
      </form>
    </>)
  }

  checkRadio = (evt) => {
    console.log(this.state.uploadMode);
    switch(evt.target.value){
      case 'dirc':
        this.setState({uploadMode: 1});
        break;
      case 'cycl':
        this.setState({uploadMode: 0});
        break;
      case 'fund':
        this.setState({uploadMode: 2});
    }
    this.setState({modeCheck: true});
  }
  
  render(){
    return(
      <div className="App">
        <div className="App-header">
          <section className="App-display">
            
            
            {this.state.modeCheck ? <this.inputForm></this.inputForm> : <>
            <p>아이디어를 업로드 후 어떻게 하시겠습니까?</p>
            <br/>
            <label><input type="radio" name="color1" value="dirc" onChange={this.checkRadio}/> 그대로 팔기</label>
            <label><input type="radio" name="color1" value="cycl" onChange={this.checkRadio}/> 다른 사람들과 협업하여 개선 후 팔기</label>
            {/* <label><input type="radio" name="color1" value="fund" onChange={this.checkRadio}/> fund</label> */}
            ...</>}
          </section>
        </div>
      </div>
    )
  }
}