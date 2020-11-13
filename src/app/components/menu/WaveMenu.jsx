import React from 'react';
import _ from 'underscore';
import Chart from 'chart.js';

import Timer from 'components/general/Timer';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { calculateWpm, calculateAccuracy } from 'foundation/math/PlayerData';


class WaveMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        this.chart = React.createRef();
        this.graph;
    }


    componentDidMount() {
        let waves = this.props.waveData;

        this.graph = new Chart(this.chart.current, {
            type: 'line',
            data: {
                labels: waves.map((_, idx) => idx + 1),
                datasets: [
                    // Accuracy
                    {
                        data: waves.map(wave => calculateAccuracy(wave)),
                        label: "Accuracy",
                        borderColor: "#3e95cd",
                        fill: false
                    },

                    // Words per minute
                    {
                        data: waves.map(wave => calculateWpm(wave)),
                        label: "Wpm",
                        borderColor: "#78ebcc",
                        fill: false
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)"
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)"
                        }
                    }]
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
    }


    handleNextWave = () => {
        this.props.emitter.emit('nextWave');
    }


    render() {
        const { waveData } = this.props;

        const finishedWave = waveData.length;
        const wave = _.last(waveData);

        const accuracy = calculateAccuracy(wave);
        const wpm = calculateWpm(wave);

        return this.smoothly(
            <div className='hud'>
                <div className='wave'>
                    wave
				    <br />
                    {finishedWave}
                </div>

                <div className='waveStats'>
                    <div className='stat'>
                        <div className='marker accuracy'></div>
												Accuracy {accuracy}%
										</div>
                    <div className='stat'>
                        <div className='marker wpm'></div>
												Wpm {wpm}
                    </div>
                </div>

                <div className='chartContainer'>
                    <canvas width='300' height='150' ref={this.chart}></canvas>
                </div>

                <div className='timer'>
                    <Timer from={5} whenDone={this.handleNextWave} />
                </div>
            </div>
        );
    }
}


export default WaveMenu;