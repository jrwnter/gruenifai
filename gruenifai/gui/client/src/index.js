import React, {setGlobal} from 'reactn';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AppRouter from './AppRouter';
import {Router} from "react-router";
import history from './history';
import {exampleResults} from "./ExampleResults";
import {MOLECULE} from "./Constants";

setGlobal({
    session_id: null,
    selectedModel: undefined,
    showModal: false,
    allModels: [],
    models: [],
    molecule: MOLECULE,
    results: [],
    basket: [],
    badMolecules: [],
    goodMolecules: [],
    errMsg: [],
    chartData: [],
    fastMode: false,
    sorting: 'dscore',
    yMin: 0,
    yMax: 1
});

ReactDOM.render(<Router history={history}>
    <AppRouter/>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
