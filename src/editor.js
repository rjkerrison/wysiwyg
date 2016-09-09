import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {EditorState, convertToRaw, convertFromRaw, CompositeDecorator} from 'draft-js';
import {DefaultDraftBlockRenderMap} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createPlugins from './create-plugins';
import {Map} from 'immutable';

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
                : EditorState.createEmpty()
        };

        this.phraseDecorator = this.getPhraseDecorator();
    }

    getPhraseDecorator() {
        const PHRASE_REGEX = /textio is awesome/ig;

        function phraseStrategy(contentBlock, callback) {
            findWithRegex(PHRASE_REGEX, contentBlock, callback);
        }

        function findWithRegex(regex, contentBlock, callback) {
            const text = contentBlock.getText();
            let matchArr, start;
            while ((matchArr = regex.exec(text)) !== null) {
                console.log('found match');
                start = matchArr.index;
                callback(start, start + matchArr[0].length);
            }
        }

        const styles = {
            backgroundColor: '#ff9999'
        };

        const PhraseSpan = (props) => {
            console.log(props);
            return <span style={styles}>{props.children}</span>;
        };

        return {
            strategy: phraseStrategy,
            component: PhraseSpan,
        };
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    shouldComponentUpdate(props, state) {
        if (this.props.value !== props.value && this._raw !== props.value) {
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
