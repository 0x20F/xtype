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

    enemies.push(new Enemy(ctx));

    window.addEventListener('keydown', (e) => {
        const { key } = e;
        console.log(key);

        bullets.push(new Bullet(ctx, player.x, player.y, enemies[0]));
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
            ctx.fillStyle = 'white';

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