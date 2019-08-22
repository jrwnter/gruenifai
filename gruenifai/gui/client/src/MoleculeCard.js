import React, {useGlobal} from 'reactn';
import {useState} from 'react';
import {Cancel, Favourite, Cart} from 'react-ikonate';
import SVG from 'react-inlinesvg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {v1 as uuidv1} from 'uuid';

import {faHeart as fasHeart} from '@fortawesome/fontawesome-free-solid'
import {faHeart as farHeart} from '@fortawesome/fontawesome-free-regular'
import {faBan as farBan} from '@fortawesome/fontawesome-free-solid'
import {faCircle as fasBan} from '@fortawesome/fontawesome-free-solid'

import classNames from "classnames/bind";
import {ATTRACTIVENESS_SCORE} from "./Models";
import {remove} from "lodash";

const MoleculeCard = ({result, result_idx, scale}) => {
    const [results, setResults] = useGlobal('results');
    const [basket, setBasket] = useGlobal('basket');
    const [badMolecules, setBadMolecules] = useGlobal('badMolecules');
    const [goodMolecules, setGoodMolecules] = useGlobal('goodMolecules');
    const [models, setModels] = useGlobal('models');
    console.log("result_idx", result_idx, "dscore", result.dscore, "cluster_id", result.cluster_id)
    const considerChemicalAttractiveness = () => {
        if (goodMolecules.length > 0 || badMolecules.length > 0) {
            let ca = models.filter((model) => model.name === ATTRACTIVENESS_SCORE.name);
            if (ca.length === 0) {
                setModels(models.concat(ATTRACTIVENESS_SCORE))
            }
        } else {
            remove(models, (check) => {
                return check.name === ATTRACTIVENESS_SCORE.name
            });
            setModels(models);
        }
    }

    const toggleBuyMolecule = () => {
        let allResults = results;
        allResults[result_idx].isinbasket = !allResults[result_idx].isinbasket;
        setResults(allResults);
        let newBasket = []
        if (result.isinbasket) {
            newBasket = basket.concat(result)
        } else {
            newBasket = basket.filter((molecule) => molecule.uuid !== result.uuid)
        }
        setBasket(newBasket);
    }
    const toggleMolBad = () => {
        let allResults = results;
        allResults[result_idx].isbad = !allResults[result_idx].isbad;
        let newBadMolecules = [];
        if (result.isbad) {
            newBadMolecules = badMolecules.concat(result.smiles);
            allResults[result_idx].isgood = false;
        } else {
            newBadMolecules = badMolecules.filter((ele) => ele !== result.smiles);
        }
        setBadMolecules(newBadMolecules, () => considerChemicalAttractiveness())
    }

    const toggleMolGood = () => {
        let allResults = results;
        allResults[result_idx].isgood = !allResults[result_idx].isgood;

        let newGoodMolecules = [];
        if (result.isgood) {
            newGoodMolecules = goodMolecules.concat(result.smiles);
            allResults[result_idx].isbad = false;
        } else {
            newGoodMolecules = goodMolecules.filter((ele) => ele !== result.smiles);
        }
        setGoodMolecules(newGoodMolecules, ()=> considerChemicalAttractiveness())
    }
    let basketClass = classNames({'#707070': result.isinbasket, '#1a1a1a': !result.isinbasket});
    return (
        <div className="card" style={{width: 220}}>
            <div className="card-header-title" style={{marginBottom: -30, zScore: 100}}>
                    <FontAwesomeIcon icon={fasBan} className="icon is-small" style={{color: scale(result.dscore)}} />

            </div>
            <div className={'flip-card'}>
                <div className="card-content flip-card-inner">
                    <div className={'flip-card-front'}>
                        <SVG
                            src={`/api/depict_molecule/${encodeURIComponent(result.smiles)}/220`}>
                        </SVG>
                    </div>
                    <div className={'flip-card-back'}>

                        <table className={'table'} style={{width: '100%'}}>
                            <thead>
                            <tr>
                                <th>model</th>
                                <th>score</th>
                                <th>des.</th>
                            </tr>

                            </thead>
                            <tbody>
                            {result.scores.map((score) => {
                                return (<tr key={uuidv1()}>
                                    <td>{score.name}</td>
                                    <td>{score.unscaled.toFixed(2)}</td>
                                    <td><FontAwesomeIcon icon={fasBan} style={{color: scale(score.desirability)}} /></td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <footer className="card-footer">
                <p className="card-footer-item molbuy">
                    <a onClick={() => toggleBuyMolecule()}>
                        <Cart fill={basketClass} className={basketClass} fontSize="2.8em" borderwidth={5}
                              style={{paddingTop: 4}}/>
                    </a>
                </p>
                <p className="card-footer-item molbad">
                    <a onClick={(evt) => toggleMolBad(result.smiles)} className="is-size-3">
                        <FontAwesomeIcon icon={result.isbad ? fasBan : farBan}/>
                    </a>
                </p>
                <p className="card-footer-item molgreat">
                    <a onClick={(evt) => toggleMolGood(result.smiles)} className="is-size-3">
                        <FontAwesomeIcon icon={result.isgood ? fasHeart : farHeart}/>
                    </a>
                </p>

            </footer>
        </div>

    )
        ;
}

export default MoleculeCard;

