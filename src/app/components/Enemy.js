class Enemy {
    x = 20;
    y = 20;

    width = 50;
    height = 50;

    color = 'white';
    targetedColor = 'orange';

    word = 'lmao';
    targeted = false;
    dead = false;



    constructor(context) {
        this.context = context;
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


    takeHit = () => {
        this.targeted = true;

        this.word = this.word.substring(1);
        console.log('Word is now', this.word);

        if (this.word === '') {
            this.dead = true;
            console.log('You killed it!');
            return;
        }
    }
}


export default Enemy;