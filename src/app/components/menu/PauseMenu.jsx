import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';



class PauseMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    render() {
        return this.smoothly(
            <div className='pauseMenu menu'>
                <h1 className='pauseHeader header'>Paused</h1>
                <Button hint='esc' text='Continue' onClick={ this.props.handler }/>
            </div>
        );
    }
}


export default PauseMenu;