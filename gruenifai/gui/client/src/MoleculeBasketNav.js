import {useGlobal} from "reactn";
import {Cancel, Favourite, Cart} from 'react-ikonate';
import history from './history';

import React from "reactn";

const MoleculeBasketNav = () => {
    const [basket] = useGlobal('basket');
    const checkBasket = () => {
        history.push('/basket');
    }
    return (
        <div className={"molecule-basket"} data-count={basket.length}>
            <a onClick={()=>checkBasket()}><Cart  fontSize="2.5em" borderwidth={5} style={{paddingTop: 4}} /></a>
        </div>
    );
}
export default MoleculeBasketNav;