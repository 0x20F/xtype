import React from 'react';
import _ from 'underscore';
import Chart from 'chart.js';

import Timer from 'components/general/Timer';
import AnimatedComponent from 'foundation/components/AnimatedComponent';


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
                        data: waves.map(wave => this.calculateAccuracy(wave)),
                        label: "Accuracy",
                        borderColor: "#3e95cd",
                        fill: false
                    },

                    // Words per minute
                    {
                        data: waves.map(wave => this.calculateWpm(wave)),
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


    calculateWpm = wave => {
        let shotsHit = wave.shotsFired - wave.shotsMissed;
        let waveTime = (wave.waveEnd - wave.waveStart) / 1000 / 60;

        return ((shotsHit / 5) / waveTime).toFixed(2);
    }


    calculateAccuracy = wave => {
        return ((1 - (wave.shotsMissed / wave.shotsFired)) * 100).toFixed(2);
    }


    render() {
        const { waveData } = this.props;

        const finishedWave = waveData.length;
        const wave = _.last(waveData);

        const accuracy = this.calculateAccuracy(wave);
        const wpm = this.calculateWpm(wave);

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