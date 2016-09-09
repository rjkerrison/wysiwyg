import React, {Component} from 'react';
import createCleanupEmptyPlugin from 'draft-js-cleanup-empty-plugin';
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import createToolbarPlugin, {ToolbarDecorator} from 'draft-js-toolbar-plugin';

// Styles
import 'draft-js-toolbar-plugin/lib/plugin.css';

// Utils
import addBlock from 'draft-js-dnd-plugin/lib/modifiers/addBlock';
import {RichUtils} from 'draft-js';

// Init Plugins
export default ({
    handleUpload, handleDefaultData, plugins = ()=> {
}, toolbar = {disableItems: [], textActions: []}
}) => [
    plugins,
    createEntityPropsPlugin({}),
    createToolbarPlugin({
        __toolbarHandler: {
            add: props => console.log('Add toolbar', props),
            remove: props => console.log('Remove toolbar', props),
        }, textActions: [...[{
            button: <span>H1</span>,
            key: 'H1',
            label: 'Header 1',
            active: (block, editorState) => block.get('type') === 'header-1',
            toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
                editorState,
                'header-1'
            )),
        }, {
            button: <span>H2</span>,
            key: 'H2',
            label: 'Header 2',
            active: (block, editorState) => block.get('type') === 'header-2',
            toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
                editorState,
                'header-2'
            )),
        }, {
            button: <span>&bull;</span>,
            key: 'UL',
            label: 'Unordered List',
            active: (block, editorState) => block.get('type') === 'unordered-list-item',
            toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
                editorState,
                'unordered-list-item'
            )),
        }, {
            button: <span>1.</span>,
            key: 'OL',
            label: 'Ordered List',
            active: (block, editorState) => block.get('type') === 'ordered-list-item',
            toggle: (block, action, editorState, setEditorState) => setEditorState(RichUtils.toggleBlockType(
                editorState,
                'ordered-list-item'
            )),
        }].filter(toolbarItem => !toolbar.disableItems.includes(toolbarItem.key)), ...toolbar.textActions],
        inlineStyles: [{label: 'Bold', button: <b>B</b>, style: 'BOLD'}],
        clearTextActions: true
    }),
];
