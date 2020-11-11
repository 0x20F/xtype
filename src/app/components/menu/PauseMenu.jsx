import React, { Component } from 'react';

import Button from 'components/general/Button';



class PauseMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='pauseMenu menu'>
                <h1 className='pauseHeader header'>Paused</h1>
                <Button hint='esc' text='Continue' onClick={ this.props.handler }/>
            </div>
        );
    }
}


export default PauseMenu;