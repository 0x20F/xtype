import React from 'react';

import Timer from 'components/general/Timer';
import AnimatedComponent from 'foundation/components/AnimatedComponent';


class WaveMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    handleNextWave = () => {
        this.props.emitter.emit('nextWave');
    }


    render() {
        const { shotsFired, shotsMissed } = this.props;
        const accuracy = ((1 - ( shotsMissed / shotsFired )) * 100).toFixed(2);

        console.log(shotsFired, shotsMissed, accuracy);

        return this.smoothly(
            <div className='hud'>
                <div className='wave'>
                    wave 
                    <br/>
                    {this.props.wave}
                </div>

                Accuracy {accuracy}%

                <div className='timer'>
                    <Timer from={5} whenDone={ this.handleNextWave }/>
                </div>
            </div>
        );
    }
}


export default WaveMenu;