import React, { Component } from 'react';



class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
                <h1>X Type</h1>
                <button onClick={() => this.props.startHandler() }>Start</button>
                <button>Settings</button>
            </>
        );
    }
}


export default StartMenu;