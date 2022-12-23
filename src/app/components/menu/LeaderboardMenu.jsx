import React from 'react';
import Anime from 'react-anime';

import Button from 'components/general/Button';
import AnimatedComponent from 'foundation/components/AnimatedComponent';
import { events } from 'foundation/components/Emitter';
import { allEntries } from 'foundation/Leaderboard';
import { truncate } from 'support/Helpers';
import {createIdenticon} from "../../foundation/Identicon";
import {sha512} from "../../foundation/math/Hashes";

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
            isGlobal: true,
            signedSignature: props.playerSignature,
            leaderboardEntries: []
        }
    }


    async componentDidMount() {
        this.setState({
           signedSignature: await sha512(this.props.playerSignature)
        });

        await this.getEntries('global');
    }


    getEntries = async (from) => {
        this.setState({
            leaderboardEntries: await allEntries(from)
        });
    }


    closeLeaderboard = () => {
        events.emit('leaderboardClosed');
    }

    topLeaderboardEntry = (data) => {
        if (!data) {
            return null;
        }

        return (
            <div className='top-leaderboard-entry'>
                <div className='wrapper'>
                    <div className='playerInfo'>
                        <img src={ createIdenticon(data.playerName) }/>
                        <div className='playerName'>{ truncate(data.playerName, 15) }</div>
                    </div>

                    <div className='playerData'>
                        <div className='data-top'>
                            <div className='accuracy'>{ data.accuracy }%</div>
                            <div className='wpm'>{ data.wpm } wpm</div>
                        </div>

                        <div className='score'>
                            { data.score }
                        </div>
                    </div>
                </div>

                <div className='signature'>
                    { data.signature ?
                        data.signature.substring(0, 20)
                        :
                        'score set before global update'
                    }
                </div>
            </div>);
    }

    leaderboardEntry = (data, i) => {
        const isPlayer = data.signature === this.state.signedSignature;

        return (
        <div className='leaderboardEntry' key={i}>
            { (isPlayer && this.state.isGlobal) && <div className='personal-identifier'/> }

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
        const { isGlobal, leaderboardEntries, signedSignature } = this.state;

        /**
         * Sort the scores first on the level the player reached (what wave)
         * and then on the scores the player got
         */
        let all = leaderboardEntries.sort((a, b) => {
            return b.totalWaves - a.totalWaves || b.score - a.score
        });
        let entries = [];
        let lastLevel = all[0] ? all[0].totalWaves : 0;

        const findMe = (from) => {
            return from.findIndex(player =>
                player.playerName === this.props.playerName &&
                player.signature === signedSignature
            )
        }

        const me = findMe(all);
        let aroundMe = [];

        if (me !== -1) {
            const min = Math.min(0, me - 5);
            const max = Math.max(all.length, me + 5);

            // Get an array between those values
            aroundMe = all.slice(min, max);
        }

        let filtered = me !== -1 ?
            aroundMe : all;


        filtered.forEach((e, i) => {
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

                { isGlobal && all.length > 0 && <>
                    <Anime {...animeProps}>
                        <div className='top-three-globally'>
                            <div className='second-place'>
                                { all[1] ?
                                    this.topLeaderboardEntry(all[1])
                                    :
                                    <div className='empty-plaque'>Not set yet...</div>
                                }
                                <div className='place'>🥈</div>
                            </div>

                            <div className='first-place'>
                                { all[0] ?
                                    this.topLeaderboardEntry(all[0])
                                    :
                                    <div className='empty-plaque'>Not set yet...</div>
                                }
                                <div className='place'>🥇</div>
                            </div>

                            <div className='third-place'>
                                { all[2] ?
                                    this.topLeaderboardEntry(all[2])
                                    :
                                    <div className='empty-plaque'>Not set yet...</div>
                                }
                                <div className='place'>🥉</div>
                            </div>
                        </div>
                    </Anime>

                    <div className='personal-standings-globally'>
                        <div className='category-text'>
                            Standings around you
                        </div>

                        { entries.length > 0 && <>
                            <Anime {...animeProps}>
                                { entries }
                            </Anime>
                        </> }
                    </div>
                </> }

                <div className='button-container'>
                    <Button mini={true} hint='esc' text='Close' onClick={ this.closeLeaderboard }/>
                    <Button
                        mini={true}
                        hint='g'
                        text={ !isGlobal ? 'show global' : 'show local' }
                        onClick={ async () => {
                            await this.getEntries(!isGlobal ? 'global' : 'local');

                            this.setState(old => ({
                                isGlobal: !old.isGlobal
                            }));
                        } }/>
                </div>
            </div>
        );
    }
}


export default LeaderboardMenu;
