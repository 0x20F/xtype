import React, { Component } from 'react';



class Button extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { hint, text, onClick } = this.props;

        return (
            <div className="buttonContainer">
                <div className="button" onClick={ onClick }>{ text }</div>
                { hint && <div className="shortcutHint">{ hint }</div> }
            </div>
        );
    }
}


export default Button;