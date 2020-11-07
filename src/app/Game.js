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

    enemies.push(new Enemy(ctx));

    window.addEventListener('keydown', (e) => {
        const { key } = e;

        // If we already have a target
        if (currentTarget !== null) {
            currentTarget.word.startsWith(key) && bullets.push(new Bullet(ctx, player.x, player.y, currentTarget));
            currentTarget.takeHit();
            return;
        }

        // Find an enemy with your character
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[0];

            if (enemy.word.startsWith(key)) {
                currentTarget = enemy;
                bullets.push(new Bullet(ctx, player.x, player.y, enemy));
                enemy.takeHit();
                break;
            }
        }
    });


    const FRAME_DURATION = 1000 / 60; // 60 fps ~16.66ms
    let lastUpdate = performance.now();

    
    const animate = () => {
        const now = performance.now();
        const delta = ( now - lastUpdate ) / FRAME_DURATION;
        lastUpdate = now;

        // Clear canvas
        ctx.clearRect(0, 0, gc.width, gc.height);


        enemies.forEach(enemy => {
            enemy.draw();
        });


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
                bullets.shift();
            }
        });


        player.draw();
        requestAnimationFrame(animate);
    }


    animate();
}