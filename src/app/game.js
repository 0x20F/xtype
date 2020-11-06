import { data } from "autoprefixer";

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
    
    const animate = () => {
        requestAnimationFrame(animate);

        // Clear canvas
        ctx.clearRect(0, 0, gc.width, gc.height);

        // Add a target at 50, 50
        ctx.fillStyle = 'white';

        if (!iv) {
            rx -= tt / 1000;
            if (rx <= 20) {
                iv = true;
            }
        }

        // invert the animation
        if (iv) {
            rx += tt / 1000;
            if (rx >= gc.width - 20) {
                iv = false;
            }
        }
        ctx.fillRect(rx, ry, 60, 60);
        ctx.fillStyle = 'red';
        ctx.fillRect(rx + 25, ry + 25, 10, 10);
        ctx.fillStyle = 'white';

        bullets.forEach(bullet => {
            ctx.fillStyle = 'white';

            if (bullet.y < 0) {
                console.log('bullet out of bounds', bullet);
                bullets.shift();
            }

            ctx.clearRect(bullet.x, bullet.y, 10, 10);

            let measure = angleDelta(rx + 25, ry + 25, gc.width/2 - 5, gc.height - 60);
            let vec = new Vector2D(measure.distance / 70, measure.angle);

            bullet.y -= vec.y;
            bullet.x -= vec.x;

            ctx.fillRect(bullet.x, bullet.y, 10, 10);
        });


        // Generate player
        ctx.clearRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        ctx.fillRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.strokeRect(gc.width/2 - 15, gc.height - 60, 30, 30);
    }


    animate();
}