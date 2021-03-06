import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getIdeas, getSearchIdea } from '../api.js';
import {ListItemsCompnt} from '../components/ItemsCpnt';
import { NtModal } from '../components/ntModal';
import SimpleStorageContract from "../contracts/ThreItems.json";

export class ViewItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      allBtn: true,
      itemList: [],
      cont: null,
      nftmode: 0,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.searchButton = this.searchButton.bind(this);
  }

  // componentWillUnmount(){
  //   document.removeEventListener('click',this.modalClose)
  // }
  
  componentDidMount = async () => {
    console.log(this.props);
    // this.setState({
    //   itemList: await getIdeas('idea')
    // });
  }

  handleClick = (_searchItems) => {
    //console.log('v ', _searchItems);
    this.props.wired(_searchItems);

    // this.setState({cont: _searchItems});
    // this.setState({showModal: true});

    //document.addEventListener('click',this.modalClose)
    //event.stopPropagation()
  }
  showCategory = () => {
    this.setState({showModal: true});
  }

  modalClose = () => {
    this.setState({showModal: false});
    document.removeEventListener('click',this.modalClose)
    //window.location.reload();
  }

  selectBranch = () => {
    return(<>
      <SearchBarCpnt
        account = {this.state.accounts[0]}
        onClick={(inputstring) => this.searchButton(inputstring)}
      />
      <this.clicktoSale></this.clicktoSale>
    </>
    )
  }

  getAllIdeas = async() => {
    let type = this.props.mode;
    if(type === null)
      type = 1;
    this.setState({
      itemList: await getIdeas(type)
    });
    this.setState({ allBtn: false})
  }
  searchButton = async(_searchString) => {
    //console.log(_searchString);
    this.setState({
      itemList:  await getSearchIdea(_searchString)
    });
    this.setState({ allBtn: true})
  }

  clicktoSale = () => {
    return(
      <>
        <div>
        { this.state.allBtn ? <><button onClick={this.getAllIdeas} style={{width: '200px', height: 'auto'}}>???????????? ????????????</button></>:<></>}
        
        <button onClick={this.showCategory} style={{width: '200px', height: 'auto'}}>???????????? ??????</button></div>
        { this.state.itemList.length ? <>
          <p style={{color: '#a5a5a5', textAlign: 'left', margin: 20, fontSize: "15px"}}>??? {this.state.itemList.length}??? <br/>
          ??????????????? ?????? ????????? ??????????????? ?????? ??????????????? ???????????????</p>
          {this.state.itemList.map(searchItems => (
            <ListItemsCompnt
              key={searchItems.title}
              title = {searchItems.title}
              description = {searchItems.description}
              teamid = {searchItems.id}
              type = {searchItems.type}
              ntmode = {this.state.nftmode}
              onClick={() => this.handleClick(searchItems)}
            />
          ))}
          <CategoryModal
            showFlag={this.state.showModal} onClose={()=>{this.modalClose()}}
          />
          </> : <p style={{margin: 5, fontSize: "15px"}}>?????? ????????? ????????????.</p>
        }
      </>
    )
  }

  render(){
    return(
      <div>
        <section className="App-header">
          <this.selectBranch></this.selectBranch>
        </section>
      </div>
    )
  }
}
class SearchBarCpnt extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchString: null,
      account: this.props.account,
    };
  }
  changeInput = (_evt) => {
    this.setState({searchString: _evt.target.value});
  }
  render(){
    return(
      <>
        {/* <p>????????? ???????????? ?????? ????????? /Threads</p> */}
        <div className="search_bar">
            <i className="fas fa-search search_icon"></i>
            <input id="text2" type="text" onChange={this.changeInput} placeholder="????????? ??????"></input>
            <button className="fas fa-times search_icon" onClick={() => this.props.onClick(this.state.searchString)}>s</button>
        </div>
      </>
    )
  }
}
export const CategoryModal = ({showFlag, onClose}) => {

  return(
    <>{showFlag ? ( // showFlag???true????????????Modal???????????????
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <div>
          <p>??????</p>
          <label style={{cursor: 'pointer'}}><input type="checkbox" name="uncontrolled"></input>
          ????????????</label>
          <label style={{cursor: 'pointer'}}><input type="checkbox" name="uncontrolled"></input>
          ??????/??????</label>
          <label style={{cursor: 'pointer'}}><input type="checkbox" name="uncontrolled"></input>
          ??????/??????</label>
          <label style={{cursor: 'pointer'}}><input type="checkbox" name="uncontrolled"></input>
          ??????/??????</label>
          <label style={{cursor: 'pointer'}}><input type="checkbox" name="uncontrolled"></input>
          ????????????</label>
          <br/><button onClick={onClose}>close</button>
        </div>
      </div>
    </div>
    ) : (
      <></>// showFlag???false????????????Modal??????????????????)
    )}
    </>
  )
}