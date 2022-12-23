import React, {Component} from 'react';

import Game from './Game.js';
import Background from 'components/general/Background';
import PauseMenu from 'components/menu/PauseMenu';
import StartMenu from 'components/menu/StartMenu';
import SettingsMenu from 'components/menu/SettingsMenu';
import LeaderboardMenu from 'components/menu/LeaderboardMenu';
import WaveMenu from 'components/menu/WaveMenu';
import GameOverMenu from 'components/menu/GameOverMenu';
import { events } from 'foundation/components/Emitter';
import { storage } from 'foundation/components/LocalStorage';
import { calculateAccuracy, calculateWpm } from 'foundation/math/PlayerData';
import { abbreviateNumber } from 'support/Helpers';
import { addEntry } from 'foundation/Leaderboard';




export default class App extends Component {
    constructor(props) {
        super(props);
        this.game = Game;

        this.state = {
            inMenu: true,

            paused: false,
            started: false,
            inSettings: false,
            inLeaderboard: false,
            intermission: false,
            gameOver: false,

            playerName: storage.get('playerName') || '0x20F',
            playerSignature: storage.get('playerSignature'),

            wave: 1
        }

        this.score = 0;
        this.waveData = [];
    }


    /**
     * Events need to be added and removed in
     * unison with the component being born and
     * dying.
     */
    componentDidMount() {
        document.addEventListener('keydown', this._handleKeyDown, false);

        events.on('shotFired', (missed) => {
            if (this.score >= 10 && missed) {
                this.score -= 10;
            } else {
                this.score += 1;
            }
        });

        events.on('enemyDeath', () => {
            this.score += 100;
        });

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
        events.on('settingsSaved', (playerName, playerSignature) => {
            this.setState({
                playerName,
                playerSignature,
                inSettings: false
            });

            storage.set('playerName', playerName);
            storage.set('playerSignature', playerSignature);
        });

        /**
         * Leaderboard events
         */
        events.on('leaderboardOpened', () => this.setState({ inLeaderboard: true }));
        events.on('leaderboardClosed', () => this.setState({ inLeaderboard: false }));

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

        /**
         * Game over events
         */
        events.on('gameOver', lastWave => {
            this.waveData.push(lastWave);
            let totalWaves = this.waveData.length;

            let accuracy = this.waveData.map(w => calculateAccuracy(w)).reduce((a, b) => a + b, 0);
            let wpm = this.waveData.map(w => calculateWpm(w)).reduce((a, b) => a + b, 0);
            let score = this.score;
            const playerData = {
                name: this.state.playerName,
                signature: this.state.playerSignature
            };

            addEntry(
                playerData,
                (accuracy / totalWaves).toFixed(2),
                (wpm / totalWaves).toFixed(2),
                abbreviateNumber(score),
                totalWaves
            ).then(() => {
                this.setState({
                    gameOver: true,
                    inMenu: true
                });
            });
        });

        /**
         * Restart
         */
        events.on('restartGame', () => {
            // Reset everything, ugly but oh well
            this.setState({
                started: false,
                inMenu: true,
                paused: false,
                inSettings: false,
                intermission: false,
                gameOver: false,
                inLeaderboard: false,

                wave: 1
            });

            this.waveData = [];
            this.score = 0;

            Game.reset();
        })
    }
    componentWillUnmount() { document.removeEventListener('keydown', this._handleKeyDown, false); }


    /**
     * This is where the menu controls are defined.
     *
     * @param {object} e Keydown event from javascript
     */
    _handleKeyDown = e => {
        if (!this.state.started) {
            return;
        }

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
        this.setState(old => {
            return {
                wave: old.wave + 1,
                intermission: false
            };
        });
        this.game.nextWave(this.state.wave);
        this.handlePause();
    }


    render() {
        const {
            inMenu, paused, started, inSettings, inLeaderboard, gameOver, intermission,
            playerName, playerSignature
        } = this.state;

        return (
            <>
                { gameOver && <GameOverMenu/> }
                { !started && inLeaderboard &&                      <LeaderboardMenu/> }
                { !started && !inSettings && !inLeaderboard &&      <StartMenu playerName={ playerName } playerSignature={ playerSignature }/> }
                { paused && !intermission &&    <PauseMenu/> }
                { inSettings &&                 <SettingsMenu playerName={ playerName } playerSignature={ playerSignature }/> }
                { intermission && paused &&     <WaveMenu waveData={ this.waveData } score={ this.score }/> }

                <Background hidden={ !inMenu }/>
            </>
        );
    }
}
