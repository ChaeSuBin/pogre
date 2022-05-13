import React, { useEffect, useState } from "react";
import { postHold, getPlayersId, putBidIdea } from "../api.js";
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { registChecker } from "./registCatch.js";

export const AuctionInput = ({showFlag, account, onClose, cont, ptcps}) => {
  // const location = useLocation(); // URL path や パラメータなど。JSのlocationと同じ
  // console.log(location);
  
  // const partName = useState(queryString.parse(location.search));
  // const docuName = partName[0].title;
  // const docuPric = partName[0].price;

  // const hashCode = useState(queryString.parse(location.hash));
  // const docuId = hashCode[0].teamid;

  const temp = () => {
    const genzai = Date.now();
    console.log(genzai);
  }
  return(
    <>{showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <div>
          <p>입찰</p>
          <InputForm useraddr={account} contents={cont} ptcps={ptcps}/>
          <button onClick={onClose}>close</button>
          <button onClick={temp}>tempb</button>
        </div>
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
    </>
  )
}

function InputForm({useraddr, contents, ptcps}) {
  const [playerid , setId] = useState();
  const name = contents.title;
  const price = contents.ideaToken;
  
  useEffect(()=>{
    regiCheck();
  },[]);

  const regiCheck = async() => {
    setId(await registChecker(useraddr));
  }
  
  async function handleFormSubmit(evt) {
    const bidValue = parseInt(evt.target.elements.bid.value, 10);
    const iPrice = parseInt(price, 10);
    if(evt.target.elements.bid.value > iPrice){
      //evt.preventDefault();
      const record = {
        teamid: contents.id,
        bidtoken: evt.target.elements.bid.value,
        userid: playerid,
        status: 5
      };
      //console.log(record);
      setHold(playerid, evt.target.elements.bid.value);
      alert('입찰 되었습니다');
      //await postHold(record);
    }
    else{
      alert('입찰할 토큰 수량은 ' + price + '보다 커야합니다.');
    }
  }
  async function setHold(_playerId, _inputToken){
    let firstPtcp = true;
    if(ptcps.length > 1)
      firstPtcp = false;
    await putBidIdea({
      teamid: contents.id, 
      userid: _playerId,
      bidtoken: _inputToken,
      first: firstPtcp});
  }

  return(
    <form onSubmit={handleFormSubmit}>
      아이디어 이름: {name} <br/>
      <p style={{margin: 0, fontSize: "18px"}}>현재 호가 또는 시작가: {price}</p>
      <p style={{margin: 0, fontSize: "18px"}}>경매 참여자 수: {ptcps.length-1}</p>
      <br/>입찰할 토큰갯수:<br/>
      <input name="bid" placeholder='amound of tokn'/>
      <br/><br/>
      <button type="submit" className="App-exeButton2">send</button>
    </form>
  )
}