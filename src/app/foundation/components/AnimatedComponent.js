import { Component } from 'react';
import animate from 'support/Animator';


class AnimatedComponent extends Component {
    constructor(props) {
        super(props);

        // Add access to the request maker class
        // The layer between front and back end

        this.state = {};
    }


    smoothly = (component) => {
        return animate.default(component);
    }
}


export default AnimatedComponent;