import React from 'react';
import {Link} from "react-router-dom";
import MoleculeBasketNav from "./MoleculeBasketNav";


function MoopNav() {
    return (
        <nav className="navbar is-black is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand gruenifaibrand">
                <Link to="/" className="navbar-item glow has-text-primary" >
                    grünif.ai
                </Link>
            </div>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
            <div className="navbar-end">
                <div className="navbar-item">
                    <MoleculeBasketNav/>
                </div>
            </div>
        </nav>
    );
}


export default MoopNav;

