import AngleDelta from 'foundation/AngleDelta';

import Bullet from 'components/Bullet';
import Player from 'components/Player';
import Enemy from './components/Enemy';



export const game = () => {
    let gc = document.getElementById("gameCanvas");
    let ctx = gc.getContext("2d");

    let player = new Player(ctx, gc.width / 2, gc.height - 60);

    let bullets = [];
    let enemies = [];

    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        bullets.push(new Bullet(ctx, player.x, player.y));
    });


    const FRAME_DURATION = 1000 / 60; // 60 fps ~16.66ms
    let lastUpdate = performance.now();

    enemies.push(new Enemy(ctx));

    
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
            ctx.fillStyle = 'white';

            // This should never happen
            if (bullet.y < 0) {
                console.log('bullet out of bounds', bullet);
                bullets.shift();
            }

            let enemyDelta = new AngleDelta(
                player.x, 
                player.y,
                enemies[0].x,
                enemies[0].y
            );
            let vec = enemyDelta.getVector(enemyDelta.distance, enemyDelta.angle);

            let rx = enemies[0].x;
            let ry = enemies[0].y;

            bullet.y += vec.y * (delta / 30);
            bullet.x += vec.x * (delta / 30);

            // Check if bullet is in bounds
            if (
                bullet.x > rx && bullet.x < rx + enemies[0].width &&
                bullet.y > ry && bullet.y < ry + enemies[0].height
            ) {
                console.log('The bullet hit the target! Deleting it.');
                bullets.shift();
            }

            bullet.draw();

            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(bullet.x + 5, bullet.y + 5);
            ctx.lineTo(rx, ry);
            ctx.stroke(); 
        });


        player.draw();
        requestAnimationFrame(animate);
    }


    animate();
}