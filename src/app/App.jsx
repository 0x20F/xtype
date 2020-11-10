import React, {Component} from 'react';
import axios from 'axios';

import Game from './Game.js';
import PauseMenu from 'components/menu/PauseMenu';



export default class App extends Component {
    constructor(props) {
        super(props);


        this.state = {
            paused: true
        }

        this.game = Game;

        axios.get('/data/test.txt')
            .then(response => response.data)
            .then(words => {
                this.game.start(words);
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


    render() {
        const { paused } = this.state;

        return (
            <>
                { paused && <PauseMenu handler={ this.handlePause }/> }
            </>
        );
    }
}