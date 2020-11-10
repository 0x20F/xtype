import React, { Component } from 'react';



class StartMenu extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='startMenu menu'>
                <h1 className='startHeader header'>XTYPE</h1>
                
                {/* Move this to it's own component */}
                <div className="buttonContainer">
                    <div className="shortcutHint">P</div>
                    <button onClick={() => this.props.startHandler() }>Play</button>
                </div>
                <div className="buttonContainer">
                    <div className="shortcutHint">S</div>
                    <button>Settings</button>
                </div>
            </div>
        );
    }
}


export default StartMenu;