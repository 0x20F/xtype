import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';



class PauseMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    unpauseGame = () => {
        events.emit('unpause');
    }


    render() {
        return this.smoothly(
            <div className='pauseMenu menu'>
                <h1 className='pauseHeader header'>Paused</h1>
                <Button hint='esc' text='Continue' onClick={ this.unpauseGame }/>
            </div>
        );
    }
}


export default PauseMenu;