import {useGlobal} from "reactn";
import React from "reactn";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Main from "./Main";
import Results from "./Results";
import MoopNav from "./MoopNav";
import Particles from 'react-particles-js'
import MoleculeBasket from "./MoleculeBasket";
import ErrMsg from './ErrMsg';

import {particlesOptions} from './Settings';



function AppRouter() {
    const [errMsg, setErrMsg] = useGlobal('errMsg');
    let errMsgNotification = null;
    if(errMsg){
        errMsgNotification = <ErrMsg/>
    }
    return (
            <div>
                <MoopNav/>
                {errMsgNotification}
                <Particles className='particles' params={particlesOptions} />

                <Route path="/" exact component={Main}/>
                <Route path="/results/" component={Results}/>
                <Route path="/basket/" component={MoleculeBasket}/>

            </div>
    );
}

export default AppRouter;