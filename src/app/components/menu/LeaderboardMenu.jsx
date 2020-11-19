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


    render() {
        let animeProps = {
            opacity: [0, 1],
            translateX: [-64, 0],
            delay: (el, i) => i * 200
        };

        return this.smoothly(
            <div className='leaderboardMenu menu'>
                { allEntries().length === 0 && <div className='nothingHere'>You haven't set any scores yet!</div>}

                { allEntries().length > 0 && <>
                    <header>
                        <div className='playerName'>
                            Player
                        </div>

                        <div className='dataNames'>
                            <div className='item accuracy'>Acc</div>
                            <div className='separator'></div>
                            <div className='item wpm'>Wpm</div>
                            <div className='separator'></div>
                            <div className='item score'>Score</div>
                        </div>
                    </header>

                    <Anime {...animeProps}>
                        { allEntries().map((e, i) => {
                            return <div className='leaderboardEntry' key={i}>
                                <div className='playerInfo'>
                                    <img src={ e.playerAvatar }/>
                                    <div className='playerName'>{ truncate(e.playerName, 10) }</div>
                                </div>

                                <div className='playerData'>
                                    <div className='data accuracy'>{ e.accuracy }</div>
                                    <div className='spacer'></div>
                                    <div className='data wpm'>{ e.wpm }</div>
                                    <div className='data score'>{ e.score }</div>
                                </div>
                            </div>;
                        }) }
                    </Anime>
                </> }
                <Button mini={true} hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
            </div>
        );
    }
}


export default LeaderboardMenu;