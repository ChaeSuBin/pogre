import { useEffect, useState } from "react";
import { postCreateIdea } from "../api.js";
import { getAccount } from '../components/getAddrCpnt';

export function UploadIead(){
  
  async function handleFormSubmitUp(record) {
    await postCreateIdea(record);
    //console.log('v: ', record);
  }
  return(
    <>
      <p>DEMO : REGI</p>
      <div className="box">
      <p>idea upload</p>
      <IdeaForm onSubmit={handleFormSubmitUp} />
      </div>
    </>
  )
}

function IdeaForm({onSubmit}) {
  const [address, setAddr] = useState('');

  useEffect(async()=>{
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      const account = await getAccount();
      setAddr(account);
      console.log(address);
    }
  });
  
  async function handleFormSubmit(event) {
    event.preventDefault();
    if (onSubmit) {
      const record = {
        hash: event.target.elements.docuhash.value,
        name: event.target.elements.docuname.value,
        desc: event.target.elements.docudesc.value,
        username: event.target.elements.name.value,
        useraddr: event.target.elements.addr.value,
      };
        event.target.elements.docuhash.value ='';
        event.target.elements.docuname.value ='';
        event.target.elements.docudesc.value ='';
        event.target.elements.addr.value ='';
        event.target.elements.name.value ='';
        onSubmit(record);
      }
    }

    return(
    <form onSubmit={handleFormSubmit}>
      <div className="field">
        <div className="control">
        addr:
        <input name="addr" className="input" placeholder='address' size='43'
          value={address} disabled="disabled"/>
        <p>your name: 
        <input name="name" className="input" placeholder='name' /></p>
        <label className="label">docu hash</label>
          <div className="control">
            <input name="docuhash" className="input" />
          </div>
          <label className="label">docu name</label>
          <div className="control">
            <input name="docuname" className="input" />
          </div>
          <label className="label">description</label>
          <div className="control">
            <textarea name="docudesc" rows='20' cols='70' className="input" />
          </div>
        </div>
      </div>
      
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-warning">
            ideaUpload
          </button>
        </div>
      </div>
    </form>
    )
}