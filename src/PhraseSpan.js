import React, {Component} from 'react';
import {femWords, mascWords} from './words.js'
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4'
import {Modifier, EditorState, SelectionState} from 'draft-js'
import './editorStyles.css'

class PhraseSpan extends Component {
    constructor(props) {
        super(props);

        this.magicThings = {
            start: props.props.children[0].props.start,
            length: props.props.children[0].props.text.length,
            blockKey: props.props.children[0].props.blockKey
        }

        this.checkPhraseSpan = this.checkPhraseSpan.bind(this);
        this.createPhraseSpan = this.createPhraseSpan.bind(this);
        this.uuid = uuidv4();
    }

    handleClick(e) {
        let editorState = this.props.props.getEditorState()

        let selection = new SelectionState({
            anchorKey: this.magicThings.blockKey,
            anchorOffset: this.magicThings.start,
            focusKey: this.magicThings.blockKey,
            focusOffset: this.magicThings.start + this.magicThings.length
        })
        
        console.log({editorState, selection})

        let replacement = Modifier.replaceText(
            editorState.getCurrentContent(),
            selection,
            e.target.innerText)

        editorState = EditorState.push(
            editorState,
            replacement,
            'replace-text')

        this.props.props.setEditorState(editorState)
    }

    checkPhraseSpan() {
        let mascWordsArr = Object.keys(mascWords)
        let femWordsArr = Object.keys(femWords)
        
        let caseInsensitiveRegex = new RegExp(this.props.props.decoratedText, 'i')
        if(caseInsensitiveRegex.test(mascWordsArr.join('|'))) {
            return this.createPhraseSpan(mascWords, 'mascWordSpan')
        } else if(caseInsensitiveRegex.test(femWordsArr.join('|'))){
            return this.createPhraseSpan(femWords, 'femWordSpan')
        }
    };
    
    createPhraseSpan(genderedObject, genderedClassName) {
        if(genderedObject[(this.props.props.decoratedText).toLowerCase()] == null){
            return <span className={genderedClassName}>{this.props.props.children}</span>;
        } else {
            let altWordsItems = genderedObject[(props.props.decoratedText).toLowerCase()].map((altWord, index) => {
                return <li key={index} onClick={this.handleClick.bind(this)}>{altWord}</li>
            })
            return (
                <span>
                    <span 
                        className={genderedClassName} 
                        data-tip 
                        data-for={this.uuid}
                    >{this.props.props.children}</span>
                        <ReactTooltip 
                            className='focusTooltip' 
                            delayHide={500} 
                            id={this.uuid}
                            effect='solid' 
                            aria-haspopup='true' 
                            cursor='pointer' 
                            place='bottom' 
                            getContent={() => {
                                return <ul className='altListUl'>{altWordsItems}</ul>
                        }}> 
                        </ReactTooltip>
                </span>
            )
        }
    }

    render(){
        return (
            this.checkPhraseSpan()
        )
    }
};

export default PhraseSpan;