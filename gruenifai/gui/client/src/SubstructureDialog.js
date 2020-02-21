import React, {Component} from 'reactn';
import {Fragment} from 'react';
import {INITSTRUCTURE} from "./Constants";
import MoleculeSketcher from './MoleculeSketcher';


class SubstructureDialog extends Component {
    constructor(props) {
        super(props)
        console.log('reinitializes')
        this.updateSubstructure = this.updateSubstructure.bind(this);
        this.saveSubstructure = this.saveSubstructure.bind(this);
        this.state = {substructure:this.setInitStructure()}
    }
    setInitStructure() {
        let models = this.global.models;
        const id = this.global.models.map((e) => e.name).indexOf(this.props.name);
        return models[id].additional_args.query
    }

    updateSubstructure(substructure) {
        this.setState({substructure});
    }
    saveSubstructure(){
        let models = this.global.models;
        const id = this.global.models.map((e) => e.name).indexOf(this.props.name);
        models[id].additional_args.query = this.state.substructure;
        this.setGlobal({models});
        this.hideSubstructureDialog();
    }
    hideSubstructureDialog(){
        this.setGlobal({showModal: false, selectedModel: undefined})
    }
    render() {
        return (
            <Fragment>
                <section className="modal-card-body">
                    <h4 className="has-text-weight-bold has-text-white"><span
                        className="modeltitle">{this.props.name}</span></h4>
                    <div>

                        <MoleculeSketcher className='marvinstylessdialog' structure={INITSTRUCTURE} id={'substructure'} 
                                        onStructureChange={this.updateSubstructure}/>
                    </div>

                </section>
                <footer className="modal-card-foot">
                    <button onClick={()=>this.saveSubstructure()} className="button is-primary is-outlined">Save changes
                    </button>
                    <button onClick={()=>this.hideSubstructureDialog()} className="button is-danger is-outlined">Cancel
                    </button>
                </footer>
            </Fragment>
        );
    }
}

export default SubstructureDialog;