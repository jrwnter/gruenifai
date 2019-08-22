import React from "reactn"
import {slide as Menu} from 'react-burger-menu'
import ModelControl from './ModelControl'
import {v4 as uuidv4} from "uuid";

class ModelSideBar extends React.Component {
    render() {
        return (
            <Menu isOpen={false} width={700} noOverlay>
                <div>
                    <div id="models" className="has-text-left" style={{paddingTop: 5}}>
                        <ul>
                            {this.global.models.map((model, index) => {
                                return <li key={uuidv4()} className='models'>
                                    <ModelControl sideBar={true} modelIndex={index} deleteModel={this.deleteModel}
                                                  model={model}/>
                                </li>
                            })}
                        </ul>
                    </div>

                </div>
            </Menu>
        );
    }
}

export default ModelSideBar;
