import { useEffect, useState } from "react";
import { putUpdateIdea } from "../api.js";
import { getAccount } from '../components/getAddrCpnt';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

export function JoinIead(){
  const location = useLocation(); // URL path や パラメータなど。JSのlocationと同じ
  console.log(location);
  const [partName, setName] = useState(queryString.parse(location.search));
  const docuName = partName.title;
  const hashCode = useState(queryString.parse(location.hash));
  const docuOrigin = hashCode[0].origin;
  //console.log('o: ', docuOrigin);
  
  async function handleFormSubmitUp(record) {
    await putUpdateIdea(record);
        //console.log('v: ', record);
    console.log('v: ', record);
  }
  return(
    <>
      <p>DEMO : JOIN</p>
      <div className="box">
      <p>idea join</p>
      <IdeaForm onSubmit={handleFormSubmitUp} docuName={docuName} docuOri={docuOrigin}/>
      </div>
    </>
  )
}

function IdeaForm({onSubmit, docuName, docuOri}) {
  const [address, setAddr] = useState('');
  const name = docuName;
  //console.log('v: ', docuOri);

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
            origin: docuOri,
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
            <input name="docuname" className="input"
              value={name} disabled="disabled" />
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