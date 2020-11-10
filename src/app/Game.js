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

let player = new Player(ctx, gc.width / 2, gc.height - 60);
let currentTarget = null;

let words = [];
let bullets = [];
let enemies = [];

let paused = false;

let lastUpdate;




/**
 * Spawns a specific number of enemies
 * 
 * @param {number} amount How many enemies to spawn
 */
const spawnEnemies = amount => {
    for (let i = 0; i < amount; i++) {
        enemies.push(new Enemy(ctx, words.shift() || 'lmao', player));
    }
}


/**
 * Initializes all needed events for the game to work properly,
 * as well as what should happen every time those events
 * get called.
 */
const initEvents = () => {
    window.addEventListener('keydown', e => {
        const { key } = e;

        // Don't do anything if paused
        if (paused) {
            return;
        }


        // If we already have a target
        if (currentTarget !== null) {
            if (currentTarget.word.toLowerCase().startsWith(key.toLowerCase())) {
                bullets.push(new Bullet(ctx, player.x, player.y, currentTarget));
                currentTarget.takeHit();

                // Release the target while the death animation is playing
                if (currentTarget.word === '') {
                    currentTarget = null;
                }
            }
            return;
        }

        // Find an enemy with your character
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];

            if (enemy.word.toLowerCase().startsWith(key.toLowerCase())) {
                currentTarget = enemy;
                bullets.push(new Bullet(ctx, player.x, player.y, enemy));

                enemy.targeted = true;
                enemy.takeHit();

                // Release the target while the death animation is playing
                if (currentTarget.word === '') {
                    currentTarget = null;
                }
                break;
            }
        }
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


    if (currentTarget && currentTarget.isDead()) {
        currentTarget = null;
    }


    bullets.forEach(bullet => {
        // This should never happen
        if (bullet.y < 0) {
            console.log('bullet out of bounds', bullet);
            bullets.shift();
        }

        bullet.move(delta);
        bullet.draw();

        // If bullet hit the target, remove it
        if (bullet.hit()) {
            if (
                bullet.target.word === '' &&
                !bullet.target.dying 
            ) {
                bullet.target.die();
            }

            bullets.shift();
        }
    });


    let allDead = enemies.every(enemy => enemy.isDead());

    if (allDead) {
        enemies = [];
        spawnEnemies(5);
    }


    // Draw all the enemies first
    enemies.forEach(enemy => {
        enemy.draw();

        if (!enemy.dying) {
            enemy.move(delta);
        }
    });

    // Then draw all their words so they're always on top
    enemies.forEach(enemy => {
        enemy.drawWord();
    });



    currentTarget && currentTarget.drawWord();
    player.draw();
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
        // Intialize word list
        words = wordList.split(/[\s,.]+/gm);
        lastUpdate = performance.now();

        // Spawn some enemies
        spawnEnemies(5);

        // Start event listeners
        initEvents();

        // Start animating
        animate();
    },

    pause: status => {
        paused = status;
            
        // Reset time so no new frames get calculated while paused
        lastUpdate = performance.now();
        !paused && animate();
    }
}


export default Game;