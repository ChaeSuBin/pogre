import logo from '../logo.svg';
import '../App.css';
import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

export const Home = ({contract, accounts}) => {
  
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
        <p> {accounts} </p>
      </header>
    </div>
  );
}