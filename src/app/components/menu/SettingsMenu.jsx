import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { hashFnv32a } from "foundation/HashFnv32a"

import Button from 'components/general/Button';



class SettingsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerName: '0x20F',
            playerShip: ''
        }
    }


    componentDidMount() {
        // Have something there when loading in
        this.updateShip();
    }


    handleChange = e => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            playerName: e.target.value
        }, () => {
            this.updateShip();
        });
    }


    updateShip = () => {
        this.setState(old => {
            let hash = hashFnv32a(old.playerName, 12345) + hashFnv32a(old.playerName, 54321);
            let src = 'data:image/svg+xml;base64,' + new Identicon(hash, {
                background: [24, 27, 33, 1],
                margin: 0,
                size: 200,
                format: 'svg'
            }).toString();

            return {
                playerShip: src
            }
        });
    }


    render() {
        const { playerShip, playerName } = this.state;

        return (
            <div className='settingsMenu menu'>
                <div className='settingsHeader'>
                    <img src={playerShip} alt='Visual representation of the player ship'/>
                </div>
                
                <input type='text' defaultValue='0x20F' onChange={ this.handleChange } required autoFocus/>

                <Button text='Save' onClick={ () => this.props.handler(playerName) }/>
            </div>
        );
    }
}


export default SettingsMenu;