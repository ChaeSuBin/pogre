import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getOwnNft } from '../api.js';
import ListItems from '../components/ItemsCpnt';
import { NtModal } from '../components/ntModal';

export class Mynft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      itemsId: [],//totaltokn
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.modalClose = this.modalClose.bind(this);
  }
  
  componentDidMount = async () => {
    const { accounts, contract } = this.state;
    //console.log(contract);
    let totalTokn = await contract.methods.getTotalSupp().call();
    let balanceOf = await contract.methods.balanceOf(accounts[0]).call();
    let copyList = [...this.state.itemList];
    let copyItemId = [...this.state.itemsId];
    let toknUri = '';
    //let iter = 0;

    totalTokn = Number(totalTokn);
    balanceOf = Number(balanceOf);

    if(balanceOf == 0)
      totalTokn = 1;
    while(totalTokn-1){
    //while(iter != 5){
        // console.log(totalTokn);
        // console.log(balanceOf);
      if(balanceOf){
        let ownerOf = await contract.methods.ownerOf(totalTokn).call();
        //console.log(ownerOf);
        if(ownerOf != accounts[0]){
          --totalTokn;
        }
        else{
          --totalTokn;
          --balanceOf;
          toknUri = await contract.methods.tokenURI(totalTokn).call();
          copyList.push(toknUri);
          copyItemId.push(totalTokn);
        }
      }
      //++iter;
    }
    console.log('prog');
    //this.setState({itemList: copyList});
    this.setState({itemsId: copyItemId});
    this.findNftbyMetadata(copyList);
    console.log(this.state.itemsId);
  }

  findNftbyMetadata = async(_metadatarr) => {
    for(let iter = 0; iter < _metadatarr.length; ++iter){
      _metadatarr[iter] = await getOwnNft(_metadatarr[iter]);
    }
    this.setState({itemList: _metadatarr});
    return 0;
  }

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
              ntmode = {1}
              onClick={() => this.handleClick(searchItems)}
            />
          ))}
          <NtModal
            account={this.state.accounts[0]}
            contract={this.state.contract}
            showFlag={this.state.showModal}
            viewMode={true}
            content = {this.state.cont}
            onClick={()=>{this.modalClose()}} 
          />
        </header>
      </div>
    )
  }
}