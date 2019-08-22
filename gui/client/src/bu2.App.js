import React, { Component } from 'react';
import DesirabilityEditor from './DesirabilityEditor';

import './gruenifai.scss';
import 'bulma/css/bulma.css'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render() {
        return (
        <div className="container">
            <DesirabilityEditor width="500" height="500" />
        </div>
        );
    }
}

export default App;