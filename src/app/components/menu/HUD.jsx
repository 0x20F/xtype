import React, { Component } from 'react';


class HUD extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (

            <div className='hud'>
                <span></span>
                <span>wave {this.props.wave}</span>
                <span></span>
            </div>

        );
    }
}


export default HUD;