import React from 'react';

const moopbrandstyle = {
    fontFamily: 'Lobster,cursive',
    fontSize: '2em'
}

function MoopFooter() {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                    <strong style={moopbrandstyle}>moop</strong> by <a className='is-link'>moop.ai</a>.
                </p>
            </div>
        </footer>
    );
}

export default MoopFooter;



