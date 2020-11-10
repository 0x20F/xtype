import React, {Component} from 'react';

import { game } from './Game.js';
import axios from 'axios';


export default class App extends Component {
    constructor(props) {
        super(props);


        this.state = {
            paused: true
        }

        axios.get('/data/test.txt')
            .then(response => response.data)
            .then(words => {
                this.game = game(words);
            });
    }


    componentDidMount() {
        document.addEventListener('keydown', this._handleKeyDown, false);
    }


    componentWillUnmount() {
        document.removeEventListener('keydown', this._handleKeyDown, false);
    }


    _handleKeyDown = e => {
        switch (e.key) {
            case 'Escape':
                // Pause the game here
                this.setState(old => {
                    return {
                        paused: !old.paused
                    }
                });
                break;
        }
    }


    render() {
        const { paused } = this.state;

        return (
            <>
                {paused &&
                    <div>Game Paused</div>
                }
            </>
        );
    }
}