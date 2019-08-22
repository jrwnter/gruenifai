import React, { Component } from 'react';
import { uid } from 'react-uid';

class DesirabilityControl extends Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 }
    }
    handleXChange(evt) {
        this.setState({ x: evt.target.value })
    }
    handleYChange(evt) {
        this.setState({ y: evt.target.value })
    }
    addPoint() {
        this.props.addPoint(parseFloat(this.state.x), parseFloat(this.state.y))
    }
    render() {
        return (
            <div>
                <div className="columns" >
                    <div className="field column is-one-quarter">
                        <label className="label">x</label>
                        <div className="control">
                            <input value={this.state.x} onChange={(evt) => this.handleXChange(evt)} className="input" type="text" placeholder="coordinate input" />
                        </div>
                    </div>
                    <div className="field column is-one-quarter">
                        <label className="label">y</label>
                        <div className="control">
                            <input value={this.state.y} onChange={(evt) => this.handleYChange(evt)} className="input" type="text" placeholder="coordinate input" />
                        </div>
                    </div>
                    <div className="field column">
                        <label className="label">&nbsp;</label>
                        <div className="control">
                            <button onClick={() => this.addPoint()} className="button is-primary is-outlined">add</button>                    </div>
                    </div>
                </div>
                <div id='points' className="is-pulled-left">
                    <ul>
                        {this.props.points.map((ele) => {
                            return (
                                <div key={uid(ele)} className='columns'>
                                    <div className='column is-three-quarters'>
                                        <em><b>x: </b>{ele.x.toFixed(2)}</em> <em><b>y: </b>{ele.y.toFixed(2)}</em>
                                    </div>
                                    <div className='column is-one-quarter'>
                                        <button onClick={() => this.props.deletePoint(ele.id)} className="button is-small is-primary is-outlined">
                                            <i className="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default DesirabilityControl;