import React from "react";
import { useState, useEffect } from "react";
import FileViewer from "react-file-viewer";
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export const DanteUpage = (account) => {
    const [editorState , setEditorState] = useState();
    const [view, setView] = useState(false);
    const file = "http://localhost:3039/viewdocx/trx-norm";
    const type = "docx";
    // const initData = convertFromRaw({
    //     entityMap: {},
    //     blocks: [
    //       {
    //         key: "xxxxxx", // ユニークなキー値
    //         text: "wirter: "+account.accounts, // 任意のテキスト
    //         type: "unstyled", // テキストのタイプ。初期値は "unstyled"
    //         depth: 0,
    //         entityRanges: [],
    //         inlineStyleRanges: [],
    //         data: {},
            
    //       },
    //     ],
    //   })
    // const initState = EditorState.createWithContent(initData,);
    
    useEffect(()=>{
      setEditorState(EditorState.createEmpty());
    },[]);
    
    const handleView = () => {
      setView(!view);
    };

    const onEditorStateChange = (_editorState) => {
      setEditorState(_editorState);
    };
    
  return (
    <div>
      <button onClick={handleView}>View</button>
      {view && (
        <FileViewer
          fileType={type}
          filePath={file}
        />
      )}
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        textAlignment= 'center'
        placeholder="자유롭게 아이디어를 작성하고 공유하세요"
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
          locale: 'en',
        }}
      />
    </div>
  );
}

const handleImageUpload = (file) => {
    const reader = new FileReader();
    const fileByteArray = [];
    let url = 'http://localhost:3039/viewimg/title(test)z';
    console.log(file, url);

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