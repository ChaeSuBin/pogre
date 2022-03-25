import logo from '../logo.svg';
import '../App.css';
import React, { useState, useEffect } from "react";
import { getAccount } from '../components/getAddrCpnt';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

export function Home() {
  
  useEffect(async()=>{
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      //getAccount();
      const account = await getAccount();
      console.log(account);
    }
  });
  
  const getaccount = async() => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (window.ethereum)
    {
      try {
        await window.ethereum.enable();
      } catch (err) {
        console.log("Access to your Ethereum account rejected.");
      }
    }
    if (typeof web3 === 'undefined'){
      console.log("CanNOT access the Ethereum Web3 injected API from your Web browser.");
    }
  
    console.log(accounts);
    return accounts[0];
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="http://localhost:3000/search"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wellcom.
        </a>
        <a
          className="App-link"
          href="http://localhost:3000/upload"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upload your Idea
        </a>
      </header>
    </div>
  );
}