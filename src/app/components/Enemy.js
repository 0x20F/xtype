class Enemy {
    x = 20;
    y = 20;

    width = 50;
    height = 50;

    color = 'white';

    word = 'lmao';
    targeted = false;



    constructor(context) {
        this.context = context;
    }


    draw = () => {
        this.context.fillStyle = this.color;

        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);

        this.context.textAlign = 'center';
        this.context.fillText(this.word, this.x, this.y + this.height + 12);
    }
}


export default Enemy;