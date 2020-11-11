import Bullet from 'components/Bullet';
import Player from 'components/Player';
import Enemy from 'components/Enemy';



const FRAME_DURATION = 1000 / 60;

let gc = document.getElementById("gameCanvas");
let ctx = gc.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

let player = new Player(gc.width / 2, gc.height - 60);

let words = [];
let entities = [];
let paused = false;
let lastUpdate;
let wave = 0;

/**
 * Spawns a specific number of enemies
 * 
 * @param {number} amount How many enemies to spawn
 */
const spawnEnemies = amount => {
    Game.add(new Enemy(words.shift() || 'lmao', player));
    amount--;

    let delay = 0;
    for (let i = 1; i <= amount; i++) {
        if (i%3 === 0) {
            delay += 1000;
        }

        setTimeout(() => {
            Game.add(new Enemy(words.shift() || 'lmao', player));
        }, delay)
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

    entities.sort((a, b) => {
        return a.vector.z - b.vector.z
    })

    entities.forEach(entity => {
        entity.onUpdate(delta);
    });

    // Draw all ships first
    entities.forEach(entity => {
        entity.draw(ctx);
    });

    // Draw all words on top of the ships
    Game.find('enemy').forEach(enemy => {
        enemy.drawWord(ctx);
    });

    if (!Game.find('enemy').length) {
        wave++;

        spawnEnemies(5*wave);
    }

    requestAnimationFrame(animate);
}


/**
 * The Game.
 * 
 * An interface to the outside world in order to 
 * control what the game does/should do.
 */
const Game = {
    start: wordList => {
        Game.add(player);

        // Intialize word list
        words = wordList.split(/[\s,.]+/gm);
        lastUpdate = performance.now();

        // Start event listeners
        initEvents();

        // Start animating
        animate();
    },


    add: entity => {
        entities.push(entity);
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

    getCurrentWave: () => {
        return wave;
    },

    pause: status => {
        paused = status;
            
        // Reset time so no new frames get calculated while paused
        lastUpdate = performance.now();
        !paused && animate();
    }
}


export default Game;
