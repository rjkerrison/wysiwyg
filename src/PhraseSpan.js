import React, {Component} from 'react';
import {femWords, mascWords} from './words.js'
import ReactTooltip from 'react-tooltip';
import uuidv4 from 'uuid/v4'
import {Modifier, EditorState, SelectionState} from 'draft-js'
import './editorStyles.css'


class PhraseSpan extends Component {
    constructor(props) {
        super(props);

        this.selectionDetails = {
            start: this.props.children[0].props.start,
            length: this.props.children[0].props.text.length,
            blockKey: this.props.children[0].props.blockKey
        }

        this.createPhraseSpan = this.createPhraseSpan.bind(this);
        this.uuid = uuidv4();
    }

    handleClick(e) {
        let editorState = this.props.getEditorState()

        let selection = new SelectionState({
            anchorKey: this.selectionDetails.blockKey,
            anchorOffset: this.selectionDetails.start,
            focusKey: this.selectionDetails.blockKey,
            focusOffset: this.selectionDetails.start + this.selectionDetails.length
        })

        let replacement = Modifier.replaceText(
            editorState.getCurrentContent(),
            selection,
            e.target.innerText)

        editorState = EditorState.push(
            editorState,
            replacement,
            'replace-text')

        this.props.setEditorState(editorState)
    }

    render() {
        let mascWordsArr = Object.keys(mascWords)
        let femWordsArr = Object.keys(femWords)
        
        let caseInsensitiveRegex = new RegExp(this.props.decoratedText, 'i')
        if(caseInsensitiveRegex.test(mascWordsArr.join('|'))) {
            return this.createPhraseSpan(mascWords, 'mascWordSpan')
        } else if(caseInsensitiveRegex.test(femWordsArr.join('|'))){
            return this.createPhraseSpan(femWords, 'femWordSpan')
        }
    };
    
    createPhraseSpan(genderedObject, genderedClassName) {
        if(genderedObject[(this.props.decoratedText).toLowerCase()] == null){
            return <span className={genderedClassName}>{this.props.children}</span>;
        } else if (typeof genderedObject[(this.props.decoratedText).toLowerCase()] === 'string'){
            let altWordsItems = <li onClick={this.handleClick.bind(this)}>{genderedObject[(this.props.decoratedText).toLowerCase()]}</li>
            return (
                <span>
                    <span 
                        className={genderedClassName} 
                        data-tip 
                        data-for={this.uuid}
                    >{this.props.children}</span>
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
        } else {
            let altWordsItems = genderedObject[(this.props.decoratedText).toLowerCase()].map((altWord, index) => {
                return <li key={index} onClick={this.handleClick.bind(this)}>{altWord}</li>
            })
            return (
                <span>
                    <span 
                        className={genderedClassName} 
                        data-tip 
                        data-for={this.uuid}
                    >{this.props.children}</span>
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
};

export default PhraseSpan;