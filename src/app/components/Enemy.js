import AngleDelta from 'foundation/AngleDelta';
import Identicon from "identicon.js";
import { hashFnv32a } from "foundation/HashFnv32a"
import Entity from "foundation/Entity";
import Sprite from "foundation/Sprite";
import Vector from "foundation/Vector";
import Game from "../Game";


class Enemy extends Entity {
    angle = 0;
    playerDelta;

    alertTime = 1000;

    color = 'white';
    targetedColor = 'orange';

    word;
    targeted = false;
    dead = false;
    dying = false;
    target = null;

    image;
    width = 30;
    height = 30;
    life = 1;


    constructor(word, target) {
        let hash = hashFnv32a(word, 12345) + hashFnv32a(word, 54321);
        let src = 'data:image/svg+xml;base64,' + new Identicon(hash, {
            background: [24, 27, 33, 1],
            margin: 0,
            size: 60,
            saturation: 0.4,
            brightness: 0.4,
            format: 'svg'
        }).toString();

        super(new Sprite(src, 30, 30));

        this.life = word.length;
        this.tag = "enemy";
        this.word = word;
        this.target = target;
        this.alertTime = Math.floor(Math.random() * 3000) + 1000

        this.vector.x = Math.random() * (400 - 20) + 20;
        this.vector.y = Math.random() * -100;

        this.playerDelta = new AngleDelta(
            this.vector.x,
            this.vector.y,
            this.target.vector.x,
            this.target.vector.y
        );
    }


    draw = (context) => {
        context.save();

        context.translate((this.vector.x - this.sprite.width / 2), this.vector.y);
        context.translate(this.sprite.width, this.sprite.height)
        context.rotate((this.angle));
        context.fillStyle = this.color;

        this.sprite.draw(context);

        context.restore();
        this.drawWord(context);
    }


    drawWord = (context) => {
        // Draw the word
        if (this.word === '') {
            return;
        }

        let wordWidth = context.measureText(this.word).width + 7;
        context.fillStyle = 'black';
        context.fillRect(this.vector.x - wordWidth / 2, this.vector.y + this.height + 4, wordWidth, 22);

        context.fillStyle = this.targeted ? this.targetedColor : this.color;
        context.font = '16px Poppins';
        context.textAlign = 'center';
        context.fillText(this.word, this.vector.x, this.vector.y + this.height + 20);
    }


    onUpdate = (timeDelta) => {
        if (this.targeted) {
            this.vector.z = 1
        }
        if(this.dying) {
            this.sprite.setAlpha(this.sprite.alpha - (timeDelta / 10));
        }

        let vec = this.playerDelta.getVector(this.playerDelta.distance, this.playerDelta.angle);
        let oldVector = new Vector(this.vector.x, this.vector.y)

        let delta = (this.timeSinceSpawned() - this.alertTime) / 1000;
        delta = delta > 1 ? 1 : delta;

        this.vector.x += vec.x * (timeDelta / 1000) * delta;

        this.vector.y += vec.y * (timeDelta / 1000);
        this.angle = this.vector.getAngleFrom(oldVector);
    }

    takeDamage = () => {
        this.life--;

        if (this.life === 0) {
            this.dead = true;
            Game.remove(this);
        }
    }

    takeHit = () => {
        this.word = this.word.substring(1);

        if (this.word === '') {
            this.dying = true;
        }
    }

    isDead = () => {
        return this.dead || this.dying;
    }
}


export default Enemy;
