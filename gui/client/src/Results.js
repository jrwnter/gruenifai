import React from "reactn"

import {Route, Link} from "react-router-dom"
import MoleculeCard from "./MoleculeCard";
import {scaleLinear} from 'd3-scale';
import {RotateSpinner} from "react-spinners-kit";
import {Controls, TrendingUp} from 'react-ikonate';
import ModelSideBar from './ModelSideBar';

import {
    Label, Area, AreaChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import classNames from "classnames/bind";
import DesirabilityEditor from "./Main";
import {v1 as uuidv1} from 'uuid';
import history from "./history";
import {modelValidation} from "./Validation";
import SubstructureDialog from "./SubstructureDialog";
import {ATTRACTIVENESS_SCORE} from "./Models";
import {orderBy} from 'lodash';
import {getMinY, getMaxY} from './helper';
import {Fragment} from "react";


class Results extends React.PureComponent {
    constructor(props) {
        super(props)
        this.hideModal = this.hideModal.bind(this);
        this.updateDesirability = this.updateDesirability.bind(this);
        this.continueLO = this.continueLO.bind(this);
        this.state = {ymin: 0, ymax: 1}
    }

    hideModal() {
        this.setGlobal({showModal: false, selectedModel: undefined})
    }

    updateDesirability(name, points) {
        let models = this.global.models;
        const id = this.global.models.map((e) => e.name).indexOf(name);
        models[id].desirability = points;
        this.setGlobal({models});
        this.hideModal()
    }

    updateAttractivenessScoreWithGoodAndBadMolecules(models) {
        const id = this.global.models.map((e) => e.name).indexOf(ATTRACTIVENESS_SCORE.name);
        if (id !== -1) {
            models[id].additional_args = {bad: this.global.badMolecules, good: this.global.goodMolecules};
        }
        return models;
    }

    sortMolecules(evt, criteria) {
        let results = this.global.results;
        results = orderBy(results, [criteria, 'dscore'], [criteria === 'dscore' ? 'desc' : 'asc', 'desc'])

        this.setGlobal(() => ({
            sorting: criteria,
            results
        }));

    }

    continueLO() {
        const session_id = this.global.session_id;

        let models = this.global.models;
        models = this.updateAttractivenessScoreWithGoodAndBadMolecules(models);
        let errMsgs = modelValidation(models);
        if (errMsgs.length > 0) {
            this.setGlobal({errMsg: errMsgs})
            window.scrollTo(0, 0);
            return
        }

        //

        const postData = {session_id: session_id, models: models};
        this.setGlobal({results: []});
        history.push("/results");
        fetch("/api/submit_LO_job"
            , {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(postData)
            }).then((res) => res.json()).then((res) => {
            let previousChartData = this.global.chartData;
            let newChartData = res['stats'];
            let run_id = previousChartData.slice(-1)[0]['run_id'] + 1;

            newChartData['run_id'] = run_id;
            let jointChartData = previousChartData.concat(newChartData);

            let yMin = getMinY(jointChartData);
            let yMax = getMaxY(jointChartData);
            let results = res['results'];
            this.setGlobal({results, chartData: jointChartData, sorting: 'dscore', yMin, yMax});
        })
    }

    render() {
        const colorScale = scaleLinear().domain([0, 0.5, 1]).range(['#fe59c2', '#FC8D0F', '#59fe95'])
        let display = null;
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
        if (this.global.results.length === 0) {
            display = (<div style={{paddingTop: "20%", paddingLeft: "45%"}}>
                <div>
                    <div className="is-danger">
                        <RotateSpinner size={200} color="#fe59c2"/>
                    </div>
                </div>
            </div>)

        } else {
            display = (
                <div>

                    <div>
                        <AreaChart
                            font={""}
                            width={1140}
                            height={400}
                            data={this.global.chartData}
                            margin={{
                                top: 20, right: 20, bottom: 20, left: 20,
                            }}
                        >
                            <XAxis stroke={"#59fe95"} strokeWidth={"2px"} dataKey="run_id">
                                <Label fill={"#59fe95"} value="Run ID" offset={0} position="bottom"/>

                            </XAxis>
                            <YAxis stroke={"#59fe95"} strokeWidth={"2px"} domain={[this.global.yMin, this.global.yMax]}>
                                <Label fill={"#59fe95"} value="D-Score" offset={0} angle={-90} position={"insideLeft"}/>
                            </YAxis>
                            <Area dataKey="scoreRange" stroke="#59fe95" strokeWidth={"2px"} fill="#59c2fe"/>
                        </AreaChart>
                    </div>
                    <div className={'columns is-vcentered'}>
                        <div className={'column is-two-thirds'}>
                            <div className="buttons" style={{marginTop: "10px", marginBottom: "10px"}}>
                                <a onClick={() => this.continueLO()}
                                   className="button  is-primary is-large is-outlined">
                                    continue optimization
                                </a>
                            </div>
                        </div>
                        <div className={'column has-text-primary is-one-third'}>
                            <div className="field">
                                <small>sort by:</small>
                                &nbsp;&nbsp;&nbsp;
                                <input className="is-checkradio is-small  is-success" id="sortByDScore" type="radio"
                                       name="sorting" checked={this.global.sorting === "dscore"}
                                       onChange={(evt) => this.sortMolecules(evt, 'dscore')}/>
                                       &nbsp;&nbsp;
                                <label htmlFor="sortByDScore">
                                    <small>D-Score</small>
                                </label>
                                &nbsp;&nbsp;&nbsp;
                                <input className="is-checkradio is-small  is-success" id="sortByStructure" type="radio"
                                       name="sorting" checked={this.global.sorting === "cluster_id"}
                                       onChange={(evt) => this.sortMolecules(evt, 'cluster_id')}/>
                                       &nbsp;&nbsp;
                                <label htmlFor="sortByStructure">
                                    <small>structure</small>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-multiline">
                        {this.global.results.map((res, idx, results) => {
                            let linebreak = null;
                            if (idx == 0 && this.global.sorting === "cluster_id") {
                                linebreak = (
                                    <Fragment>
                                        <small className={"has-text-primary"}
                                               style={{textDecoration: 'underline'}}>cluster {res.cluster_id}</small>
                                        <break/>
                                    </Fragment>
                                )
                            }
                            if (idx > 0 && this.global.sorting === 'cluster_id' && res.cluster_id !== results[idx - 1].cluster_id) {
                                linebreak = (
                                    <Fragment>
                                        <break/>
                                        <small className={"has-text-primary"}
                                               style={{textDecoration: 'underline'}}>cluster {res.cluster_id}</small>
                                        <break/>
                                    </Fragment>)
                            }
                            return (
                                <Fragment key={"frag_"+res.smiles}>
                                    {linebreak}
                                    <div className="column is-narrow">
                                        <MoleculeCard key={res.smiles} result={res} result_idx={idx} scale={colorScale}/>
                                    </div>
                                </Fragment>)
                        })
                        }
                    </div>

                    <div className="buttons is-centered">
                        <a onClick={() => this.continueLO()}
                           className="button  is-primary is-large is-outlined">
                            continue optimization
                        </a>
                    </div>
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
            )
        }
        return (
            <div>
                <ModelSideBar/>
                <div className="container" style={{paddingTop: 80}}>
                    {display}
                </div>
            </div>
        );
    }
}

export default Results;