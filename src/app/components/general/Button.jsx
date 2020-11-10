import React, { Component } from 'react';



class Button extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { hint, text, onClick } = this.props;

        return (
            <div className="buttonContainer">
                <button onClick={ onClick }>{ text }</button>
                <div className="shortcutHint">{ hint }</div>
            </div>
        );
    }
}


export default Button;