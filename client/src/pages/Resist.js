import logo from '../logo.svg';
import React, { Component } from 'react';
import { getTeamsCount, getIdeas } from "../api.js";

class UserRegi extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      nicname: '',
      address: '',
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  
  componentDidMount = async () => { }

  handleFormSubmit = async(e) => {
    e.preventDefault();
    console.log(this.state.nicname);
    console.log(this.state.address);
  }
  handleChange(event) {
    let name = event.target.name;
    //console.log(name);
    this.setState({[name]: event.target.value});
  }

  render(){
    return(
      <div>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <form onSubmit={this.handleFormSubmit}>
                addr:
                <input type='text' name="address" className="input" 
                placeholder='address' onChange={this.handleChange}/>
                
                <p>name: 
                <input type='text' name="nicname" className="input"
                placeholder='name' onChange={this.handleChange}/></p>
                
                <button type="submit" className="button is-warning">
                authorize
                </button>
            </form>
        </header>
      </div>
    )
  }
}
export default UserRegi;