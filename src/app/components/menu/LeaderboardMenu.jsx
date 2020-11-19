import React from 'react';
import Anime from 'react-anime';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';
import { allEntries } from 'foundation/Leaderboard';
import { truncate } from 'support/Helpers';



class LeaderboardMenu extends AnimatedComponent {
    constructor(props) {
        super(props);
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }


    leaderboardEntry = (data, i) => {
        return (
        <div className='leaderboardEntry' key={i}>
            <div className='playerInfo'>
                <img src={ data.playerAvatar }/>
                <div className='playerName'>{ truncate(data.playerName, 10) }</div>
            </div>

            <div className='playerData'>
                <div className='data accuracy'>{ data.accuracy }%</div>
                <div className='spacer'></div>
                <div className='data wpm'>{ data.wpm }</div>
                <div className='data score'>{ data.score }</div>
            </div>
        </div>);
    }


    leaderboardSeparator = (level, i) => {
        return (
            <div className='levelDisplay' key={ i * i }>Wave { level }</div>
        );
    }


    render() {
        let animeProps = {
            opacity: [0, 1],
            translateX: [-64, 0],
            delay: (el, i) => i * 200
        };

        
        /**
         * Sort the scores first on the level the player reached (what wave)
         * and then on the scores the player got
         */
        let all = allEntries().sort((a, b) => {
            return b.totalWaves - a.totalWaves || b.score - a.score
        });
        let entries = [];
        let lastLevel = all[0].totalWaves ?? 0;


        all.forEach((e, i) => {
            if (i === 0) {
                entries.push(this.leaderboardSeparator(lastLevel, i));
            }

            if (e.totalWaves !== lastLevel) {
                lastLevel = e.totalWaves;
                entries.push(this.leaderboardSeparator(lastLevel, i));
            }

            entries.push(this.leaderboardEntry(e, i));
        })


        return this.smoothly(
            <div className='leaderboardMenu menu'>
                { entries.length === 0 && <div className='nothingHere'>You haven't set any scores yet!</div>}

                { entries.length > 0 && <>
                    <Anime {...animeProps}>
                        { entries }
                    </Anime>
                </> }
                <Button mini={true} hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
            </div>
        );
    }
}


export default LeaderboardMenu;