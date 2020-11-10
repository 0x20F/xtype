import AngleDelta from 'foundation/AngleDelta';


class Enemy {
    x = Math.random() * (400 - 20) + 20;
    y = Math.random() * -100;

    initialX;
    initialY;

    width = 50;
    height = 50;

    color = 'white';
    targetedColor = 'orange';

    word;
    targeted = false;
    dead = false;
    dying = false;
    target = null;



    constructor(context, word, target) {
        this.context = context;
        this.word = word;
        this.target = target;

        this.initialX = this.x;
        this.initialY = this.y;
    }


    draw = () => {
        this.context.fillStyle = this.color;

        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);

        // Ignore the word if you're dead
        if (this.dead || this.dying) {
            return;
        }
    }


    drawWord = () => {
        // Draw the word
        if (this.word === '') {
            return;
        }

        let wordWidth = this.context.measureText(this.word).width + 7;
        this.context.fillStyle = 'black';
        this.context.fillRect(this.x - wordWidth / 2, this.y + this.height + 4, wordWidth, 22);

        this.context.fillStyle = this.targeted ? this.targetedColor : this.color;
        this.context.font = '16px Poppins';
        this.context.textAlign = 'center';
        this.context.fillText(this.word, this.x, this.y + this.height + 20);
    }


    move = (timeDelta) => {
        if (this.isDead()) {
            return;
        }

        let playerDelta = new AngleDelta(
            this.initialX,
            this.initialY,
            this.target.x,
            this.target.y
        );
        let vec = playerDelta.getVector(playerDelta.distance, playerDelta.angle);

        this.x += vec.x * (timeDelta / 1000);
        this.y += vec.y * (timeDelta / 1000);
    }


    die = () => {
        this.color = 'black';
        this.dying = true;

        // Fake a death animation
        setTimeout(() => {
            this.dead = true;
            console.log('Dead, finally');
        }, 1000);
    }


    takeHit = () => {
        this.word = this.word.substring(1);
    }


    respawn = (word) => {
        this.x = Math.random() * 500; // Canvas width, don't hard code it
        this.y = Math.random() * -100 + -50;

        this.initialX = this.x;
        this.initialY = this.y;

        this.word = word;
        this.color = 'white';
        this.dead = false;
        this.dying = false;
        this.targeted = false;
    }


    isDead = () => {
        return this.dead;
    }
}


export default Enemy;