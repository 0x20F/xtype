import React, { Component } from 'react';

import Button from 'components/general/Button';
import { createIdenticon } from 'foundation/Identicon';



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
            return {
                playerShip: createIdenticon(old.playerName, { size: 200 })
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

                <Button text='Save' hint='ret' onClick={ () => this.props.handler(playerName) }/>
            </div>
        );
    }
}


export default SettingsMenu;