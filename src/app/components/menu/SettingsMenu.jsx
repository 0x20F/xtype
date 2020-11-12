import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { createIdenticon } from 'foundation/Identicon';



class SettingsMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        this.state = {
            playerName: '0x20F',
            playerShip: ''
        }

        this.changed = false;
    }


    componentDidMount() {
        // Have something there when loading in
        this.updateShip();
        this.changed = true;
    }


    handleFocus = e => e.target.select();


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

        let content = 
            <div className='settingsMenu menu'>
                <div className='settingsHeader'>
                    <img src={playerShip} alt='Visual representation of the player ship'/>
                </div>
                
                <input 
                    type='text' 
                    defaultValue='0x20F' 
                    onChange={ this.handleChange } 
                    onFocus={ this.handleFocus }
                    required 
                    autoFocus/>

                <Button text='Save' hint='ret' onClick={ () => this.props.handler(playerName) }/>
            </div>;

        return this.changed ? content : this.smoothly(content);
    }
}


export default SettingsMenu;