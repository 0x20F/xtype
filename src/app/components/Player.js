class Player {
    x;
    y;

    width = 50;
    height = 50;

    color = 'white';
    strokeColor = 'red';


    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
    }


    draw = () => {
        this.context.fillStyle = this.color;
        this.context.strokeStyle = this.strokeColor;

        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        this.context.strokeRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
}


export default Player;