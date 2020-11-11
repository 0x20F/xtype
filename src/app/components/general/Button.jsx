import React, { Component } from 'react';



class Button extends Component {
    constructor(props) {
        super(props);
    }


    _handleKeyDown = e => {
        let key = e.key;
        let hint = this.props.hint;

        if (!hint) {
            return;
        }

        if (hint.toLowerCase() === 'ret') {
            hint = 'Enter';
        }

        if (key.toLowerCase() !== hint.toLowerCase()) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.props.onClick();
    }


    componentDidMount() { document.addEventListener('keydown', this._handleKeyDown, false); }
    componentWillUnmount() { document.removeEventListener('keydown', this._handleKeyDown, false); }


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