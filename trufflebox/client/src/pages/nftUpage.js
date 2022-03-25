import logo from '../logo.svg';
import '../App.css';
import React from "react";
import SimpleStorageContract from "../contracts/ThreItems.json";
import { postCreateNft } from '../api';

export class Nftwave extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      checkValue: null,
      web3: this.props.web3, 
      fileBuffer: [],
      accounts: this.props.accounts, 
      contract: null
    };
  };
  
  componentDidMount = async () => {
    try {
      // Get the contract instance.
      const networkId = await this.state.web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new this.state.web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      this.setState({ contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  runExample = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.connectionTecs().call();
    this.setState({ checkValue: response });
    console.log('v: ', response);
  };

  handleFormSubmit = (evt) => {
    evt.preventDefault();
    const record = {
      name: evt.target.elements.docuname.value,
      desc: evt.target.elements.docudesc.value,
      price: evt.target.elements.price.value,
      limit: evt.target.elements.limit.value,
      useraddr: this.state.accounts[0],
      fbolb: this.state.fileBuffer
    }
    console.log('c: ', record);
    postCreateNft(record);
  }

  onFileInputChange = (e) => {
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
        //console.log(fileByteArray);
        this.setState({fileBuffer: fileByteArray});
        console.log(this.state.fileBuffer);
      }
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App-header">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h2>Make Your NFT</h2>
        <p>Truffle Box is ready.</p>
        The stored value is: <b>{this.state.checkValue}</b>
        <br></br>
        <form onSubmit={this.handleFormSubmit}>
          <div className="control">
            select file: <input type='file' onChange={this.onFileInputChange}/>
          </div>
          <label className="label">title</label>
          <div className="control">
            <input name="docuname" className="input" />
          </div>
          <label className="label">description</label>
          <div className="control">
            <textarea name="docudesc" rows='7' cols='39' className="input" />
          </div>
          <label className="label">set value: </label>
          <input name="price" type="text" className="input"/><p>
          <label className="label">set limit: </label>
          <input name="limit" type="text" className="input"/></p>
          <button type="submit" className="button is-warning">
            Mint
          </button>
        </form>
      </div>
    );
  }
}