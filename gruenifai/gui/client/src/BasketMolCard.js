import {useGlobal} from "reactn";
import {Cancel, Favourite, Cart} from 'react-ikonate';
import SVG from 'react-inlinesvg';
import history from './history';
import {remove} from 'lodash';
import React from "reactn";

const BasketMolCard = ({molecule}) => {
    console.log(molecule);
    const [basket,setBasket] = useGlobal('basket');

    const deleteFromBasket = (molecule) =>{
        let newBasket = basket;
        remove(newBasket, (existing) => {
            return existing.smiles === molecule.smiles
        });

        setBasket(newBasket);
    }
    return (

        <div className="card">
            <header className="card-header-title is-pulled-right">
                <a className="delete is-small" onClick={() => deleteFromBasket(molecule)} style={{marginTop:2, marginRight:2}}></a>
            </header>
            <div className={"card-content"}>
                <SVG src={`/api/depict_molecule/${encodeURIComponent(molecule.smiles)}/220`}></SVG>
            </div>
        </div>
    );
}
export default BasketMolCard;