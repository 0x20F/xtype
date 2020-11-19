import React from 'react';
import Anime from 'react-anime';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';
import { allEntries } from 'foundation/Leaderboard';
import { addEntry } from '../../foundation/Leaderboard';



class LeaderboardMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }


    render() {
        let animeProps = {
            opacity: [0, 1],
            translateY: [-64, 0],
            delay: (el, i) => i * 200
        };

        return this.smoothly(
            <div className='leaderboardMenu menu'>
                <Anime {...animeProps}>
                    { allEntries().map((e, i) => {
                        return <div className='leaderboardEntry' key={i}>
                            <div className='playerInfo'>
                                <img src={ e.playerAvatar }/>
                                { e.playerName }
                            </div>

                            <div className='playerData'>
                                { e.accuracy } / { e.wpm } / { e.score }
                            </div>
                        </div>;
                    }) }
                </Anime>
                <Button hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
            </div>
        );
    }
}


export default LeaderboardMenu;