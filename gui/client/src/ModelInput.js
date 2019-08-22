import React, {Component} from 'reactn';
import Autocomplete from 'react-autocomplete';
import {includes} from "lodash";
import {v1 as uuidv1} from 'uuid';


class ModelInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.addModel = this.addModel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleSubmit = () => {
        let check = this.global.allModels.map((ele)=>ele.name).indexOf(this.state.value)!==-1;

        if (check) {
            this.addModel(this.state.value);
            this.setState((state) => {
                    return {value: ''}
                }
            )
        }
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    addModel(modelTitle) {
        let filteredModel = this.global.allModels.filter((model) => model.name.toLocaleLowerCase() === modelTitle.toLocaleLowerCase())[0];
        if (!includes(this.global.models,filteredModel)) {

            this.setGlobal(previousState => ({
                models: [filteredModel, ...previousState.models]
            }));
        }
        console.log(this.global.models);
    }

    render() {
        return (
            <div className="field has-addons ">
                <div className="control is-expanded">
                    <Autocomplete
                        getItemValue={(item) => item.name}
                        items={this.global.allModels}
                        menuStyle={{
                            borderRadius: '3px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                            background: 'green',
                            padding: '2px 0',
                            fontSize: '100%',
                            color: 'white',
                            position: 'fixed',
                            overflow: 'auto',
                            maxHeight: '50%',
                            zIndex: 20000
                        }}
                        shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}

                        autoHighlight={true}
                        renderItem={(item, isHighlighted) =>
                            <div key={uuidv1()} style={{background: isHighlighted ? '#59fe95' : 'black'}}>
                                {item.name}
                            </div>
                        }
                        inputProps={{
                            className: 'input has-text-primary is-fullwidth is-expanded',
                            onKeyDown: this.handleKeyDown,
                            value: this.state.value,
                        }}
                        wrapperStyle={{}}
                        selectOnBlur={true}
                        value={this.state.value}
                        onChange={(e) => this.setState({value: e.target.value})}
                        onSelect={(value) => {
                            this.setState({value})
                        }}
                    />

                </div>
                <div className="control">
                    <a className="button is-primary is-outlined" onClick={this.handleSubmit}>
                        add
                    </a>
                </div>
            </div>
        );
    }
}

export default ModelInput;

