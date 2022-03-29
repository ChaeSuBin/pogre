import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getTeamsCount, getIdeas } from '../api.js';
import ListItems from '../components/ItemsCpnt';
import { NtModal } from '../components/ntModal';
import SimpleStorageContract from "../contracts/ThreItems.json";

export class Mynft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      itemsId: [],
      web3: this.props.web3, 
      accounts: this.props.accounts,
      contract: null
    };
    //this.modalClose = this.modalClose.bind(this);
  }
  
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
  }
  runExample = async () => {
    const { accounts, contract } = this.state;
    //console.log(contract);
    let totalTokn = await contract.methods.getTotalSupp().call();
    let balanceOf = await contract.methods.balanceOf(accounts[0]).call();
    let copyList = [...this.state.itemList];
    let copyItemId = [...this.state.itemsId];
    let toknUri = '';

    totalTokn = Number(totalTokn);
    balanceOf = Number(balanceOf);

    // let ownerOf = await contract.methods.ownerOf(totalTokn).call();
    // console.log(totalTokn);
    // console.log(--totalTokn);
    // if(ownerOf == accounts[0]){
    //     console.log('wow');
    // }
    while(totalTokn){
    //while(false){
        console.log(totalTokn);
      if(balanceOf){
        let ownerOf = await contract.methods.ownerOf(totalTokn).call();
        if(ownerOf != accounts[0]){
          --totalTokn;
        }
        else{
          --balanceOf;
          toknUri = await contract.methods.tokenURI(totalTokn).call();
          copyList.push(toknUri);
          copyItemId.push(totalTokn);
          console.log(this.state.itemList);
        }
      }
    }
    console.log('prog');
    this.setState({itemList: copyList});
    this.setState({itemsId: copyItemId});
  };

  handleClick = (_searchItems) => {
    //console.log('v ', _searchItems);
    this.setState({cont: _searchItems});
    this.setState({showModal: true});
    //document.addEventListener('click',this.modalClose)
    //event.stopPropagation()
  }

  modalClose = () => {
    this.setState({showModal: false});
    document.removeEventListener('click',this.modalClose)
    window.location.reload();
  }

  render(){
    return(
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>보유 {this.state.itemList.length}건.</p>
          {this.state.itemList.map(searchItems => (
            <ListItems
              key={searchItems.title}
              title = {searchItems.title}
              description = {searchItems.description}
              ntmode = {this.state.nftmode}
              onClick={() => this.handleClick(searchItems)}
            />
          ))}
          <NtModal
            account={this.state.accounts[0]} contract={this.state.contract}
            showFlag={this.state.showModal} content = {this.state.cont}
            onClick={()=>{this.modalClose()}} 
          />
        </header>
      </div>
    )
  }
}