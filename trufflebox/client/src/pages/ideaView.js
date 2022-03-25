import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getTeamsCount, getIdeas } from '../api.js';
import ListItems from '../components/ItemsCpnt';
import { Modal } from'../components/cModalCpnt';
import { NtModal } from '../components/ntModal';
import SimpleStorageContract from "../contracts/ThreItems.json";

export class ViewItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      item: null,
      cont: null,
      nftmode: 0,
      web3: this.props.web3, 
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.modalClose = this.modalClose.bind(this);
  }

  // componentWillUnmount(){
  //   document.removeEventListener('click',this.modalClose)
  // }
  
  componentDidMount = async () => {
    //console.log(this.props.match.params.mode);
    if(this.props.match.params.mode === 'nft'){
      this.setState({nftmode: 1});
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
    this.setState({
      itemList: await getIdeas(this.props.match.params.mode)
    });
  }
  runExample = async () => {
    const { accounts, contract } = this.state;
    //console.log(contract);
    const response = await contract.methods.connectionTecs().call();
    this.setState({ checkValue: response });
    console.log('v: ', response);
    this.render();
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
          <p>문서 {this.state.itemList.length}건이 검색됨</p>
          {this.state.itemList.map(searchItems => (
            <ListItems
              key={searchItems.title}
              title = {searchItems.title}
              description = {searchItems.description}
              ntmode = {this.state.nftmode}
              onClick={() => this.handleClick(searchItems)}
            />
          ))}
          { this.state.nftmode ? <NtModal
            account={this.state.accounts[0]} contract={this.state.contract}
            showFlag={this.state.showModal} content = {this.state.cont}
            onClick={()=>{this.modalClose()}} 
            /> : <Modal
            account={this.state.accounts[0]} contract={this.state.contract}
            showFlag={this.state.showModal} content = {this.state.cont}
            onClick={()=>{this.modalClose()}} />
          }
        </header>
      </div>
    )
  }
}