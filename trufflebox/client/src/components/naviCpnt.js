import '../App.css';
import React, { useEffect,useCallback,useState } from "react";
import { Link } from 'react-router-dom';

export const Nav = ({contract, accounts}) => {
  const[isModalOpen,setIsModalOpen]=useState(false);
  const[isSearchOpen, setIsSerchOpen] = useState(false);

   const closeModal= useCallback(() =>{
     setIsModalOpen(false)
     document.removeEventListener('click',closeModal)
   },[])

   const closeSearch= useCallback(() =>{
      setIsSerchOpen(false);
      document.removeEventListener('click',closeSearch)
  },[])

   useEffect(()=>{
     return ()=>{
       document.removeEventListener('click',closeModal)
     }
   },[closeModal])


   function openModal(event){
     setIsModalOpen(true)
     document.addEventListener('click',closeModal)
     event.stopPropagation()
   }
   function openSearch(event){
    setIsSerchOpen(true)
    document.addEventListener('click',closeSearch)
    event.stopPropagation()
  }

  return (
    <div>
      <header></header>
      <Link to="/"><button>home</button></Link>
      {/* <Link to="/search"><button>search</button></Link> */}
      <button onClick={(event)=>{openSearch(event)}}>---</button>
      {isSearchOpen? <Serch onClick={(event)=>{closeSearch(event)}}/> :""}
      <Link to="/myinfo"><button>myPage</button></Link>

      <button onClick={(event)=>{openModal(event)}}>create</button>
      {isModalOpen? <Modal onClick={(event)=>{closeModal(event)}}/> :""}
    </div>
  );
}


function Modal(props){
  return(
    <div id="modal" className="modal" onClick={(event)=>{event.stopPropagation()}}>
      <section>
        <p><li>select your Idea case</li></p>
        <Link to="/ntwave"><button>NFT</button></Link>
        
        <Link to={'/create'}><button>Idea</button></Link>
      </section>
      <button onClick={props.onClick}>cancle</button>
    </div>
  )
}

function Serch(props){
  return(
    <div id="modal" className="modal" onClick={(event)=>{event.stopPropagation()}}>
      <section>
        <p><li>select search type</li></p>
        <Link to={'/search/' + 'nft'}><button>NFT</button></Link>
        <Link to={'/search/' + 'idea'}><button>Idea</button></Link>
      </section>
    </div>
  )
}