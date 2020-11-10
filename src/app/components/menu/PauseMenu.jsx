import React, { Component } from 'react';



class PauseMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
                <h1>Game Paused</h1>
                <button onClick={ () => this.props.handler() }>Continue</button>
            </>
        );
    }
}


export default PauseMenu;