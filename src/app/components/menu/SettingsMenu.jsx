import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { createIdenticon } from 'foundation/Identicon';
import { events } from 'foundation/components/Emitter';



class SettingsMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        this.state = {
            playerName: props.playerName,
            playerSignature: props.playerSignature,
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


    handleNameChange = e => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            playerName: e.target.value
        }, () => {
            this.updateShip();
        });
    }


    handleSignatureChange = e => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({
            playerSignature: e.target.value
        });
    }


    updateShip = () => {
        this.setState(old => {
            return {
                playerShip: createIdenticon(old.playerName, { size: 200 })
            }
        });
    }


    saveSettings = () => {
        const { playerName, playerSignature } = this.state;

        events.emit('settingsSaved', playerName, playerSignature);
    }


    render() {
        const { playerShip, playerName, playerSignature } = this.state;

        let content =
            <div className='settingsMenu menu'>
                <div className='settingsHeader'>
                    <img src={playerShip} alt='Visual representation of the player ship'/>
                </div>

                <input
                    type='text'
                    placeholder='input ship name'
                    defaultValue={ playerName }
                    onChange={ this.handleNameChange }
                    onFocus={ this.handleFocus }
                    required
                    autoFocus/>

                <input
                    type='password'
                    placeholder='input unique signature'
                    onChange={ this.handleSignatureChange }
                    onFocus={ this.handleFocus }
                    required/>

                <div className='signature-description-text'>
                    identification on the global leaderboard
                </div>

                <Button
                    text='Save'
                    hint='ret'
                    onClick={ this.saveSettings }
                    disabled={ (!playerName || !playerSignature) && 'fill in all fields to continue' }/>
            </div>;

        return this.changed ? content : this.smoothly(content);
    }
}


export default SettingsMenu;
