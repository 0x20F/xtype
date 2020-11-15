import React, {Component} from 'react';
import axios from 'axios';

import Game from './Game.js';
import Background from 'components/general/Background';
import PauseMenu from 'components/menu/PauseMenu';
import StartMenu from 'components/menu/StartMenu';
import SettingsMenu from 'components/menu/SettingsMenu';
import WaveMenu from 'components/menu/WaveMenu';
import { events } from 'foundation/components/Emitter';



export default class App extends Component {
    constructor(props) {
        super(props);
        this.game = Game;

        this.state = {
            inMenu: true,

            paused: false,
            started: false,
            inSettings: false,
            intermission: false,
            
            playerName: '0x20F',
            wave: 1
        }

        this.waveData = [];
    }


    /**
     * Events need to be added and removed in
     * unison with the component being born and 
     * dying.
     */
    componentDidMount() { 
        document.addEventListener('keydown', this._handleKeyDown, false);

        events.on('enemyDeath', () => {
            console.log('enemy just died yooooo');
        });

        events.on('waveEnd', (data) => {
            this.waveData.push(data);

            this.handlePause();
            this.setState({ 
                intermission: true
            });
        });

        events.on('nextWave', this.nextWave);
    }
    componentWillUnmount() { document.removeEventListener('keydown', this._handleKeyDown, false); }


    /**
     * This is where the menu controls are defined.
     * 
     * @param {object} e Keydown event from javascript
     */
    _handleKeyDown = e => {
        switch (e.key) {
            case 'Escape':
                this.handlePause();
                break;
        }
    }


    /**
     * Pause handler that can be passed around to other menus
     */
    handlePause = () => {
        if (this.state.intermission) {
            return;
        }

        this.toggleMenu();
        // Pause the game here
        this.setState(old => {
            this.game.pause(!old.paused);

            return {
                paused: !old.paused
            }
        });
    }


    /**
     * Start the game keep track of states
     */
    handleStart = async () => {
        const { wave, playerName } = this.state;

        await this.game.start(playerName, this.emitter);
        this.game.nextWave(wave);
        
        this.toggleMenu();
        this.setState(old => {
            return {
                started: !old.started
            }
        });
    }


    /**
     * Keep track of the settings menu
     */
    handleSettings = (playerName) => {
        this.setState(old => {
            return {
                playerName: playerName || '',
                inSettings: !old.inSettings
            }
        });
    }


    toggleMenu = () => {
        this.setState(old => {
            return {
                inMenu: !old.inMenu
            }
        });
    }


    nextWave = () => {
        // Unpause the game and move to the next wave
        this.game.nextWave(this.state.wave);
        this.setState(old => { 
            return { 
                wave: old.wave + 1,
                intermission: false
            }; 
        });
        this.handlePause();
    }


    render() {
        const { inMenu, paused, started, inSettings, playerName, intermission } = this.state;

        let content;
        let background = <Background hidden={ !inMenu }/>;

        if (!started && !inSettings) {
            content = <StartMenu 
                startHandler={ this.handleStart } 
                settingsHandler={ this.handleSettings } 
                playerName={ playerName }/>;
        }

        if (paused) {
            content = <PauseMenu handler={ this.handlePause }/>;
        }

        if (inSettings) {
            content = <SettingsMenu handler={ this.handleSettings }/>;
        }

        if (intermission && paused) {
            content = <WaveMenu 
                waveData={ this.waveData }/>;
        }

        return (
            <>
                { content }
                { background }
            </>
        );
    }
}