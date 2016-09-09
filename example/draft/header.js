import React, {Component, PropTypes} from "react";
import DraftEditorBlock from 'draft-js/lib/DraftEditorBlock.react';

export default function (size) {
    return class Header extends Component {
        render() {
            const style = {
                fontFamily: "Helvetica"
            };
            return React.createElement('h' + size, {style, className: 'header'}, <DraftEditorBlock {...this.props}/>)
        }
    }
}
