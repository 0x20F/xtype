import React from 'react';

import AnimatedComponent from 'foundation/components/AnimatedComponent';


class HUD extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    render() {
        return this.smoothly(

            <div className='hud'>
                <span></span>
                <span>wave {this.props.wave}</span>
                <span></span>
            </div>

        );
    }
}


export default HUD;