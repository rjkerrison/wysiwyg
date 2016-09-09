import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ToolbarDecorator} from 'draft-js-toolbar-plugin';

const getDisplayName = WrappedComponent => {
    const component = WrappedComponent.WrappedComponent || WrappedComponent;
    return component.displayName || component.name || 'Component';
};

const getComponent = WrappedComponent => class BlockWrapper extends Component {
    static displayName = `BlockWrapper(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent.WrappedComponent || WrappedComponent;

    constructor(props) {
        super(props);
        this.state = {};
    }

    setEntityData = patch => {
        const {blockProps, block} = this.props;
        const {setEntityData} = blockProps;
        setEntityData(patch);
        this.setState({
            ...patch
        });
    }

    render() {
        const {blockProps} = this.props;
        const readOnly = blockProps.pluginEditor.getReadOnly();
        return <WrappedComponent {...this.props} {...blockProps.entityData} {...this.state}
                                 setEntityData={this.setEntityData} readOnly={readOnly}/>
    }
}

export default options => WrappedComponent => {
    const {toolbar} = options || {};
    let component = getComponent(WrappedComponent);
    if (toolbar !== false) {
        component = ToolbarDecorator(toolbar || {})(component);
    }
    return component;
}