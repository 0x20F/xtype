import React from 'react';

import AnimatedComponent from 'foundation/components/AnimatedComponent';


class WaveMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        this.state = {
            counter: this.props.from,
            interval: this.props.interval ?? 1000
        }

        this.interval;
    }

    
    componentDidMount() {
        this.interval = setInterval(() => {
            const { counter } = this.state;

            if (counter === 0) {
                this.props.whenDone();
                clearInterval(this.interval);
                return;
            } 

            this.setState({ counter: counter - 1 });
        }, this.state.interval);
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
        return this.smoothly(
            <div>{ this.state.counter }</div>
        );
    }
}


export default WaveMenu;