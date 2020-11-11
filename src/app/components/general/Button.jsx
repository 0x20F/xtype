import React, { Component } from 'react';



class Button extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { hint, text, onClick } = this.props;

        let classes = !hint ? 'rounded' : '';

        return (
            <div className="buttonContainer">
                <div className={ classes } onClick={ onClick }>{ text }</div>
                { hint && <div className="shortcutHint">{ hint }</div> }
            </div>
        );
    }
}


export default Button;