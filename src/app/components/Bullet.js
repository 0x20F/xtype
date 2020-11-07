class Bullet {
    x;
    y;

    width = 10;
    height = 10;

    color = 'yellow';
    context;

    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
    }


    draw = () => {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
}


export default Bullet;