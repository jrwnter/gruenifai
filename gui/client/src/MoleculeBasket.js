import {useGlobal} from "reactn";
import {Cancel, Favourite, Cart} from 'react-ikonate';
import SVG from 'react-inlinesvg';
import history from './history';

import React from "reactn";
import BasketMolCard from "./BasketMolCard";

const MoleculeBasket = () => {
    const [basket, setBasket] = useGlobal('basket');
    const removeSelected = () => {
        setBasket([]);
    }
    const exportBasket = () => {
        console.log('start exporting')
        fetch('/api/export_selected_molecules', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(basket)
        })
            .then((response) => response.blob())
            .then((blob) => {
                let url = URL.createObjectURL(blob);
                let newWindow = window.open(url);
                newWindow.location = url;
            });
    }
    return (

        <div className="container" style={{paddingTop: 100}}>
            <section>
                <a onClick={() => history.push('/results')} className="button basket is-primary is-outlined">back to
                    results</a>
                <a onClick={() => exportBasket()} className="button basket is-primary  is-outlined">export molecules</a>
            </section>
            <section className={'is-clearfix'}>
                <div className={'columns is-multiline'} style={{paddingTop: 20}}>
                    {basket.map((molecule) => {
                        return (<div className={'column is-narrow'}><BasketMolCard molecule={molecule}/></div>)
                    })}
                </div>
            </section>
        </div>
    );
}
export default MoleculeBasket;