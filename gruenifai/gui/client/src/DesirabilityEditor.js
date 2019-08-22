import React, {
    Component, Fragment
} from 'react';
import DesirabilityCanvas from './DesirabilityCanvas';
import {uniqWith, isEqual, remove} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {scaleLinear} from 'd3-scale';
import {MARGIN, EPSILONFACTOR} from './Constants';

const compareX = (a, b) => a.x - b.x;
const roundToTwo = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
}

class DesirabilityEditor extends Component {
    constructor(props) {
        super(props)
        let points = this.props.model.desirability.map((point) => {
            return {id: uuidv4(), x: point.x, y: point.y}
        })

        let xMin = points.reduce((min, point) => Math.min(min, point.x), points[0].x)
        let xMax = points.reduce((max, point) => Math.max(max, point.x), points[0].x)
        let xEpsilon = (xMax - xMin) / EPSILONFACTOR;
        xMin = roundToTwo(xMin - xEpsilon);
        xMax = roundToTwo(xMax + xEpsilon);

        this.addPoint = this.addPoint.bind(this)
        this.deletePoint = this.deletePoint.bind(this)
        this.updateCoords = this.updateCoords.bind(this);
        this.updateModel = this.updateModel.bind(this);
        let xScale = scaleLinear().domain([xMin, xMax]).range([0, props.width]);
        let xScale_inverse = scaleLinear().domain([0, props.width]).range([xMin, xMax]);

        let yScale = scaleLinear().domain([1.1, -0.1]).range([0, props.height]);
        let yScale_inverse = scaleLinear().domain([0, props.height]).range([1.1, -0.1]);

        this.state = {points, xMin, xMax, xScale, xScale_inverse, yScale, yScale_inverse}


    }

    handleXlimMinChange(evt) {
        let xMin = evt.target.value;

        let xScale = scaleLinear().domain([xMin, this.state.xMax]).range([0, this.props.width]);
        let xScale_inverse = scaleLinear().domain([0, this.props.width]).range([xMin, this.state.xMax]);

        this.setState({xScale, xScale_inverse, xMin})
    }

    handleXlimMaxChange(evt) {
        let xMax = evt.target.value;

        let xScale = scaleLinear().domain([this.state.xMin, xMax]).range([0, this.props.width]);
        let xScale_inverse = scaleLinear().domain([0, this.props.width]).range([this.state.xMin, xMax]);

        this.setState({xScale, xScale_inverse, xMax})
    }

    updateCoords(id, x, y) {
        x = this.state.xScale_inverse(x);
        y = this.state.yScale_inverse(y);

        const {points} = this.state
        let pointUpdate = points.filter((point) => point.id === id).pop();

        let idx = points.findIndex((point) => point.id === id);

        let left = idx === 0 ? points[idx] : points[idx - 1];
        let right = idx === points.length - 1 ? points[idx] : points[idx + 1];

        pointUpdate.y = Math.max(0,Math.min(1,y));
        if (points.length === 1) {
            pointUpdate.x = x;
        } else if ((idx > 0) && (idx < points.length - 1)) {
            if ((x > left.x) && (x < right.x)) {
                pointUpdate.x = x;
            } else if (x >= right.x) {
                pointUpdate.x = right.x;
            } else if (x <= left.x) {
                pointUpdate.x = left.x;
            }
        } else if (idx === 0) {
            if (x >= right.x) {
                pointUpdate.x = right.x
            } else if (x <= this.state.xMin) {
                pointUpdate.x = this.state.xMin
            } else {
                pointUpdate.x = x;
            }
        } else if (idx === points.length - 1) {
            if (x <= left.x) {
                pointUpdate.x = left.x
            } else if (x >= this.state.xMax) {
                pointUpdate.x = this.state.xMax
            } else {
                pointUpdate.x = x;
            }
        }

        this.setState({points});

    }

    addPoint(x, y) {
        this.setState(prevState => {
            let updatePoints = [...prevState.points, {x: x, y: y, id: uuidv4()}];
            updatePoints = uniqWith(updatePoints.sort(compareX), isEqual);
            return ({
                points: updatePoints
            })

        })
    }

    deletePoint(id) {
        let currentPoints = this.state.points;
        remove(currentPoints, (ele) => {
            return ele.id === id
        });

        this.setState({points: currentPoints});
    }

    updateModel() {
        console.log("I AM IN update", this.props.model.name);
        this.props.updateModel(this.props.model.name, this.state.points)
    }

    render() {
        return (
            <Fragment>
                <section className="modal-card-body">
                    <h4 className="has-text-weight-bold has-text-white"><span
                        className="modeltitle">{this.props.model.name}</span></h4>
                    <div className="columns">
                        <div className="field column is-one-quarter is-offset-one-quarter">
                            <label className="label has-text-white">X-limit min</label>
                            <div className="control">
                                <input onChange={(evt) => this.handleXlimMinChange(evt)} value={this.state.xMin}
                                       className="input has-text-white" type="number"/>
                            </div>
                        </div>
                        <div className="field column is-one-quarter">
                            <label className="label has-text-white">X-limit max</label>
                            <div className="control">
                                <input value={this.state.xMax} onChange={(evt) => this.handleXlimMaxChange(evt)}
                                       className="input has-text-white" type="number"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <DesirabilityCanvas selectedModel={this.props.model.name} xScale={this.state.xScale} yScale={this.state.yScale}
                                            xScale_inverse={this.state.xScale_inverse}
                                            yScale_inverse={this.state.yScale_inverse} updateCoords={this.updateCoords}
                                            deletePoint={this.deletePoint} addPoint={this.addPoint}
                                            points={this.state.points} width={500} height={500}/>
                    </div>

                </section>
                <footer className="modal-card-foot">
                    <button onClick={() => this.updateModel()} className="button is-primary is-outlined">Save changes
                    </button>
                    <button onClick={() => this.props.hideModal()} className="button is-danger is-outlined">Cancel
                    </button>
                </footer>
            </Fragment>
        );
    }
}

export default DesirabilityEditor;