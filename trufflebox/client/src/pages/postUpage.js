import React from "react";
import { useState, useEffect } from "react";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export const DanteUpage = (account) => {
    const [editorState , setEditorState] = useState();
    
    useEffect(()=>{
        setEditorState(EditorState.createEmpty());
      },[]);

    const onEditorStateChange = (_editorState) => {
        setEditorState(_editorState);
    };
    
  return (
    <div>
        <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
                //options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: false },
                image: {
                    uploadCallback: handleImageUpload,
                    alt: { present: true, mandatory: false },
                    previewImage: true,
                },
                blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'], },
            }}
            localization={{
                locale: 'ja',
            }}
        />
        <img src="http://localhost:3039/viewimg/title(test)z" alt="Girl in a bus" width="600" height="400"/> 
    </div>
  );
}

const handleImageUpload = (file) => {
    const reader = new FileReader();
    const fileByteArray = [];
    let url = 'http://localhost:3039/viewimg/title(test)z';
    console.log(file, url);
    
    //return({ data: { link: url} });
    return new Promise((resolve, reject) => {
        resolve({ data: { link: url } });
    });
    // reader.readAsArrayBuffer(e.target.files[0]);
    // reader.onloadend = (_evt) => {
    //   if (_evt.target.readyState === FileReader.DONE) {
    //     const arrayBuffer = _evt.target.result,
    //     array = new Uint8Array(arrayBuffer);
    //     for (const a of array) {
    //       fileByteArray.push(a);
    //     }
    //     console.log(fileByteArray);
    //     this.setState({fblob: fileByteArray});
    //   }
    // }
  }