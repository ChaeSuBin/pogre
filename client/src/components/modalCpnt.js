import React, {useState, useEffect} from "react";
import { getIdeaPlayers, getPlayers } from "../api.js";
import { Link } from "react-router-dom";

export const Modal = (props) => {
    const [editors, setEditor] = useState([]);
    const [showForm, setShow] = useState('');
    
    useEffect(()=>{
        getPlayer();
    },[props.content]);
    
    const getPlayer = async() => {
        if(props.content == null){
            console.log('-');
        }
        else{
            //console.log(props.content.origin);
            let ideaid = props.content.id;
            await getIdeaPlayers(ideaid).then((data) => {
                for(let iter = 0; iter < data.length; ++iter){
                    //console.log(data[iter].playerId);
                    innerSync(data[iter].playerId);
                }
            })
        }
    }
    const innerSync = async(_playerId) => {
        const p = await getPlayers(_playerId);
        setEditor([...editors, p.sub]);
        console.log(editors);
    }

    const joinIdea = () => {
      console.log('close');
    }
  
    return (
    <>
      {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
      <div id="overlay" style={overlay}>
        <div id="modalContent" style={modalContent}>
          <p>{props.content.title}</p>
          <ul><div style={{fontSize: "15px"}}>이 아이디어에 아래의 참가자가 참가중</div>
            {editors.map((editor) => (
              <li key={editor}>
                {editor} :-:
              </li>
            ))}
          </ul>
          <p><button onClick={props.onClick}>Close</button>
          <button onClick={props.onClick}>Download</button>
          <Link to={{
            pathname: '/upjoin',
            search: `title=${props.content.title}`,
            hash: `origin=${props.content.origin}`,
            state: {key: 'valuee'}
          }}>
          <button onClick={joinIdea}>Join</button>
          </Link></p>
        </div>
      </div>
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない
      )}
    </>
    );
};

const modalContent = {
    background: "white",
    padding: "10px",
    borderRadius: "3px",
    color: '#333',
    textAlign: 'left',
};
  
const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};