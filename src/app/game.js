import AngleDelta from 'foundation/AngleDelta';



export const game = () => {
    let gc = document.getElementById("gameCanvas");
    let ctx = gc.getContext("2d");

    let bullets = []

    let tt = 400;
    let iv = true;
    let rx = 400;
    let ry = 50;

    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        bullets.push({ x: gc.width/2 - 5, y: gc.height - 60 });
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
        ctx.fillStyle = 'white';




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

            ctx.fillRect(bullet.x, bullet.y, 10, 10);

            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(bullet.x + 5, bullet.y + 5);
            ctx.lineTo(rx + 30, ry + 30);
            ctx.stroke(); 
        });


        // Generate player
        ctx.clearRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        ctx.fillRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.strokeRect(gc.width/2 - 15, gc.height - 60, 30, 30);


        requestAnimationFrame(animate);

        // Simulate 10 fps with setTimeout
        //setTimeout(animate, 100);
    }


    animate();
}