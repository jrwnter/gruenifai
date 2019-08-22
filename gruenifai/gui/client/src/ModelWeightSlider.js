import {Fragment, useState} from 'react';
import React, {useGlobal} from 'reactn';

const ModelWeightSlider = ({model}) => {
    const [models] = useGlobal('models')

    const [value, setValue] = useState(model.weight);

    const handleChange = (evt) => {
        const newValue = parseInt(evt.target.value);
        setValue(newValue);
        model.weight = newValue;
    }

    return (
        <Fragment>
            <input
                className="slider is-fullwidth is-circle"
                step={1}
                min={0}
                max={100}
                value={model.weight}
                onChange={(evt) => handleChange(evt)}
                type="range"/>
        </Fragment>
    );
}


export default ModelWeightSlider;
