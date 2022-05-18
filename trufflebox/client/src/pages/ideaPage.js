import React from 'react';
import { AuctionInput } from '../components/auctionInput.js';
import { withRouter } from '../components/withRouteCpnt.js';
import { 
    getIdeaPlayers, getPlayers, 
    getIdeaOne, getRemainTime } from '../api';

class IdeaDetails extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      slide: true,
      remain: null,
      showFlag: false,
      editors: [],
      contents: null,
      account: this.props.account,
    };
  }
  componentWillUnmount = () => {
      clearTimeout(this.timer);
  }
  componentDidMount = () => {
    console.log(this.props.router);
    this.getContents();
    
    setTimeout(() => {
      this.setState({slide: false});
    }, 1300);
  }
  getContents = async() => {
    const teamId = parseInt(this.props.router.params.teamid, 10);
    const contents = await getIdeaOne(teamId);
    this.setState({contents: contents});
    this.getPlayer();
  }
  getRemainOnServer = async() => {
    const expired = await getRemainTime(this.state.contents.id);
    if(expired !== 'not set')
        this.setState({remain: expired});
    // if(expired !== undefined)
    //     this.getRemain();
  }
  getRemain = () => {
    let expired = this.state.remain;
    this.timer = setTimeout(() => {
      expired -= 1000;
      this.setState({remain: expired});
    }, 1000);
  }
  getPlayer = async() => {
    let ideaid = this.state.contents.id;
    await getIdeaPlayers(ideaid).then((data) => {
      let copyEditors = [...this.state.editors];
      for(let iter = 0; iter < data.length; ++iter){
        //console.log(data[iter].playerId);
        this.innerSync(data[iter].playerId, copyEditors);
      }
    });
  }
        innerSync = async(_playerId, _copyEditors) => {
            const p = await getPlayers(_playerId);
            _copyEditors.push(p.sub);
            this.setState({editors: _copyEditors});
            //console.log('e: ',this.state.editors);
        }

  docuDown = async() => {
    const fileCheck = await getIdeaOne(this.state.contents.id);
    if(fileCheck.file){
      const result = docuLink(this.state.contents.title);
      if(result[0]){
          window.open(result[1]);
      }
    } 
    else
      alert('file does not exist');
  }

  leadPtct = () => {
    const ideaType = parseInt(this.props.router.params.type, 10);
    let ownerCheck = false;
    if(this.state.account === this.state.editors[0]){
      ownerCheck = true;
    }
    if(this.state.editors.length > 1){
        console.log('log1');
        this.getRemain();
    }
    return(
      <div className='textprerap'>
        <ul>
          <li>제목</li>
          <p className='textprerap'>{this.state.contents.title}</p>
          
          <li style={{margin: 'inherit'}}>아이디어 설명</li><p className='textprerap'>{this.state.contents.description}</p>
          <button onClick={this.docuDown} className="button02">이 아이디어의 더욱 자세한 정보 보기</button>
          { ideaType ? <><li style={{margin: 'inherit'}}>아이디어 경매에 참여하기 전에.</li>
          <p className='textprerap'>
            1. 경매에 참여한 모든 사람을 참여자, 상세설명파일 열람자격과 아이디어를 인수할 권리를 얻은자를 인수권자, <br/>   최종적으로 아이디어를 인수하여 거래를 완료시킨자를 낙찰자라 칭합니다.<br/>
            2. 아이디어 경매 종료 후 인수권자로 선정되면 아이디어 낙찰가만큼의 토큰을 에스크로에 이체시켜야 합니다.<br/>
            3. 토큰의 에스크로 이체가 완료되면 인수권자는 아이디어의 핵심 내용(상세설명파일)의 열람 권한을 얻습니다.<br/>
            4. 인수권자는 상세설명파일에 기재된 내용이 인수에 부족하다고 생각할 경우 추가정보를 요청하거나 거래를 포기할 수 있습니다.<br/>
            5. 인수권자가 열람하는 모든 파일은 열람사실이 블록체인상에 기록됩니다.<br/>
            6. 인수권자가 인수를 포기할 시 낙찰자에게 낙찰가액의 80%만 반환합니다.
          </p>
          <p style={{margin: 0}}>경매 참여자 수: {this.state.editors.length - 1}</p>
          <p style={{margin: 0}}>현재 호가 또는 시작가: {this.state.contents.ideaToken} token</p>
          <p style={{margin: 0}}> 남은 경매 시간: {this.state.remain}</p>
          <button onClick={this.autionButon} className="button02">이 아이디어의 경매에 참여하기</button>
          </>
          :<><p>댓글 목록.</p>
          <textarea name="docudesc" rows='3' cols='60' placeholder="댓글 입력" onChange={this.onReplChange}/>
          <button onClick={this.upReButton}>reply</button>
          </>}
          
          {/* <ul><div style={{fontSize: "15px"}}>경매 참여자</div>
            {this.state.editors.map((editor, index) => (
              <li key={index}>
                {this.state.editors[index+1]}
              </li>
            ))}
          </ul> */}
          
        </ul>
        {/* {ownerCheck ? 
        <button className="App-exeButton" onClick={this.tempButton}>경매종료</button>
         : null} */}
      </div>
    )
  }
  upReButton = () => {
    console.log('clicked');
  }
  onReplChange = (evt) => {
    console.log(evt.target.value);
  }
  autionButon = () => {
    this.setState({showFlag: true});
  }
  modalClose = () => {
    this.setState({showFlag: false});
    document.removeEventListener('click',this.modalClose);
  }

  render(){
    return(
      <section className="App-header">
        {this.state.slide ? <p>최고의 아이디어 공유 플랫폼 /Threads <br/>문서 로드 중...</p>
        :<>
          <this.leadPtct></this.leadPtct>
          <AuctionInput 
            showFlag={this.state.showFlag} account={this.state.account} 
            cont={this.state.contents} ptcps={this.state.editors}
            onClose={()=>{this.modalClose()}}/>
        </>
        }
      </section>
    )
  }
}
const docuLink = (_title) => {
  let downlink = 'http://giparang.asuscomm.com:3039/downloadfile/';
  //let downlink = 'localhost:3039/downloadfile/';
  const result = window.confirm('파일이 다운로드 됩니다');
  
  if(result){
    downlink += _title;
    return([true, downlink]);
  }
  else{
    alert('다운로드가 취소됨.');
    return([false, '']);
  }
}
export default withRouter(IdeaDetails);