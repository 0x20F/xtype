import React, {Component} from 'react';
import { game } from './game.js';


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nothing: 'yet'            
        };

        this.game = game();
    }

    render() {
        return (
           <></>
        );
    }
}