

function angleDelta(x1, y1, x2, y2) {
    let x = x2 - x1;
    let y = y2 - y1;

    return {
        distance: Math.sqrt(x * x + y * y),
        angle: Math.atan2(y, x) * 180 / Math.PI
    }
}

function Vector2D(magnitude, angle) {
    let angleRadians = (angle * Math.PI) / 180;

    this.x = magnitude * Math.cos(angleRadians);
    this.y = magnitude * Math.sin(angleRadians);
}



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

            if (bullet.y < 0) {
                console.log('bullet out of bounds', bullet);
                bullets.shift();
            }

            let measure = angleDelta(gc.width/2 - 5, gc.height - 60, rx + 40, ry + 30);
            let vec = new Vector2D(measure.distance / FRAME_DURATION, measure.angle);

            bullet.y += vec.y * delta;
            bullet.x += vec.x * delta;

            ctx.fillRect(bullet.x, bullet.y, 10, 10);
        });

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(gc.width / 2 - 5, gc.height - 60);
        ctx.lineTo(rx + 35, ry + 30);
        ctx.stroke(); 


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