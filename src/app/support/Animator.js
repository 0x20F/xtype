import React from 'react';
import Anime from 'react-anime';



let defaultAnimation = {
    //opacity: [0, 1],
    scale: [0.9, 1]
};


const animate = {
    default: (component) => {
        return (
            <Anime {...defaultAnimation}>
                {component}
            </Anime>
        )
    }
}


export default animate;



