import React, {Component} from 'react';

import Game from './Game.js';
import Background from 'components/general/Background';
import PauseMenu from 'components/menu/PauseMenu';
import StartMenu from 'components/menu/StartMenu';
import SettingsMenu from 'components/menu/SettingsMenu';
import WaveMenu from 'components/menu/WaveMenu';
import { events } from 'foundation/components/Emitter';
import { get, set } from 'foundation/components/LocalStorage';



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

            playerName: get('playerName') || '0x20F',
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

        events.on('nextWave', this.nextWave);
        events.on('waveEnd', (data) => {
            this.waveData.push(data);

            this.handlePause();
            this.setState({ 
                intermission: true
            });
        });

        /**
         * Settings events
         */
        events.on('settingsOpened', () => this.setState({ inSettings: true }));
        events.on('settingsSaved', playerName => {
            this.setState({ 
                playerName,
                inSettings: false
            });

            set('playerName', playerName);
        });

        /**
         * Game events
         */
        events.on('gameStarted', async () => {
            const { wave, playerName } = this.state;

            await this.game.start(playerName, this.emitter);
            this.game.nextWave(wave);
            
            this.toggleMenu();
            this.setState(old => {
                return {
                    started: !old.started
                }
            });
        });

        /**
         * Pause events
         */
        events.on('unpause', this.handlePause);
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

        return (
            <>
                { !started && !inSettings &&    <StartMenu playerName={ playerName }/> }
                { paused && !intermission &&    <PauseMenu/> }
                { inSettings &&                 <SettingsMenu playerName={ playerName }/> }
                { intermission && paused &&     <WaveMenu waveData={ this.waveData }/> }
                
                <Background hidden={ !inMenu }/>
            </>
        );
    }
}