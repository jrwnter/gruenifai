import React, {useGlobal} from 'reactn';
import ModelWeightSlider from "./ModelWeightSlider";
import {remove} from "lodash";
import {Controls} from 'react-ikonate';

const ModelControl = ({model, sideBar}) => {
    const [models, setModels] = useGlobal('models')
    const [showModal, setShowModal] = useGlobal('showModal');
    const [selectedModel, setSelectedModel] = useGlobal('selectedModel')
    const deleteModel = ()=> {
        remove(models, (check) => {
            return check.name === model.name
        });
        setModels(models);
    }

    const showModalDialog = () => {
        setSelectedModel(model);
        setShowModal(true);
    }


    return (
        <article className="message" style={{marginBottom: 20}}>

            <div className="message-body">
                {!sideBar &&
                <div className="is-pulled-right">
                    <a className="delete is-small" onClick={() => deleteModel(model)}
                       style={{marginTop: -10, marginRight: -10, color: 'green'}}></a>
                </div>

                }
                <div className="columns is-desktop is-vcentered">
                    <div className="column is-three-fifths has-text-primary">
                        <h1 className='has-text-weight-bold has-text-centered'><span
                            className='modeltitle'>&nbsp;{model.name}&nbsp;</span></h1>
                        <span className='has-text-justified'>{model.description}</span>

                    </div>
                    <div className="column is-two-fifths">
                        <div className="field is-grouped">
                            <p className="control"
                            >
                                <ModelWeightSlider model={model}/>
                            </p>
                            <p className="control">
                                <a onClick={() => showModalDialog()}
                                   className="button is-small is-primary is-outlined is-vcentered"
                                   style={{marginLeft: 10}}>
                                    <b> <Controls fontSize="2.5em" borderwidth={5} style={{paddingTop: 4}}/></b>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>

    );

}

export default ModelControl;