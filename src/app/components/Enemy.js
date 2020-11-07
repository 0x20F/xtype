class Enemy {
    x = 100;
    y = 20;

    width = 50;
    height = 50;

    color = 'white';


    constructor(context) {
        this.context = context;
    }


    draw = () => {
        this.context.fillStyle = this.color;

        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
}


export default Enemy;