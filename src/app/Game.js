import Player from 'components/Player';
import Enemy from 'components/Enemy';
import { events } from 'foundation/components/Emitter';
import WordList from 'foundation/WordList';
import { sleep } from 'support/Helpers';

import * as PIXI from 'pixi.js';





let app;

let width;
let height;

let player;

let words = [ 'lmao' ];
let entities = [];
let paused = false;

let waveStart = 0;
let waveEnd = 0;
let enemiesKilled = 0;
let shotsFired = 0;
let shotsMissed = 0;








/**
 * Spawns a specific number of enemies
 * 
 * @param {number} amount How many enemies to spawn
 */
const spawnEnemies = async amount => {
    for (let i = 1; i <= amount; i++) {
        Game.add(new Enemy(words.next(), player));
        
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
}



/**
 * The main animation loop.
 * This is where all objects in view get rendered,
 * where enemies move, where bullets move, etc.
 * 
 * All calculations about positioning are made here.
 */
const animate = delta => {
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
            backgroundColor: 0x181b21,
            resolution: window.devicePixelRatio || 1
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

        spawnEnemies(5 * number);
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
    }
}


export default Game;
