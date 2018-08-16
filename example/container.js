import React from 'react';
import {RichUtils} from 'draft-js';
import Editor from '../src';
import {Blocks, Data} from './draft';
import request from 'superagent';
import createToolbarPlugin from 'draft-js-toolbar-plugin';
export default class Example extends React.Component {
    constructor(props) {
        super(props);

        var data = localStorage.getItem("data");
        var oldHash = localStorage.getItem("hash");
        var hash = this.hash = function (s) {
                return s.split("").reduce(function (a, b) {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a
                }, 0);
            }(JSON.stringify(Data)) + '';

        if (data && oldHash === hash) {
            try {
                data = JSON.parse(data);
            }
            catch (err) {
                data = null;
                console.error(err);
            }
        }
        else {
            data = null;
        }
        this.state = {
            data: data || Data,
            view: 'edit',
            saved: false
        }
    }

    save() {
        localStorage.setItem("data", JSON.stringify(this.state.data));
        localStorage.setItem("hash", this.hash);

        this.setState({
            saved: true
        });
        setTimeout(()=> {
            this.setState({
                saved: false
            });
        }, 1500)
    }

    upload = (data, success, failed, progress) => {
        console.log(data.formData);
        request.post('/upload')
            .accept('application/json')
            .send(data.formData)
            .on('progress', ({percent}) => {
                progress(percent);
            })
            .end((err, res) => {
                if (err) {
                    return failed(err);
                }
                success(res.body.files, 'image');
            });
    }

    defaultData = (blockType) => {
        if (blockType === 'block-image') {
            return {
                url: '/whoa.jpg',
            }
        }
        return {};
    }

    render() {
        const {data, view, saved} = this.state;
        const styles = {
            WebkitUserSelect: 'text'
        };

        return (
            <div style={styles} className="flex-container">
                <div className="container-content" style={{display: view !== 'json' ? 'block' : 'none'}}>
                    <div className="TeXEditor-root">
                        <div className="TeXEditor-editor">
                            <Editor onChange={data=>this.setState({data})}
                                    value={data}
                                    blockTypes={Blocks}
                                    cleanupTypes="*"
                                    sidebar={0}
                                    handleDefaultData={this.defaultData}
                                    handleUpload={this.upload}
                                    toolbar={{
                                        disableItems: ['H5'],
                                        textActions: []
                                    }}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
