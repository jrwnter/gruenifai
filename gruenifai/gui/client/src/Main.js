import React, {setGlobal} from 'reactn';
import Marvin from './Marvin';
import ModelInput from './ModelInput';
import ModelControl from './ModelControl';
import classNames from 'classnames/bind';
import {remove} from 'lodash';
import {INITSTRUCTURE, MOLECULE} from './Constants';
import './gruenifai.scss';
import DesirabilityEditor from './DesirabilityEditor';
import history from './history';
import {v1 as uuidv1} from 'uuid';
import SubstructureDialog from "./SubstructureDialog";
import {modelValidation} from './Validation';
import {ATTRACTIVENESS_SCORE} from './Models';
import {getMinY, getMaxY} from './helper';
import {exampleResults} from "./ExampleResults";
import MoleculeSketcher from './MoleculeSketcher';

class Main extends React.PureComponent {
    constructor(props) {
        super(props)
        this.deleteModel = this.deleteModel.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleStructureChange = this.handleStructureChange.bind(this);
        this.updateDesirability = this.updateDesirability.bind(this);
        this.updateDistanceModelWithCurrentInputStructure = this.updateDistanceModelWithCurrentInputStructure.bind(this);

    }

    handleStructureChange(molecule) {
        this.setGlobal({molecule})
    }

    hideModal() {
        this.setGlobal({showModal: false, selectedModel: undefined})
    }

    deleteModel(model) {
        let currentModels = this.global.models;
        remove(currentModels, (existing) => {
            return existing.name === model.name
        });

        this.setGlobal({models: currentModels});

    }

    updateDesirability(name, points) {
        let models = this.global.models;
        const id = this.global.models.map((e) => e.name).indexOf(name);
        models[id].desirability = points;
        this.setGlobal({models});
        this.hideModal()
    }

    updateDistanceModelWithCurrentInputStructure(models) {
        const id = this.global.models.map((e) => e.name).indexOf("distance score");
        if (id !== -1) {
            models[id].additional_args = {query: this.global.molecule};
        }
        return models;
    }

    submitData() {
        const molfile = this.global.molecule;
        const fastMode = this.global.fastMode;
        let models = this.global.models;

        this.setGlobal({goodMolecules:[],badMolecules:[]});
        models = this.updateDistanceModelWithCurrentInputStructure(models);


        let errMsgs = modelValidation(models);
        if (errMsgs.length > 0) {
            this.setGlobal({errMsg: errMsgs})
            window.scrollTo(0, 0);
            return;
        }
        //add the user scoring model

        models = models.concat(ATTRACTIVENESS_SCORE)
        this.setGlobal({models});

        const postData = {
            user: 'nocwid',
            jobTitle: 'nothing set',
            queryMolecule: molfile,
            models: models,
            goodMolecules: [],
            badMolecules: [],
            fastMode: fastMode
        };

        
        this.setGlobal({results: [], session_id: null});
        history.push("/results");
        console.log('I WILL NOW SUBMIT THE LO JOB')
        fetch("/api/submit_LO_job"
            , {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(postData)
            }).then((res) => res.json()).then((res) => {
            res['query_stats']['run_id'] = 0
            res['stats']['run_id'] = 1
            let chartData = [res['query_stats'],res['stats']];
            let yMin = getMinY(chartData);
            let yMax = getMaxY(chartData);

            this.setGlobal({
                results: res['results'],
                session_id: res['session_id'],
                sorting: 'dscore',
                chartData,
                yMin,
                yMax
            })
        })
    }

    componentDidMount() {
        fetch('/api/available_models')
            .then((res) => res.json())
            .then((res) => {
                this.setGlobal({allModels: res});
                //this.setGlobal({models: res.slice(4,6)})
            })
    }

    render() {
        const modalClass = classNames({
            'modal': true,
            'is-active': this.global.showModal,
        });
        let modalDialog = null;
        if (this.global.selectedModel && this.global.selectedModel.name !== "substructure match") {
            modalDialog =
                <DesirabilityEditor key={uuidv1()} model={this.global.selectedModel}
                                    updateModel={this.updateDesirability}
                                    hideModal={this.hideModal} width="500" height="500"/>
        }
        if (this.global.selectedModel && (this.global.selectedModel.name === "substructure match")) {
            modalDialog =
                <SubstructureDialog key={uuidv1()} hideModal={this.hideModal} name={this.global.selectedModel.name}/>
        }

        if (this.global.selectedModel && (this.global.selectedModel.name === "substructure exclusion")) {
            modalDialog =
                <SubstructureDialog key={uuidv1()} name={this.global.selectedModel.name} hideModal={this.hideModal}/>
        }
        let modelDisplay = null;
        if (this.global.models.length !== 0) {
            modelDisplay =
                (<ul>
                    {this.global.models.map((model, index) => {
                        return <li key={uuidv1()} className='models'>
                            <ModelControl sideBar={false} modelIndex={index} deleteModel={this.deleteModel}
                                          model={model}/>
                        </li>
                    })}
                </ul>)
        } else {
            modelDisplay = <p className="is-size-4 is-grouped-center is-pulled-right"
                              style={{paddingTop: 20, paddingRight: "25%"}}><span className={'has-text-primary'}>nothing selected yet!</span>
            </p>
        }
        return (
            <div className="App">
                <section>
                    <div className="container" style={{marginTop: 100, marginBottom: 100}}>
                        <div className="columns">
                            <div className="column is-half is-centered has-text-primary">
                                <MoleculeSketcher structure={INITSTRUCTURE} id="sketch" className='marvinstyle'
                                        onStructureChange={this.handleStructureChange}/>
                                <div>
                                    <label className="checkbox">
                                        <input type="checkbox" checked={this.global.fastMode}
                                               onChange={(evt) => this.setGlobal({fastMode: !this.global.fastMode})}/>
                                        &nbsp;fast mode
                                    </label>
                                </div>
                                <div>
                                    <button onClick={() => this.submitData()}
                                            className="button is-large is-primary is-outlined"
                                            style={{marginTop: 20}}>
                                        start of optimization
                                    </button>
                                </div>
                            </div>

                            <div className="column is-half">
                                <ModelInput/>
                                <div id="models" className="has-text-left" style={{paddingTop: 10}}>
                                    {modelDisplay}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section>
                    <div className={modalClass}>
                        <div onClick={this.hideModal} className="modal-background"></div>
                        <div className="modal-card">
                            <button onClick={this.hideModal} className="modal-close is-large"
                                    aria-label="close"></button>
                            {modalDialog}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Main;
