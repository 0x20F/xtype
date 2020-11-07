import AngleDelta from 'foundation/AngleDelta';

import Bullet from 'components/Bullet';
import Player from 'components/Player';



export const game = () => {
    let gc = document.getElementById("gameCanvas");
    let ctx = gc.getContext("2d");

    let player = new Player(ctx, gc.width / 2, gc.height - 60);

    let bullets = [];

    let rx = 400;
    let ry = 50;

    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        bullets.push(new Bullet(ctx, player.x, player.y));
    });


    const FRAME_DURATION = 1000 / 60; // 60 fps ~16.66ms
    let lastUpdate = performance.now();

    
    const animate = () => {
        const now = performance.now();
        const delta = ( now - lastUpdate ) / FRAME_DURATION;
        lastUpdate = now;

        // Clear canvas
        ctx.clearRect(0, 0, gc.width, gc.height);


        // Add a target
        ctx.fillStyle = 'white';
        ctx.fillRect(rx, ry, 60, 60);




        bullets.forEach(bullet => {
            ctx.fillStyle = 'white';

            // This should never happen
            if (bullet.y < 0) {
                console.log('bullet out of bounds', bullet);
                bullets.shift();
            }

            let enemyDelta = new AngleDelta(
                gc.width / 2, 
                gc.height - 60,
                rx + 30,
                ry + 30
            );
            let vec = enemyDelta.getVector(rx + 30, enemyDelta.angle);

            bullet.y += vec.y * (delta / 30);
            bullet.x += vec.x * (delta / 30);

            // Check if bullet is in bounds
            if (
                bullet.x > rx && bullet.x < rx + 50 &&
                bullet.y > ry && bullet.y < ry + 50
            ) {
                console.log('The bullet hit the target! Deleting it.');
                bullets.shift();
            }

            bullet.draw();

            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(bullet.x + 5, bullet.y + 5);
            ctx.lineTo(rx + 30, ry + 30);
            ctx.stroke(); 
        });


        player.draw();
        requestAnimationFrame(animate);
    }


    animate();
}