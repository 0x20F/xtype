import React, { Component } from 'react';

import Button from 'components/general/Button';



class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { playerName } = this.props;

        return (
            <div className='startMenu menu'>
                <header>
                    <h1 className='startHeader header'>XTYPE</h1>
                    <div className='username'>Playing as { playerName }</div>
                </header>
                
                <Button hint='P' text='Play' onClick={ this.props.startHandler }/>
                <Button hint='S' text='Settings' onClick={ this.props.settingsHandler }/>
            </div>
        );
    }
}


export default StartMenu;