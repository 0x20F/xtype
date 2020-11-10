import React, { Component } from 'react';



class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='startMenu menu'>
                <h1 className='startHeader header'>XTYPE</h1>
                <button onClick={() => this.props.startHandler() }>Start</button>
                <button>Settings</button>
            </div>
        );
    }
}


export default StartMenu;