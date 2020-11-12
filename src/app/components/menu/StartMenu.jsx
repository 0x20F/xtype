import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';



class StartMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    render() {
        const { playerName } = this.props;

        return this.smoothly(
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