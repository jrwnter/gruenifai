import React from 'react';

import Knob from 'react-canvas-knob';

class ModelKnob extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: this.props.value};

    }
  
    handleChange = (newValue) => {
      this.setState({value: newValue});
      this.props.handleChange(this.props.modelId, newValue);
    };
  
    render() {
      return (
        <Knob
          width={this.props.width}
          height={this.props.height}
          value={this.state.value}
          onChange={this.handleChange}
          fgColor="#555"
        />
      );
    }
  }

  export default ModelKnob;