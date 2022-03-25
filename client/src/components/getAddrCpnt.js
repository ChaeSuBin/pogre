import React from "react";

export async function getAccount(){
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
    //console.log(accounts);
    return accounts[0];
}