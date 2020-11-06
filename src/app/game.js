export const game = () => {
    let gc = document.getElementById("gameCanvas");
    let ctx = gc.getContext("2d");

    let bullets = []

    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        bullets.push({ x: gc.width/2 - 5, y: gc.height - 60 });
    });


    setInterval(() => {
        // Clear canvas
        //ctx.clearRect(0, 0, gc.width, gc.height);

        bullets.forEach(bullet => {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'red';

            if (bullet.y < 0) {
                console.log('bullet out of bounds', bullet);
                bullets.shift();
            }

            ctx.clearRect(bullet.x, bullet.y, 10, 10);

            bullet.y -= 5;
            
            ctx.fillRect(bullet.x, bullet.y, 10, 10);
        });


        // Generate player
        ctx.clearRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        ctx.fillRect(gc.width/2 - 15, gc.height - 60, 30, 30);
        ctx.strokeRect(gc.width/2 - 15, gc.height - 60, 30, 30);

    }, 1);
}