import AngleDelta from 'foundation/AngleDelta';

import Bullet from 'components/Bullet';
import Player from 'components/Player';
import Enemy from './components/Enemy';



export const game = () => {
    let gc = document.getElementById("gameCanvas");
    let ctx = gc.getContext("2d");

    let player = new Player(ctx, gc.width / 2, gc.height - 60);
    let currentTarget = null;

    let bullets = [];
    let enemies = [];

    let paused = false;

    const FRAME_DURATION = 1000 / 60; // 60 fps ~16.66ms
    let lastUpdate = performance.now();


    enemies.push(new Enemy(ctx, 'lmao', player));
    enemies.push(new Enemy(ctx, 'rofl', player));

    window.addEventListener('keydown', (e) => {
        const { key } = e;

        // Pause on escape
        if (key === 'Escape') {
            paused = !paused;
            
            // Reset time so no new frames get calculated while paused
            lastUpdate = performance.now();
            !paused && animate();
        }


        // Don't do anything if paused
        if (paused) {
            return;
        }


        // If we already have a target
        if (currentTarget !== null) {
            if (currentTarget.word.startsWith(key)) {
                bullets.push(new Bullet(ctx, player.x, player.y, currentTarget));
                currentTarget.takeHit();
            }
            return;
        }

        // Find an enemy with your character
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];

            if (enemy.word.startsWith(key)) {
                currentTarget = enemy;
                bullets.push(new Bullet(ctx, player.x, player.y, enemy));

                enemy.targeted = true;
                enemy.takeHit();
                break;
            }
        }
    });

    
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
                // Wait until the last bullet hits, then register the kill
                if (
                    bullet.target.word === '' &&
                    !bullet.target.dying 
                ) {
                    currentTarget = null;
                    bullet.target.die();
                }

                bullets.shift();
            }
        });


        let allDead = enemies.every(enemy => enemy.isDead());

        enemies.forEach(enemy => {
            enemy.draw();

            if (!enemy.dying) {
                enemy.move(delta);
            }
            
            if (allDead) {
                enemy.respawn('lmao');
            }
        });


        player.draw();
        requestAnimationFrame(animate);
    }


    animate();
}