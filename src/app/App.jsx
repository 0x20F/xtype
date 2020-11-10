import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
           <Router>
               <Switch>
                   <Route exact path='/'>
                       <div>Home</div>
                   </Route>

                   <Route path='/pause'>
                       <div>Paused</div>
                   </Route>
               </Switch>
           </Router>
        );
    }
}