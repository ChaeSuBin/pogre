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
    //console.log(this.props.router);
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
    let ownerCheck = false;
    if(this.state.account === this.state.editors[0]){
      ownerCheck = true;
    }
    if(this.state.editors.length > 1){
        console.log('log1');
        this.getRemain();
    }
    return(
      <>
        <ul><div style={{fontSize: "15px"}}>제안자</div>
          <li>{this.state.editors[0]}</li>
        </ul>
        <p className='textprerap'>-아이디어 설명 <br/>{this.state.contents.description}</p>
        
        <button onClick={this.docuDown} className="button02">이 아이디어의 더욱 자세한 정보 보기</button>
        <p className='textprerap'>-아이디어 경매에 참여하기 전에.
        <br/> 1. 아이디어 경매 종료 후 낙찰자로 선정되면 아이디어 낙찰가만큼의 토큰을 에스크로에 이체시켜야 합니다.
        <br/> 2. 토큰의 에스크로 이체가 완료되면 낙찰자는 아이디어의 핵심 내용(상세설명파일)의 열람 권한이 주어집니다.
        <br/>     이때 낙찰자의 상세설명파일 열람사실은 블록체인상에 기록됩니다.
        {/* <br/> 5. 낙찰자가 인수를 포기할 시 해당 아이디어에 대한 권리를 주장할 수 없으며 애스크로는 낙찰가액의 80%만 반환합니다. */}
        </p>
        {/* <ul><div style={{fontSize: "15px"}}>경매 참여자</div>
          {this.state.editors.map((editor, index) => (
            <li key={index}>
              {this.state.editors[index+1]}
            </li>
          ))}
        </ul> */}
        <p style={{margin: 0, fontSize: "15px"}}>경매 참여자 수: {this.state.editors.length - 1}</p>
        <p style={{margin: 0}}>현재 호가 또는 시작가: {this.state.contents.ideaToken} token</p>
        <p style={{margin: 0, fontSize: "17px"}}> 남은 경매 시간: {this.state.remain}</p>
        {ownerCheck ? 
        <button className="App-exeButton" onClick={this.tempButton}>경매종료</button>
         : null}
      </>
    )
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
          <div>
            
            <button onClick={this.autionButon} className="button02">이 아이디어의 경매에 참여하기</button>
          </div>
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