import React, { Component } from "react";
import SimpleStorageContract from "./contracts/CoinDispencer.json";
import NftCreateAndQueryCont from "./contracts/ThreItems.json";
import ErcToknBridgeContract from "./contracts/ToknBridge.json";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import { ViewItems } from "./pages/ideaView";
import { Home } from "./pages/rootPage"
import { Nav } from "./components/naviCpnt";
import { AdminOpt } from "./pages/adminPage";
import { UserOpt } from "./pages/myPage";
import { UploadIead } from "./pages/IdeaUpage";
import { JoinIead } from "./pages/IdeaJoin";
import { Nftwave } from "./pages/nftUpage";
import { Mynft } from "./pages/nftCollection";
import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract_idea: null,
    contract_nft: null,
    contract_brdg: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance_Idea = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetworkB = NftCreateAndQueryCont.networks[networkId];
      const instance_Nft = new web3.eth.Contract(
        NftCreateAndQueryCont.abi,
        deployedNetworkB && deployedNetworkB.address,
      );

      const deployedNetworkC = ErcToknBridgeContract.networks[networkId];
      const instance_Brdg = new web3.eth.Contract(
        ErcToknBridgeContract.abi,
        deployedNetworkC && deployedNetworkC.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract_idea: instance_Idea, contract_nft: instance_Nft, contract_brdg: instance_Brdg }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract_idea, contract_nft } = this.state;

    //! Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    //! Get the value from the contract to prove it worked.
    const response = await contract_idea.methods.connection().call();
    const res_nft = await contract_nft.methods.connectionTecs().call();

    // Update state with the result.
    console.log(response);
    console.log(res_nft);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const Wrapper = (props) => {
      const params = useParams();
      return <ViewItems accounts={this.state.accounts} contract={this.state.contract_idea}
      web3={this.state.web3}
       {...{...props, match: {params}} } />
    }
    return (
      <div className="App">
        <header>
          <Router>
            <Nav></Nav>
            <section className="">
              <div className="container">
                <Routes>
                  <Route exact path='/' element={<Home 
                    accounts={this.state.accounts} contract={this.state.contract_brdg}/> }/>
                  <Route exact path='/search/:mode' element={<Wrapper/>}/>
                  <Route exact path='/create/:mode' element={<UploadIead 
                    accounts={this.state.accounts} contract={this.state.contract_idea}/>}/>
                  <Route exact path='/joinup' element={<JoinIead 
                    accounts={this.state.accounts} contract={this.state.contract_idea}/>}/>
                  <Route exact path='/admin' element={<AdminOpt 
                    accounts={this.state.accounts} contract={this.state.contract_idea}/>}/>
                  <Route exact path='/myinfo' element={<UserOpt
                    accounts={this.state.accounts} contract={this.state.contract_idea}/>}/>
                  <Route exact path='/ntwave' element={<Nftwave
                    accounts={this.state.accounts} contract={this.state.contract_nft}/>}/>
                  <Route exact path='/ntcollect' element={<Mynft
                    accounts={this.state.accounts} contract={this.state.contract_nft}/>}/>
                </Routes>
              </div>
            </section>
            <Footer />
          </Router>
        </header>
      </div>
    );
  }
}
export default App;

function Footer() {
  return (
    <footer className="footer ">
      <div className="content">
        <p className="has-text-centered">
          this program is PROTO of main stream。
        </p>
      </div>
    </footer>
  );
}
