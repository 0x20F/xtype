import React from 'react';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';



class LeaderboardMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }


    render() {
        return this.smoothly(
            <div className='leaderboardMenu menu'>
                <Button hint='c' text='Close' onClick={ this.closeLeaderboard }/>
            </div>
        );
    }
}


export default LeaderboardMenu;