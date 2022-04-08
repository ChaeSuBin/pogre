import React, { useEffect, useState } from "react";
import { postCreateIdea } from "../api.js";
import { useParams } from 'react-router-dom';

export const UploadIead = ({contract, accounts}) => {
  const uriParams = useParams();
  // if(uriParams.mode === "rapid"){
  //   console.log(uriParams.mode);
  // }

  async function handleFormSubmitUp(record) {
    await postCreateIdea(record);
    console.log('v: ', record);
  }
  return(
    <div className="App">
      <div className="App-header">
        PROTO : REGI
        <section className="App-display">
          <p>idea upload</p>
          <IdeaForm onSubmit={handleFormSubmitUp} useraddr={accounts} rMode={uriParams.mode} />
        </section>
      </div>
    </div>
  )
}

function IdeaForm({onSubmit, useraddr, rMode}) {
  const [address, setAddr] = useState('');
  const [blocked, setBlock] = useState(false);
  const [fblob, setBinary] = useState([]);

  useEffect(()=>{
    setAddr(useraddr[0]);
    if(rMode === 'rapid')
      setBlock(false);
    else
      setBlock(true);
    //console.log(blocked);
  });
  
  async function handleFormSubmit(event) {
    event.preventDefault();
    let data = 0;
    if (event.target.elements.price.value == '') {
      data = 0;
    }
    else{
      data = event.target.elements.price.value;
    }
      const record = {
        name: event.target.elements.docuname.value,
        desc: event.target.elements.docudesc.value,
        useraddr: event.target.elements.addr.value,
        price: data,
        cycle: blocked,
        display: blocked,
        fbolb: fblob
      };
    event.target.elements.docuname.value ='';
    event.target.elements.docudesc.value ='';
    event.target.elements.addr.value ='';
    onSubmit(record);
  }

  const onFileInputChange = (e) => {
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
        setBinary(fileByteArray);
      }
    }
  }
  
  return(
    <form onSubmit={handleFormSubmit}>
      addr:
      <input name="addr" size='44' value={address} disabled="disabled"/>
      <br/>
      contact:
      <input name="contact" placeholder='phone number / e-male / kakao talk ...etc' size='38'/>
      <br/>
      select file: <input type='file' onChange={onFileInputChange}/>
      <br/><br/>
      title<br/>
      <input name="docuname" /><br/>
      description<br/>
      <textarea name="docudesc" rows='15' cols='45' />
      <br/><br/>
      value:
      <input name="price" type="text" disabled={blocked} placeholder='amount of RED(Token)'/>
      
      <button type="submit">
        ideaUpload
      </button>
    </form>
  )
}