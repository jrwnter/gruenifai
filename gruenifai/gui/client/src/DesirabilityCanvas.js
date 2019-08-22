import React, { Component } from 'react';
import { uid } from 'react-uid';
import sizeMe from 'react-sizeme';
import { Axis, axisPropsFromTickScale, LEFT, BOTTOM, TOP, RIGHT } from 'react-d3-axis';
import DesirabilityNode from './DesirablilityNode';
import {MARGIN} from './Constants';

class DesirabilityCanvas extends Component {
    constructor(props){
        super(props)
        this.addPoint = this.addPoint.bind(this);
    }
    addPoint(evt){
        const svg = document.getElementById("desirability_canvas");
        const dim = svg.getBoundingClientRect();
        let x = evt.clientX - dim.left - (MARGIN.right+MARGIN.left)/2;
        let y = evt.clientY - dim.top - (MARGIN.top + MARGIN.bottom)/2;
        x = this.props.xScale_inverse(x)
        y = this.props.yScale_inverse(y)
        this.props.addPoint(x,y)
    }
    render() {

        const width = this.props.width - MARGIN.left - MARGIN.right;
        const height = this.props.height - MARGIN.top - MARGIN.bottom;
        return (
            <svg className='noselect'
                id="desirability_canvas"
                width={width + MARGIN.left + MARGIN.right}
                height={height+ MARGIN.top + MARGIN.bottom}
                onDoubleClick={(evt)=>{this.addPoint(evt)}}
            >

                <g transform={"translate(" + MARGIN.left + "," + MARGIN.top + ")"}>
                    <g>
                    {this.props.points.map((ele, idx, array) => {
                        let line = [];
                        let x_scaled = this.props.xScale(ele.x);
                        let y_scaled = this.props.yScale(ele.y);
                        if (idx === 0) {
                            line = [...line, <line key={uid(ele) + 1} x1="0" y1={y_scaled} x2={x_scaled} y2={y_scaled} className="line" strokeWidth="6" />];
                        }
                        if (idx === this.props.points.length - 1) {
                            line = [...line, <line key={uid(ele) + 2} x1={x_scaled} y1={y_scaled} x2={width} y2={y_scaled} className="line" strokeWidth="6" />];
                        }
                        if (idx < this.props.points.length - 1) {
                            let x_scaled_next = this.props.xScale(array[idx + 1].x);
                            let y_scaled_next = this.props.yScale(array[idx + 1].y);

                            line = [...line, <line key={uid(ele) + 3} x1={x_scaled} y1={y_scaled} x2={x_scaled_next} y2={y_scaled_next} className="line" strokeWidth="6" />];
                        }
                        return line;
                    })}
                    </g>
                {this.props.points.map((ele) => {
                    let x_scaled = this.props.xScale(ele.x);
                    let y_scaled = this.props.yScale(ele.y);
                    return <DesirabilityNode deletePoint={this.props.deletePoint} updateCoords={this.props.updateCoords} key={ele.id} id={ele.id} x={x_scaled} y={y_scaled} />
                })}
                <Axis {...axisPropsFromTickScale(this.props.xScale, 10)}  style={{ orient: BOTTOM, strokeColor: "#59fe95", tickFont: "Source Code Pro"}}/>
                <Axis {...axisPropsFromTickScale(this.props.yScale, 10)}  style={{ orient: RIGHT, strokeColor: "#59fe95", tickFont: "Source Code Pro" }} />

                </g>
                <g>
                    <text x={220} y={15} style={{fill:'white'}} >{this.props.selectedModel}</text>
                    <text x={0} y={0} style={{fill:'white'}} transform={"translate(15,300)rotate(-90)"}>desirability</text>
                </g>
            </svg>
        );
    }
}   

export default sizeMe()(DesirabilityCanvas);
