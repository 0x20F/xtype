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
                
                <Button hint='P' text='Singleplayer' onClick={ this.props.startHandler }/>
                <Button disabled={true} hint='M' text='Multiplayer' onClick={ () => console.log('Multiplayer is WIP')}/>
                
                <div className='spacer'></div>
                
                <Button mini={true} hint='S' text='Settings' onClick={ this.props.settingsHandler }/>
                <Button disabled={true} mini={true} hint='L' text='Leaderboard' onClick={ () => console.log('Leaderboard is WIP') }/>
            </div>
        );
    }
}


export default StartMenu;