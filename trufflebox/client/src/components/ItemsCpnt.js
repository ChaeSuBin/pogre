import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { getImgBlob } from '../api';
import './card.css';

export class ListItemsCompnt extends Component {
  state = {
    imagePreviewUrl: null
  }

  componentDidMount = async() => {
    if(this.props.ntmode){
      const blob = await getImgBlob(this.props.title);
      //console.log(blob.data);
      let bytearray = new Uint8Array(blob.data.length);
      for(let iter = 0; iter < blob.data.length; ++iter){
        bytearray[iter] = blob.data[iter];
      }
      let conBlob = new Blob([bytearray]);
      //console.log(conBlob);
      this.handleFileReader(conBlob);
    }
  }

  handleFileReader = (_blob) => {
    const reader = new FileReader()
    const file = _blob
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }); 
    }   
    reader.readAsDataURL(file);
  }

  render() {
    const {
      title,
      teamid,
      description,
      ...props
    } = this.props;

    return (
      <div className="ToDoListItem"{...props}>
        
        <Link to={'/ideadetails/' + teamid} style={{ textDecoration: 'none' }}>
        <div className="ToDoListItem-title">{title}</div></Link>
        { this.state.imagePreviewUrl===null ? <></>
            : <div><img src={this.state.imagePreviewUrl} /></div>
        }
        <div className="ToDoListItem-description">{description}</div>
      </div>
    );
  }
};
export class AlertCardCpnt extends Component {

  render() {
    const {
      title,
      description,
      ...props
    } = this.props;

    return (
      <div className="AlertListItem"{...props}>
        <div className="AlertListItem-title">{title}</div>
        <div className="AlertListItem-description">{description}</div>
      </div>
    );
  }
};