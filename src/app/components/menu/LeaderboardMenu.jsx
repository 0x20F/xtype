import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';
import { addEntry } from 'foundation/Leaderboard';



class LeaderboardMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        // Add some placeholder data
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
        addEntry('tomato', '50%', '123', Math.random() * 500);
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }


    render() {


        return this.smoothly(
            <div className='leaderboardMenu menu'>
                <Button hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
            </div>
        );
    }
}


export default LeaderboardMenu;