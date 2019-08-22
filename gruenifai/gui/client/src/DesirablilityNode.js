import React, { Component } from 'react';
import {MARGIN} from './Constants';

class DesirabilityNode extends Component {
    constructor(props){
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    handleMouseDown = (e) => {
      this.coords = {
        x: e.pageX,
        y: e.pageY
      }
      document.addEventListener('mousemove', this.handleMouseMove);
    };
    
    handleMouseUp = () => { 
      document.removeEventListener('mousemove', this.handleMouseMove);
      this.coords = {};
    };
    
    handleMouseMove = (e) => {
        const svg = document.getElementById("desirability_canvas");
        const dim = svg.getBoundingClientRect();
        const x = e.clientX - dim.left - (MARGIN.right + MARGIN.left)/2;;
        const y = e.clientY - dim.top - (MARGIN.top + MARGIN.bottom)/2;;
        this.props.updateCoords(this.props.id, x, y);
    };
    deletePoint(id,evt){
      this.props.deletePoint(id);
      evt.stopPropagation();
    }
    render() {
      const { x, y, id, deletePoint } = this.props;
      
      return (
        <circle
          cx={x}
          cy={y}
          r={8}
          className='point' strokeWidth="0"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onDoubleClick={(evt)=>this.deletePoint(id, evt)}
        />
      )
    }
  }

export default DesirabilityNode;
