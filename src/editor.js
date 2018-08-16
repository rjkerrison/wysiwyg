import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {findDOMNode} from 'react-dom';
import {EditorState, convertToRaw, convertFromRaw, CompositeDecorator} from 'draft-js';
import {DefaultDraftBlockRenderMap} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createPlugins from './create-plugins';
import {Map} from 'immutable';
import {femWords, mascWords} from './words.js'
import ReactTooltip from 'react-tooltip';
import './editorStyles.css'

class WysiwygEditor extends Component {
    constructor(props) {
        super(props);

        this.batch = batch(200);
        this.plugins = createPlugins(props);

        this.blockRenderMap = DefaultDraftBlockRenderMap.merge(
            this.customBlockRendering(props)
        );

        this.state = {
            editorState: props.value
                ? EditorState.push(EditorState.createEmpty(), convertFromRaw(props.value))
                : EditorState.createEmpty(),
            update: false
        };
        this.phraseDecorator = this.getPhraseDecorator()
    }

    handleClick(e) {
        this.setState({ update: true, altWord: e.target.innerText });
    }
    
    getPhraseDecorator() {
        let mascWordsArr = Object.keys(mascWords)
        let MASC_REGEX = new RegExp(`\\b(${mascWordsArr.join('|')})`, 'gi')
        let femWordsArr = Object.keys(femWords)
        let FEM_REGEX = new RegExp(`\\b(${femWordsArr.join('|')})`, 'gi')

        function phraseStrategy(contentBlock, callback) {
            findWithRegex(MASC_REGEX, contentBlock, callback)
            findWithRegex(FEM_REGEX, contentBlock, callback)        
        }
 
        function findWithRegex(regex, contentBlock, callback) {
            const text = contentBlock.getText();
            let matchArr, start;
            while ((matchArr = regex.exec(text)) !== null) {
                start = matchArr.index;
                callback(start, start + matchArr[0].length);
            }
        }

        const PhraseSpan = (props) => {
            console.log('phrase span state', this.state)
            let caseInsensitiveRegex = new RegExp(props.decoratedText, 'i')
            if(caseInsensitiveRegex.test(mascWordsArr.join('|'))) {
                return createPhraseSpan(props, mascWords, 'mascWordSpan')
            } else if(caseInsensitiveRegex.test(femWordsArr.join('|'))){
                return createPhraseSpan(props, femWords, 'femWordSpan')
            }
        };

        let counter = 0;
        
        const createPhraseSpan = (props, genderedObject, genderedClassName) => {
            if(genderedObject[(props.decoratedText).toLowerCase()] == null){
                return <span className={genderedClassName}>{props.children}</span>;
            } else {
                counter = counter + 1;
                counter = counter.toString();
                let altWordsItems = genderedObject[(props.decoratedText).toLowerCase()].map((altWord, index) => {
                    return <li key={index} onClick={this.handleClick.bind(this)}>{altWord}</li>
                })
                return (
                    <span>
                        <span 
                            className={genderedClassName} 
                            data-tip 
                            data-for={counter}
                            >{props.children}</span>
                        <ReactTooltip className='focusTooltip' delayHide={500} id={counter} effect='solid' aria-haspopup='true' cursor='pointer' place='bottom' getContent={() => {
                            return <ul className='altListUl'>{altWordsItems}</ul>
                        }}> 
                        </ReactTooltip>
                    </span>
                )
            }
        }
        
        return {
            strategy: phraseStrategy,
            component: PhraseSpan,
        };       
 
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    shouldComponentUpdate(props, state) {
        if(this.state.update) {
            this.getPhraseDecorator()
            this.setState({update: false, altWord: null})
            return true;
        } else if (this.props.value !== props.value && this._raw !== props.value) {
            return true;
        } else if (this.state.active !== state.active
            || this.state.readOnly !== state.readOnly
            || this.state.editorState !== state.editorState) {
            return true;
        } else if (this.props.readOnly !== props.readOnly
            || this.props.fileDrag !== props.fileDrag
            || this.props.uploading !== props.uploading
            || this.props.percent !== props.percent) {
            return true;
        } 
        return false;
    }

    onChange = (editorState) => this.setState({editorState});
    onPaste = (text, html) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        console.log(doc);
    };

    focus = () => {
        this.refs.editor.focus();
    };

    blockRendererFn = contentBlock => {
        const {blockTypes} = this.props;
        const type = contentBlock.getType();
        return blockTypes && blockTypes[type] ? {
            component: blockTypes[type]
        } : undefined;
    }

    customBlockRendering = props => {
        const {blockTypes} = props;
        var newObj = {
            'paragraph': {
                element: 'div',
            },
            'unstyled': {
                element: 'div',
            },
        };
        for (var key in blockTypes) {
            newObj[key] = {
                element: 'div'
            };
        }
        return Map(newObj);
    }

    render() {
        const {readOnly} = this.props;
        const decorators = [this.phraseDecorator];

        return (
            <Editor readOnly={readOnly} editorState={this.state.editorState}
                    plugins={this.plugins}
                    blockRenderMap={this.blockRenderMap}
                    blockRendererFn={this.blockRendererFn}
                    decorators={decorators}
                    onChange={this.onChange}
                    handlePastedText={this.onPaste}
                    ref="editor"
            />
        );
    }
}

export default WysiwygEditor;

const batch = (limit = 500) => {
    var _callback = null;
    return (callback) => {
        _callback = callback;
        setTimeout(() => {
            if (_callback === callback) {
                callback();
            }
        }, limit);
    }
}
