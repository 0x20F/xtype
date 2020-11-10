import AngleDelta from 'foundation/AngleDelta';
import Identicon from "identicon.js";
import { hashFnv32a } from "foundation/HashFnv32a"


class Enemy {
    x = Math.random() * (400 - 20) + 20;
    y = Math.random() * -100;
    angle = 0;

    initialX;
    initialY;

    width = 30;
    height = 30;
    alertTime = 1000;

    color = 'white';
    targetedColor = 'orange';

    word;
    targeted = false;
    dead = false;
    dying = false;
    target = null;

    image;
    bodyOptions = {
        background: [24, 27, 33, 1],
        margin: 0,
        size: 60,
        saturation: 0.4,
        brightness: 0.4,
        format: 'svg'
    }


    constructor(context, word, target) {
        this.spawned = performance.now();
        this.context = context;
        this.word = word;
        this.target = target;
        this.alertTime = Math.floor(Math.random() * 3000) + 1000

        this.initialX = this.x;
        this.initialY = this.y;

        let hash = hashFnv32a(this.word, 12345) + hashFnv32a(this.word, 54321);
        let src = 'data:image/svg+xml;base64,' + new Identicon(hash, this.bodyOptions).toString();
        this.image = new Image();
        this.image.src = src;
        
    }


    draw = () => {

        this.context.save();
        this.context.translate((this.x - this.width / 2), this.y);
        this.context.translate(15, 15)
        this.context.rotate((this.angle) );
        this.context.fillStyle = this.color;

        let alpha = 1;
        if (this.dead) {
            alpha = 0
        }

        this.context.drawImage(this.image, -15, -15, this.width * alpha, this.height * alpha);

        this.context.restore();

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
        this.context.font = '16px Montserrat';
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

        let oldX = this.x;
        let oldY = this.y;

        if (performance.now() - this.spawned > this.alertTime) {

            let delta = (performance.now() - this.spawned - this.alertTime) / 1000;
            delta = delta > 1 ? 1 : delta;

            this.x += vec.x * (timeDelta / 1000) * delta;
        }

        this.y += vec.y * (timeDelta / 1000);


        this.angle = Math.atan2(oldY - this.y, oldX - this.x) - (90 * Math.PI / 180);

    }


    die = () => {
        this.color = 'black';
        this.dying = true;

        // Fake a death animation
        setTimeout(() => {
            this.dead = true;
            console.log('Dead, finally');
        }, 500);
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