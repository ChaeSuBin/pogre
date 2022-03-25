import logo from '../logo.svg';
import '../components/modal.css';
import React, { Component } from 'react';
import { getTeamsCount, getIdeas } from "../api.js";
import ListItems from '../components/ItemsCpnt';
import Modal from'../components/cModalCpnt';
//import { Modal } from '../components/modalCpnt'

class ViewItems extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      item: null,
      cont: null,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount = async () => {
    await getTeamsCount().then((data) => {
      this.setState({ item: data.countRow })
      this.item = data.countRow;
    })
    this.spreadData(this.item);
  }

  spreadData = async(_count) => {
    for(let id = 0; id < _count; id++){
      this.setState({
        itemList: await getIdeas()
      })
    }
    //console.log(this.state.itemList[0]);
  }

  handleClick = (_searchItems) => {
    console.log('v ', _searchItems);
    this.setState({cont: _searchItems});
    this.setState({showModal: true});
  }

  modalClose = () => {
    this.setState({showModal: false});
    window.location.reload();
  }

  render(){
    return(
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>문서 {this.state.item}건이 검색됨</p>
          {this.state.itemList.map(searchItems => (
          <ListItems
            key={searchItems.title}
            title = {searchItems.title}
            description = {searchItems.description}
            onClick={() => this.handleClick(searchItems)}
          />
        ))}
          <Modal
            account={'this.state.accounts'} contract={'this.state.contract'}
            showFlag={this.state.showModal} content = {this.state.cont}
            onClick={()=>{this.modalClose()}}
          />
        </header>
      </div>
    )
  }
}
export default ViewItems;
// export function Viewidea() {
//   const itemsList = [];
//   const items = [];
//   const [count, setCount] = useState(null);

//   useEffect(() => {
//     getTeamsCount().then((data) => {
//       //console.log(data);
//       setCount(data.countRow);
//       spreadData(data.countRow);
//     })
//     //spreadData(count);
//   })

//   const spreadData = async(_count) => {
//     itemsList[0] = await getIdeas();
//     console.log('v: ', itemsList);
    
//     for(let id = 0; id < _count; id++){
//       items[id] = itemsList[0][id];
//     }
//     console.log(items[0]);
//   }
  
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>num: {count}</p>
//         {items.map(searchItems => (
//           <ListItems
//             key={searchItems.title}
//             title = {searchItems.title}
//             description = {searchItems.description}
//             //onClick={() => this.handleClick(searchItems)}
//           />
//         ))}
//       </header>
//     </div>
//   );
// }