import React, {Component} from 'react';
import {femWords, mascWords} from './words.js'
import ReactTooltip from 'react-tooltip';
import './editorStyles.css'

class PhraseSpan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            update: false
        };
        this.checkPhraseSpan = this.checkPhraseSpan.bind(this);
        this.createPhraseSpan = this.createPhraseSpan.bind(this);
    }

    handleClick(e) {
        this.setState({ update: true, altWord: e.target.innerText }, () => console.log(this.state));
    }

    checkPhraseSpan(props) {
        let mascWordsArr = Object.keys(mascWords)
        let femWordsArr = Object.keys(femWords)
        
        let caseInsensitiveRegex = new RegExp(props.props.decoratedText, 'i')
        if(caseInsensitiveRegex.test(mascWordsArr.join('|'))) {
            return this.createPhraseSpan(props, mascWords, 'mascWordSpan')
        } else if(caseInsensitiveRegex.test(femWordsArr.join('|'))){
            return this.createPhraseSpan(props, femWords, 'femWordSpan')
        }
    };
    
    createPhraseSpan(props, genderedObject, genderedClassName) {
        let counter = 0;
        if(genderedObject[(props.props.decoratedText).toLowerCase()] == null){
            return <span className={genderedClassName}>{props.props.children}</span>;
        } else {
            counter = counter + 1;
            counter = counter.toString();
            let altWordsItems = genderedObject[(props.props.decoratedText).toLowerCase()].map((altWord, index) => {
                return <li key={index} onClick={this.handleClick.bind(this)}>{altWord}</li>
            })
            return (
                <span>
                    <span 
                        className={genderedClassName} 
                        data-tip 
                        data-for={counter}
                        >{props.props.children}</span>
                    <ReactTooltip 
                        className='focusTooltip' 
                        delayHide={500} 
                        id={counter} 
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
            this.checkPhraseSpan(this.props)
        )
    }
};

export default PhraseSpan;