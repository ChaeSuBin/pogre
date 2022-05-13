import logo from '../logo.svg';
import '../App.css';
import React from "react";
import { Link } from 'react-router-dom';
import { 
  getMintedTokn,
  putUpdateTokn
} from "../api.js";

export class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      possesTokn: 0,
      mintedBlue: 0,
      storedEth: null, //this.props.storedEth,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.storedEth !== prevProps.storedEth){
      // console.log(this.props);
      // console.log(this.state);
      this.setState({storedEth: this.props.storedEth});
    }
    else{
      console.log('there is no update');
    }
  }
  componentDidMount = () => {
    this.setState({storedEth: this.props.storedEth});
    this.viewTokn20();
    this.getAllPoint();
  }

  viewTokn20 = async() => {
    const tokn_amount = await this.state.contract.methods.getContractTokn20().call();
    this.setState({possesTokn: tokn_amount});
  }

  getAllPoint = async() => {
    const bluePoint = await getMintedTokn();
    this.setState({mintedBlue: bluePoint});;
  }

  faucet = async() => {
    const record = {
      useraddr: this.state.accounts,
      token: 5
    }
    await putUpdateTokn(record);
  }

  render(){
    return(
      <div className="App">
        <p style={{textAlign: 'left', margin: 0}}> {this.state.accounts} </p>
        <header className="App-header">
          <section className="App-textBoder">
            contract Ether : { this.state.storedEth /10 ** 18 } <br/>
            contract Token: { this.state.possesTokn / 10 ** 18 } <br/>
            minted all blue: { this.state.mintedBlue }
          </section>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* <a
            className="App-link"
            href="http://localhost:3000/search"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wellcom.
          </a> */}
          <nav className='hori'>
              <Link to="/search/idea" style={{ textDecoration: 'none' }}>
                <button className='button04' onClick={() => {this.props.wired(1)}}>아이디어 경매장</button>
                <button className='button04' onClick={() => {this.props.wired(0)}}>아이디어 광장</button>
              </Link>
          </nav> 
          <section>
            <p style={{fontSize: "15px"}}>아이디어 경매장: 경매를 통해 타인이 올린 아이디어의 소유권을 얻을 수 있습니다.</p>
            <p style={{fontSize: "15px"}}>아이디어 광장: 사람들이 올린 아이디어를 자유롭게 열람하고 공유할 수 있습니다.</p>
          </section>
          {/* <Link to="/faucet"><button>faucet</button></Link> */}
      </header>
    </div>
    )
  }
}