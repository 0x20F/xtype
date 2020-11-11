import React, { Component } from 'react';

import Button from 'components/general/Button';



class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='startMenu menu'>
                <h1 className='startHeader header'>XTYPE</h1>
                
                <Button hint='P' text='Play' onClick={ this.props.startHandler }/>
                <Button hint='S' text='Settings' onClick={ () => {} }/>
            </div>
        );
    }
}


export default StartMenu;