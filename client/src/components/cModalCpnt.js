import React from 'react';
import { getIdeaPlayers, getPlayers } from "../api.js";
import { Link } from "react-router-dom";
import './modal.css';

// 子コンポーネント（モーダル）
class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editors: [],
        };
    }

    componentDidUpdate = (prevProps) => {
        //console.log(this.props);
        if (this.props.content !== prevProps.content){
            this.getPlayer();
        }
        else{
            console.log('there is no update');
        }
        //this.getPlayer();
    }

    getPlayer = async() => {
        if(this.props.content == null){
            console.log('-');
        }
        else{
            //console.log(props.content.origin);
            let ideaid = this.props.content.id;
            await getIdeaPlayers(ideaid).then((data) => {
                let copyEditors = [...this.state.editors];
                for(let iter = 0; iter < data.length; ++iter){
                    //console.log(data[iter].playerId);
                    this.innerSync(data[iter].playerId, copyEditors);
                }
            })
        }
    }
    innerSync = async(_playerId, _copyEditors) => {
        const p = await getPlayers(_playerId);
        _copyEditors.push(p.sub);
        this.setState({editors: _copyEditors});
        console.log(this.state.editors);
    }

    joinIdea = () => {
        console.log('close');
    }

    render(){
        return(
            <>
                {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
                <div id="overlay" className='overlay'>
                    <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
                        <div>
                            <p>{this.props.content.title}</p>
                            <ul><div style={{fontSize: "15px"}}>이 아이디어에 아래의 참가자가 참가중</div>
                                {this.state.editors.map((editor) => (
                                <li key={editor}>
                                    {editor} :-:
                                </li>
                                ))}
                            </ul>
                            <button onClick={this.props.onClick}>Close</button>
                            <button onClick={this.props.onClick}>Download</button>
                            <Link to={{
                                pathname: '/upjoin',
                                search: `title=${this.props.content.title}`,
                                hash: `origin=${this.props.content.origin}`,
                                state: {key: 'valuee'}
                            }}>
                            <button onClick={this.joinIdea}>Join</button>
                            </Link>
                        </div>
                    </div>
                </div>
                ) : (
                <></>// showFlagがfalseの場合はModalは表示しない)
                )}
            </>
            
        );
    }
}

export default Modal;