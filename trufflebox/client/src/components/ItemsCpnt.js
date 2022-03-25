import React, { Component } from 'react';
import { getImgBlob } from '../api';
import './card.css';

class ListItemsCompnt extends Component {
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
      description,
      ...props
    } = this.props;

    return (
      <div className="ToDoListItem"{...props}>
        <div className="ToDoListItem-title">{title}</div>
        <div><img src={this.state.imagePreviewUrl} /></div>
        <div className="ToDoListItem-description">{description}</div>
      </div>
    );
  }
}

export default ListItemsCompnt;