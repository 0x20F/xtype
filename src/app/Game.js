import Player from 'components/Player';
import Enemy from 'components/Enemy';
import { events } from 'foundation/components/Emitter';
import WordList from 'foundation/WordList';
import { sleep } from 'support/Helpers';



const FRAME_DURATION = 1000 / 60;

let gc = document.getElementById("gameCanvas");
let ctx = gc.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

let player;

let words = [];
let entities = [];
let paused = false;
let lastUpdate;

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
const animate = () => {
    if (paused) {
        return;
    }

    const now = performance.now();
    const delta = ( now - lastUpdate ) / FRAME_DURATION;
    lastUpdate = now;

    // Clear canvas
    ctx.clearRect(0, 0, gc.width, gc.height);

    entities.forEach(entity => {
        entity.onUpdate(delta);
    });

    // Draw all ships first
    entities.forEach(entity => {
        entity.draw(ctx);
    });

    let target;
    // Draw all words on top of the ships
    Game.find('enemy').forEach(enemy => {
        if (enemy.targeted) {
            target = enemy;
        }
        enemy.drawWord(ctx);
    });
    target && target.drawWord(ctx);

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

        return;
    }

    // Draw the player last so it's on top of everything
    player.draw(ctx);
    requestAnimationFrame(animate);
}


/**
 * The Game.
 * 
 * An interface to the outside world in order to 
 * control what the game does/should do.
 */
const Game = {
    start: async (playerName) => {
        words = new WordList();
        await words.load();

        player = new Player(gc.width / 2, gc.height - 60, playerName);
        Game.add(player);

        // Intialize word list
        lastUpdate = performance.now();

        // Start event listeners
        initEvents();
    },


    nextWave: number => {
        // TODO: This needs to update when unpausing
        waveStart = Date.now();
        shotsFired = 0;
        shotsMissed = 0;

        spawnEnemies(5 * number);
        animate();
    },


    add: entity => {
        entities.push(entity);

        entities.sort((a, b) => {
            return a.vector.z - b.vector.z
        });
    },

    find: tag => {
        return entities.filter((a) => a.tag === tag);
    },

    remove: entity => {
        const index = entities.indexOf(entity);
        if (index > -1) {
            entities.splice(index, 1);
        }
    },

    pause: status => {
        paused = status;
            
        if (!paused) {
            // Reset time so no new frames get calculated while paused
            lastUpdate = performance.now();
            animate();
        }
    }
}


export default Game;
