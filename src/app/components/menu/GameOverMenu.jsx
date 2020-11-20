import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';



class GameOverMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    restartGame = () => {
        events.emit('restartGame');
    }


    render() {
        return this.smoothly(
            <div className='gameOverMenu menu'>
                <h1 className='gameOverHeader header'>Game Over</h1>
                <Button danger={true} hint='ret' text='Back to Menu' onClick={ this.restartGame }/>
            </div>
        );
    }
}


export default GameOverMenu;