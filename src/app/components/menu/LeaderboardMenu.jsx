import React from 'react';
import Anime from 'react-anime';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';
import { allEntries } from 'foundation/Leaderboard';
import { truncate } from 'support/Helpers';
import {createIdenticon} from "../../foundation/Identicon";

const animeProps = {
    opacity: [0, 1],
    translateX: [-64, 0],
    delay: (el, i) => i * 100,
    duration: 500
};

class LeaderboardMenu extends AnimatedComponent {
    constructor(props) {
        super(props);

        this.state = {
            isGlobal: false,
            leaderboardEntries: []
        }
    }


    componentDidMount() {
        this.getEntries('local');
    }


    getEntries = async (from) => {
        this.setState({
            leaderboardEntries: await allEntries(from)
        });
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }


    leaderboardEntry = (data, i) => {
        return (
        <div className='leaderboardEntry' key={i}>
            <div className='playerInfo'>
                <img src={ createIdenticon(data.playerName) }/>
                <div className='playerName'>{ truncate(data.playerName, 15) }</div>
                <div className='signature'>
                    { data.signature ?
                        data.signature.substring(0, 20)
                        :
                        'score set before global update'
                    }
                </div>
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
        const { isGlobal, leaderboardEntries } = this.state;

        /**
         * Sort the scores first on the level the player reached (what wave)
         * and then on the scores the player got
         */
        let all = leaderboardEntries.sort((a, b) => {
            return b.totalWaves - a.totalWaves || b.score - a.score
        });
        let entries = [];
        let lastLevel = all[0] ? all[0].totalWaves : 0;


        all.forEach((e, i) => {
            if (i === 0) {
                entries.push(this.leaderboardSeparator(lastLevel, i));
            }

            if (e.totalWaves !== lastLevel) {
                lastLevel = e.totalWaves;
                entries.push(this.leaderboardSeparator(lastLevel, i));
            }

            entries.push(this.leaderboardEntry(e, i));
        });

        const classes = [
            'leaderboardMenu menu',
            isGlobal ? 'global' : 'local'
        ]

        return this.smoothly(
            <div className={ classes.join(' ') }>
                { entries.length === 0 && <div className='nothingHere'>
                    { isGlobal ?
                        'Nobody has set any scores yet...'
                        :
                        'You haven\'t set any scores yet!'
                    }
                </div>}

                { !isGlobal && entries.length > 0 && <>
                    <Anime {...animeProps}>
                        { entries }
                    </Anime>
                </> }

                { isGlobal && entries.length > 0 && <>
                    <Anime {...animeProps}>
                        { entries }
                    </Anime>
                </> }

                <div className='button-container'>
                    <Button mini={true} hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
                    <Button
                        mini={true}
                        hint='g'
                        text={ !isGlobal ? 'show global' : 'show local' }
                        onClick={ () => {
                            this.setState(old => ({
                                isGlobal: !old.isGlobal
                            }), () => {
                                this.getEntries(!isGlobal ? 'global' : 'local');
                            });
                        } }/>
                </div>
            </div>
        );
    }
}


export default LeaderboardMenu;
