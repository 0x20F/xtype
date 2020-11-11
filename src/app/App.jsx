import React, {Component} from 'react';
import axios from 'axios';

import Game from './Game.js';
import PauseMenu from 'components/menu/PauseMenu';
import StartMenu from 'components/menu/StartMenu';
import SettingsMenu from 'components/menu/SettingsMenu';
import HUD from 'components/menu/HUD';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.game = Game;
        this.words = null;


        this.state = {
            paused: false,
            started: false,
            inSettings: false,
            playerName: '0x20F',
            wave: this.game.getCurrentWave()
        }

        let fn = () => {
            setTimeout(() => {
                if (this.state.wave !== this.game.getCurrentWave()) {

                    this.setState(() => {
                        return {
                            wave: this.game.getCurrentWave()
                        }
                    });
                }

                fn();
            }, 50);
        }

        fn();

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
    componentDidMount() { document.addEventListener('keydown', this._handleKeyDown, false); }
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

        this.setState(old => {
            this.game.start(this.words, old.playerName);

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


    render() {
        const { paused, started, inSettings, playerName } = this.state;

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

        if (started && !paused) {
            content = <HUD wave={ this.state.wave }/>;
        }

        if (inSettings) {
            content = <SettingsMenu handler={ this.handleSettings }/>;
        }

        return (
            <>
                { content }
            </>
        );
    }
}