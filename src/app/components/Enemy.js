class Enemy {
    x = Math.random() * (400 - 20) + 20;
    y = 20;

    width = 50;
    height = 50;

    color = 'white';
    targetedColor = 'orange';

    word;
    targeted = false;
    dead = false;



    constructor(context, word) {
        this.context = context;
        this.word = word;

        console.log(this.x, this.y);
    }


    draw = () => {
        this.context.fillStyle = this.color;

        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);

        if (this.targeted) {
            this.context.fillStyle = this.targetedColor;
        }

        this.context.textAlign = 'center';
        this.context.fillText(this.word, this.x, this.y + this.height + 12);
    }


    die = () => {
        this.color = 'black';
    }


    takeHit = () => {
        this.word = this.word.substring(1);

        if (this.word === '') {
            this.dead = true;
        }
    }


    isDead = () => {
        return this.dead;
    }
}


export default Enemy;