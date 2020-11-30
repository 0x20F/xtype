import Player from 'components/Player';
import Enemy from 'components/Enemy';
import { events } from 'foundation/components/Emitter';
import WordList from 'foundation/WordList';
import { sleep } from 'support/Helpers';

import * as PIXI from 'pixi.js';
import Velocity from './foundation/components/Velocity';





let app;

let width;
let height;

let player;
let dead = false;

let words = [];
let entities = [];
let paused = false;
let restarted = false;

let waveStart = 0;
let waveEnd = 0;
let enemiesKilled = 0;
let shotsFired = 0;
let shotsMissed = 0;

let velocity = new Velocity();








/**
 * Spawns a specific number of enemies
 * 
 * @param {number} amount How many enemies to spawn
 */
const spawnEnemies = async (amount, wave) => {
    for (let i = 1; i <= amount; i++) {
        Game.add(new Enemy(words.next(), player, wave, velocity));
        
        if (i % 3 === 0) {
            await sleep(1000);
        }
    }
}

/**
 * Initializes all needed events for the game to work properly,
 * as well as what should happen every time those events
 * get called.
 */
const initEvents = () => {
    if (restarted) {
        return;
    }

    console.log('Setting up events');

    window.addEventListener('keydown', e => {
        // Don't do anything if paused
        if (paused) {
            return;
        }

        entities.forEach(entity => {
            entity.onEvent('keydown', e);
        });
    });

    events.on('enemyDeath', () => {
        enemiesKilled++;
    });

    // Draw the target on top of everything else
    events.on('enemyTargeted', enemy => {
        Game.remove(enemy);
        Game.add(enemy);
    });

    events.on('shotFired', missed => {
        if (missed) {
            shotsMissed++;
        }

        shotsFired++;
    });

    events.on('playerDeath', () => {
        // Don't do anything if already registered
        if (dead) {
            return;
        }
        dead = true;

        waveEnd = Date.now();

        events.emit('gameOver', {
            waveStart,
            waveEnd,
            enemiesKilled,
            shotsFired,
            shotsMissed
        });
    });
}



/**
 * The main animation loop.
 * This is where all objects in view get rendered,
 * where enemies move, where bullets move, etc.
 * 
 * All calculations about positioning are made here.
 */
const animate = delta => {
    if (dead) {
        app.ticker.stop();
        return;
    }

    entities.forEach(entity => {
        entity.onUpdate(delta);
    });

    
    entities.forEach(entity => {
        entity.draw(delta);
    });


    // If there are no enemies, wave is done
    if (!Game.find('enemy').length) {
        waveEnd = Date.now();

        events.emit('waveEnd', {
            waveStart,
            waveEnd,
            enemiesKilled,
            shotsFired,
            shotsMissed
        });

        app.ticker.stop();
        return;
    }
}




/**
 * The Game.
 * 
 * An interface to the outside world in order to 
 * control what the game does/should do.
 */
const Game = {
    start: async (playerName) => {
        app = new PIXI.Application({
            width: 500,
            height: 800,
            antialias: true,
            autoResize: true,
            backgroundColor: 0x1b2026,
            resolution: window.devicePixelRatio
        });
        document.body.querySelector('.grid').appendChild(app.view);

        width = app.screen.width;
        height = app.screen.height;

        words = new WordList();
        await words.load();

        player = new Player(playerName, width / 2, height - 60);
        Game.add(player);

        // Start event listeners
        initEvents();

        app.ticker.stop();
        app.ticker.add(animate);
    },


    nextWave: number => {
        // TODO: This needs to update when unpausing
        waveStart = Date.now();
        shotsFired = 0;
        shotsMissed = 0;
        enemiesKilled = 0;

        // Minimum amount of enemies
        let enemies = 3;
        // How many new enemies per round
        let multiplier = 3;
        // How many rounds until enemy amount increases
        // by the specified multiplier
        let roundsMultiplier = 4;

        spawnEnemies(emeies + (Math.ceil(number / roundsMultiplier) * multiplier), number);
        app.ticker.start();
    },


    add: entity => {
        entities.push(entity);
        app.stage.addChild(entity.container);
    },

    find: tag => {
        return entities.filter((a) => a.tag === tag);
    },

    remove: entity => {
        app.stage.removeChild(entity.container);

        const index = entities.indexOf(entity);
        if (index > -1) {
            entities.splice(index, 1);
        }
    },

    pause: status => {
        paused = status;

        if (paused) {
            app.ticker.stop();
        } else {
            app.ticker.start();
        }
    },

    reset: () => {
        restarted = true;
        paused = false;

        shotsFired = 0;
        shotsMissed = 0;
        enemiesKilled = 0;
        dead = false;

        app.ticker.destroy();
        words = [];
        entities = [];
        player = null;
    }
}


export default Game;
