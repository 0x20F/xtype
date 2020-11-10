import React, { Component } from 'react';



class PauseMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='pauseMenu menu'>
                <h1 className='pauseHeader header'>Paused</h1>
                <button onClick={ () => this.props.handler() }>Continue</button>
            </div>
        );
    }
}


export default PauseMenu;