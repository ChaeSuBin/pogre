import React from 'react';
import { 
  getIdeaPlayers, getPlayers, 
  getIdeaPoints, putUpdateTokn, 
  dltTeam, getPlayersId, putFundIdea,
  getTeamPlayers, postHoldIdea, putViewIdea, getDcuDown, getIdeaOne, putExitBlock  } from "../api.js";
import { Link } from "react-router-dom";
import './modal.css';

// 子コンポーネント（モーダル）
export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editors: [],
    };
  }
  
  componentDidUpdate = (prevProps) => {
    console.log(this.props);
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
      // await getIdeaPoints(ideaid).then((data) => {
      //   let copyPoint = [...this.state.points];
      //   let tempScore = 0;
      //   //copyPoint.push(100);
      //   for(let iter = 0; iter < data.length; ++iter){
      //     console.log(data[iter]);
      //     copyPoint.push(data[iter]);
      //     this.setState({points: copyPoint});
      //     tempScore += data[iter];
      //   }
      //   console.log(this.state.points);
      //   this.setState({score: tempScore});
      // });
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

  typeBranch = () => {
    if(this.props.content.type === 1){
      return(
        <Type_direct
          content={this.props.content}
          account={this.props.account}
          contract={this.props.contract}
          editors={this.state.editors}
          onClick={this.props.onClick}
        />
      )
    }
    else if(this.props.content.type === 2){
      return(
        <Type_fund
          content={this.props.content}
          account={this.props.account}
          contract={this.props.contract}
          onClick={this.props.onClick}
        />
      )
    }
    else if(this.props.content.type === 0){
      console.log(this.state.editors);
      return(
        <Type_cycle
          editors={this.state.editors}
          content={this.props.content}
          account={this.props.account}
          contract={this.props.contract}
          onClick={this.props.onClick}
        />
      )
    }
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents">
            <div>
              <p>{this.props.content.title}</p>
              <p style={{fontSize: "20px", margin: 0}}>{this.props.content.description}</p>
              {/* <ul><div style={{fontSize: "15px"}}>이 아이디어의 제안자/참여자</div>
                {this.state.editors.map((editor, index) => (
                  <li key={index}>
                    {editor} :-: {((this.state.points[index]/this.state.score)*100).toFixed(2)}%
                  </li>
                ))}
              </ul> */}
                <this.typeBranch></this.typeBranch>
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
export const getTeamAddr = async(_teamId, _account, _contract) => {
  const history = await getTeamPlayers(_teamId);
  let StakeArr = [];
  let Ptcps = [];
  const ptcpLen = history.length;
  const price = history[0];
  let iter = 1;
  
  while(iter != ptcpLen){
    Ptcps.push(history[iter]);;
    StakeArr.push(history[iter+1]);
    iter += 2;
  }
  //console.log('v ', StakeArr, price);
  //console.log(_teamId, _ptcp, _account);
  const allotArr = allotVar(StakeArr, price);
  console.log('v: ', allotArr);

  (async ()=> {
    await putExitBlock({teamId: _teamId, block: true});
  })();
  console.log(price);

  await _contract.methods.putBlockAndPurchase(
    _teamId,
    Ptcps,
    allotArr,
    price
    ).send({ 
      from: _account,
  }).on('error', function(error){putExitBlock({teamId: _teamId, block: false});})
}
const allotVar = (_stake, _price) => {
  const stakeLen = _stake.length;
  let conversionFactor = [];
  let total = 0;
  let iter = 0;

  while(iter != stakeLen){
    total += _stake[iter++];
  }iter = 0;
  //const resultVar = (5*1000)/(145*5*145);
  const resultVar = (_price*1000)/(total**2*_price);

  while(iter != stakeLen){
    const cf = total*_price*_stake[iter++]*resultVar;
    conversionFactor.push(parseInt(cf));
  }
  //console.log('r: ', conversionFactor);
  return conversionFactor;
}

const docuLink = (_title) => {
  let allowcheck = false;
  let downlink = 'http://giparang.asuscomm.com:3039/downloadfile/';
  const result = window.confirm('You agree to keep this document confidential.\r\nYou can be legally responsible for unauthorized distribution.');

  if(result){
    allowcheck = true;
    downlink += _title;
  }
  else
    alert('disapproval');
  return ([allowcheck, downlink]);
}

export class Type_direct extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      countDownDate: new Date("Jan 5, 2024 15:37:25").getTime(),
      first: false,
      allowcheck: false,
      downlink: null,
      editors: null,
      content: this.props.content,
      account: this.props.account
    };
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ editors: this.props.editors})
      if(this.state.editors.length - 1 === 0){
        this.setState({first: true});
      }
    }, 200);
  }
  // componentDidUpdate = (prevProps) => {
  //   if (this.props.editors !== prevProps.editors){
  //     this.setState({editors: this.props.editors});
  //   }
  //   else{
  //     console.log(this.state.account);
  //     console.log(this.state.editors);
  //   }
  // }
  
  docuDown = async() => {
    const fileCheck = await getIdeaOne(this.state.content.id);
    console.log(fileCheck.file);
    if(fileCheck.file){
      const result = docuLink(this.state.content.title);
      this.setState({allowcheck: result[0]});
      this.setState({downlink: result[1]});
    } 
    else
      alert('file does not exist');
  }

  // purchase = async() => {
  //   getTeamAddr(
  //     this.state.content.id,
  //     this.state.account,
  //     this.state.contract
  //   );
  // }
  tempclock = () => {
    this.timer = setInterval(this.tick, 1000);
  }
  tick = () => {
    this.setState(({ countDownDate }) => ({ countDownDate: countDownDate + 1000 }));
    console.log(this.state.countDownDate);
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  leadPtct = () => {
    let ownerCheck = false;
    if(this.state.account === this.state.editors[0]){
      ownerCheck = true;
    }
    return(
      <>
        <ul><div style={{fontSize: "15px"}}>제안자</div>
          <li>{this.state.editors[0]}</li>
        </ul>
        <ul><div style={{fontSize: "15px"}}>경매 참여자</div>
          {this.state.editors.map((editor, index) => (
            <li key={index}>
              {this.state.editors[index+1]}
            </li>
          ))}
        </ul>
        <p style={{margin: 0, fontSize: "15px"}}>경매 참여자 수: {this.state.editors.length - 1}</p>
        <p style={{margin: 0}}>현재 호가 또는 시작가: {this.state.content.ideaToken} token</p>
        {ownerCheck ? 
        <button className="App-exeButton" onClick={this.tempButton}>경매종료</button>
         : null}
        <button onClick={this.tempclock}>temp</button>
      </>
    )
  }
  tempButton = () => {
    const result = window.confirm('정말 해당 아이디어의 경매를 마치시겠습니까?\r\n(경매 종료 동시에 가장 높은 호가를 부른 참여자가 낙찰자로 선정됩니다)');
    if(result){
      alert('경매가 종료되었습니다');
    }
    else
      alert('disapproval');
  }
  render(){
    return(
      <>
        {this.state.editors === null ? ( <></> ) : (
          <this.leadPtct></this.leadPtct>
        )}
        
        <button onClick={this.props.onClick}>Close</button>
        <button onClick={this.docuDown}>in detail</button>
        {/* <button onClick={this.purchase}>purchase</button> */}
        <Link to={{
            pathname: '/negoti',
            search: `title=${this.state.content.title}&price=${this.state.content.ideaToken}&first=${this.state.first}`,
            hash: `teamid=${this.state.content.id}`,
            state: { test: 'this.state.editors[0]'}
          }}>
          <button>in Auction</button>
        </Link>
        {this.state.allowcheck ? <a id="btn" 
        href={this.state.downlink}>download link</a>
         : null}
      </>
    )
  }
}

const informFunding = async(_record, _account, _contract) => {
  //hold테이블 이용하여 참여알림 설정할 것
  const toknBalance = await _contract.methods.balanceOf(
    _account).call();
  console.log(_record);
  if(toknBalance > _record.tokn * 10**18){
    await postHoldIdea(_record);
  }
  else{
    console.log('not enougth');
  }
}

class Type_cycle extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      inputTokn: null,
      inputStake: null,
      editors: null,
      points: [],
      score: 0,
      showFlag: false,
      showPurchase: false,
      content: this.props.content,
      account: this.props.account,
      contract: this.props.contract
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.editors !== prevProps.editors){
      console.log(this.props.editors);
      this.setState({editors: this.props.editors});
      this.setPointAndScore();
    }
    else{
      console.log('there is no update');
    }
  }
  updateInput_A = (_evt) => {
    console.log(_evt.target.value,);
    this.setState({inputTokn: _evt.target.value,});
  }
  updateInput_B = (_evt) => {
    console.log(_evt.target.value,);
    this.setState({inputStake: _evt.target.value,});
  }

  fundOrPurcBtn = async(_purchase) => {
    const UID = await getPlayersId(this.state.account);
    const record = {
      teamid : this.state.content.id,
      desc: null,
      tokn: this.state.inputTokn,
      putstake: this.state.inputStake,
      userid: UID.id,
      purchase: _purchase
    }
    informFunding(record, this.state.account, this.state.contract);
  }

  setPointAndScore = async() => {
    console.log(this.state.editors);
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
  }
  leadPtct = () => {
    return(
      <>
        <ul><div style={{fontSize: "15px"}}>이 아이디어의 제안자/참여자</div>
          {this.state.editors.map((editor, index) => (
            <li key={index}>
              {editor} :-: {((this.state.points[index]/this.state.score)*100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </>
    )
  }

  render(){
    return(
      <>
        {this.state.editors === null ? ( <></> ) : (
          <this.leadPtct></this.leadPtct>
        )} 
        <button onClick={this.props.onClick}>Close</button>
        <button onClick={() => this.setState({showPurchase: true})}>Purchase</button>
        {this.state.showPurchase ? ( // showFlagがtrueだったらModalを表示する
        <>
          <br/>
          <input name="price" className="input" 
            placeholder='amound of tokn' onChange={this.updateInput_A}/><br/>
          <button onClick={() => this.fundOrPurcBtn(true)}>send</button>
        </>
        ) : (
          <><Link to={{
            pathname: '/joinup',
            search: `title=${this.props.content.title}`,
            hash: `origin=${this.state.content.id}`,
            state: {key: 'valuee'}
          }}>
          <button onClick={this.joinIdea}>Join</button>
          </Link>
          <button onClick={() => this.setState({showFlag: true})}>funding</button>
          {this.state.showFlag ? ( // showFlagがtrueだったらModalを表示する
          <>
            <br/>
            <input name="tokn" className="input" 
              placeholder='amound of tokn' onChange={this.updateInput_A}/><br/>
            <input name="stak" className="input" 
             placeholder='stake to be request' onChange={this.updateInput_B}/><br/>
            <button onClick={() => this.fundOrPurcBtn(false)}>fund</button>
          </>
          ) : (
            <></>// showFlagがfalseの場合はModalは表示しない)
          )}</>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    )
  }
}
class Type_fund extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      account: this.props.account,
    };
  }

  tempButton = () => {
    tempButtonf(this.state.content, this.state.account);
  }

  render(){
    return(
      <>
        <button onClick={this.tempButton}>temp</button>
      </>
    )
  }
}

const tempButtonf = (_vara, _varb) => {
  console.log(_vara);
  console.log(_varb);
}