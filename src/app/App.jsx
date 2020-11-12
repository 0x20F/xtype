import React, {Component} from 'react';
import axios from 'axios';

import Game from './Game.js';
import Emitter from 'foundation/components/Emitter';
import PauseMenu from 'components/menu/PauseMenu';
import StartMenu from 'components/menu/StartMenu';
import SettingsMenu from 'components/menu/SettingsMenu';
import WaveMenu from 'components/menu/WaveMenu';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.emitter = new Emitter();
        this.game = Game;
        this.words = null;


        this.state = {
            paused: false,
            started: false,
            inSettings: false,
            intermission: false,
            playerName: '0x20F',
            wave: 1
        }

        this.shotsFired = 0;
        this.shotsMissed = 0;

        axios.get('/data/test.txt')
            .then(response => response.data)
            .then(words => {
                this.words = words;
            });
    }


    /**
     * Events need to be added and removed in
     * unison with the component being born and 
     * dying.
     */
    componentDidMount() { 
        document.addEventListener('keydown', this._handleKeyDown, false);

        this.emitter.on('enemyDeath', () => {
            console.log('enemy just died yooooo');
        });

        this.emitter.on('shotFired', missed => {
            console.log('Shot ', missed ? 'missed' : 'hit');
            if (missed) {
                this.shotsMissed++;
            }

            this.shotsFired++;
        });

        this.emitter.on('waveEnd', () => {
            this.handlePause();
            this.setState({ 
                intermission: true
            });
        });

        this.emitter.on('nextWave', this.nextWave);
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
    handleStart = () => {
        if (!this.words) {
            return;
        }

        const { wave, playerName } = this.state;

        this.game.start(this.words, playerName, this.emitter);
        this.game.nextWave(wave);

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
        const { paused, started, inSettings, playerName, intermission } = this.state;

        let content = <div></div>;

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
                wave={ this.state.wave }
                shotsFired={ this.shotsFired }
                shotsMissed={ this.shotsMissed }
                emitter={ this.emitter }/>;
        }

        return (
            <>
                { content }
            </>
        );
    }
}