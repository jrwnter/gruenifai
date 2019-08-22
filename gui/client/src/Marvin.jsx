/* global MarvinJSUtil */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Marvin extends Component {

    componentDidMount() {
        this.promise = MarvinJSUtil.getEditor(this.props.id);
        this.promise.then(sketch => this.init(sketch));
    }

    init(sketch) {
        const { displaySettings, services, onStructureChange, structure } = this.props;
        if (services) {
            sketch.setServices(services);
        }
        sketch.setDisplaySettings(displaySettings);

        if (structure) {
            sketch.importStructure(null, structure);
            sketch.clearUndoStack();
        }

        if (onStructureChange) {
            sketch.on('molchange', () => sketch.exportStructure('mol').then(mrv => onStructureChange(mrv)));
        }
    }

    componentDidUpdate(prevProps) {
        const { structure } = this.props;
        if (structure !== prevProps.structure) {
            this.setSketchContent(structure);
        }
    }

    setSketchContent = source => {
        this.promise.then(sketch => {
            sketch.importStructure(null, source);
            sketch.clearUndoStack();
        });
    };

    render() {
        const { id, url, displaySettings, services, structure, onStructureChange, ...other } = this.props;
        return (<iframe id={id} title={id} frameBorder="0" scrolling="no" src={url} {...other} />);
    }
}

Marvin.defaultProps = {
    url: './marvinjs/editor.html',
};

Marvin.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    displaySettings: PropTypes.object,
    services: PropTypes.object,
    structure: PropTypes.string,
    onStructureChange: PropTypes.func,
};
