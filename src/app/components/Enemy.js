import AngleDelta from 'foundation/AngleDelta';


class Enemy {
    x = Math.random() * (400 - 20) + 20;
    y = 0;

    initialX;
    initialY;

    width = 50;
    height = 50;

    color = 'white';
    targetedColor = 'orange';

    word;
    targeted = false;
    dead = false;
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

        if (this.targeted) {
            this.context.fillStyle = this.targetedColor;
        }

        this.context.textAlign = 'center';
        this.context.fillText(this.word, this.x, this.y + this.height + 12);
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
        this.dead = true;
        this.color = 'black';
    }


    takeHit = () => {
        this.word = this.word.substring(1);
    }


    respawn = (word) => {
        this.x = Math.random() * (400 - 20) + 20;
        this.y = 0;

        this.initialX = this.x;
        this.initialY = this.y;

        this.word = word;
        this.color = 'white';
        this.dead = false;
        this.targeted = false;
    }


    isDead = () => {
        return this.dead;
    }
}


export default Enemy;