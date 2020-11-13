import React from 'react';
import _ from 'underscore';

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
        const { waveData } = this.props;

        console.log(waveData);

        const finishedWave = waveData.length;
        const { shotsMissed, shotsFired, waveStart, waveEnd } = _.last(waveData);

        let shotsHit = shotsFired - shotsMissed;
        let waveTime = (waveEnd - waveStart) / 1000 / 60; // in minutes

        const accuracy = ((1 - ( shotsMissed / shotsFired )) * 100).toFixed(2);
        const wpm = ((shotsHit / 5) / waveTime).toFixed(2);

        return this.smoothly(
            <div className='hud'>
                <div className='wave'>
                    wave 
                    <br/>
                    { finishedWave }
                </div>

                Accuracy {accuracy}%
                <br/>
                Wpm {wpm}

                <div className='timer'>
                    <Timer from={5} whenDone={ this.handleNextWave }/>
                </div>
            </div>
        );
    }
}


export default WaveMenu;