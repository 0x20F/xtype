import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';



class StartMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }

    startGame = () => {
        events.emit('gameStarted');
    }


    openSettings = () => {
        events.emit('settingsOpened');
    }


    openLeaderboard = () => {
        events.emit('leaderboardOpened');
    }


    render() {
        const { playerName, playerSignature } = this.props;

        return this.smoothly(
            <div className='startMenu menu'>
                <header>
                    <h1 className='startHeader header'>XTYPE</h1>
                    <div className='username'>Playing as { playerName }</div>
                </header>

                <Button
                    hint='P'
                    text='Singleplayer'
                    onClick={ this.startGame }
                    disabled={ (!playerName || !playerSignature) && 'Update settings to play' }/>

                <Button
                    disabled='multiplayer is in development'
                    hint='M'
                    text='Multiplayer'
                    onClick={ () => console.log('Multiplayer is WIP')}/>

                <div className='spacer'/>

                <Button mini={true} hint='S' text='Settings' onClick={ this.openSettings }/>
                <Button mini={true} hint='L' text='Leaderboard' onClick={ this.openLeaderboard }/>
            </div>
        );
    }
}


export default StartMenu;
