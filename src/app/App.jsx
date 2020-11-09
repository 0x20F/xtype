import React, {Component} from 'react';
import { game } from './Game.js';
import axios from 'axios';


export default class App extends Component {
    constructor(props) {
        super(props);
        
        axios.get('/data/test.txt')
            .then(response => response.data)
            .then(words => {
                this.game = game(words);
            });
    }

    render() {
        return (
           <></>
        );
    }
}