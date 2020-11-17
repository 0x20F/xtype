import AngleDelta from 'foundation/math/AngleDelta';
import Entity from "foundation/components/Entity";
import { createIdenticon } from 'foundation/Identicon';
import { events } from 'foundation/components/Emitter';
import Game from "../Game";

import * as PIXI from 'pixi.js';



class Enemy extends Entity {
    angle = 0;
    velocity = 2;
    maxVelocity = 2;
    minVelocity = 1.5;
    rotationSpeed = 0.01;
    maxRotationSpeed = 0.02;
    playerDelta;
    follow = false;

    alertTime = 1000;

    word;
    originalWord;
    targeted = false;
    dead = false;
    dying = false;
    target = null;

    image;
    width = 30;
    height = 30;
    life = 1;


    constructor(word, target) {
        super(
            Math.random() * (400 - 20) + 20,
            Math.random() * (-100 - 50) + -50
        );

        this.sprite(createIdenticon(word));
        this.part('sprite').width = 30;
        this.part('sprite').height = 30;

        //get randomized speeds and rotation
        this.velocity = (Math.floor(Math.random() * (this.maxVelocity*10 - this.minVelocity*10 + 1)) + this.minVelocity*10) / 10
        this.rotationSpeed = (Math.floor(Math.random() * (this.maxRotationSpeed*10000)) + 100)/ 10000

        let text = this.createWordText(word);
        let style = text.style;
        let textMetrics = PIXI.TextMetrics.measureText(word, style);

        this.add('blackBar', this.createBlackBar(textMetrics.width, textMetrics.height));
        this.add('text', text);

        this.life = word.length;
        this.tag = "enemy";
        this.word = word;
        this.originalWord = word;
        this.target = target;
        this.alertTime = Math.floor(Math.random() * (3000-1000)) + 1000;

        let startRotation = Math.floor(Math.random() * 60)-30

        this.angle = (-90+startRotation) * Math.PI / 180
        this.playerDelta = new AngleDelta(
            this.container.x,
            this.container.y,
            this.target.container.x,
            this.target.container.y
        );
    }


    draw = (delta) => {
        if (this.targeted) {
            this.part('text').style.fill = 0xff8f00;
        } else {
            this.part('text').style.fill = 0xffffff;
        }

        this.drawWord();
    }


    drawWord = () => {
        let textMetrics = PIXI.TextMetrics.measureText(this.word, this.part('text').style);
        this.part('blackBar').width = textMetrics.width + 10;

        if (this.word === '') {
            this.part('blackBar').alpha = 0;   
        }

        this.part('text').text = this.word;
    }


    onUpdate = (delta) => {
        if(this.dying) {
            this.part('sprite').alpha -= 0.1 * delta;
        }

        if (!this.follow) {
            this.follow = (this.timeSinceSpawned() - this.alertTime) > 0;
            if (this.container.x < 150 && this.container.x > 350) {
                this.follow = true;
            }
        }

        let dx = this.container.x - this.target.container.x;
        let dy = this.container.y - this.target.container.y;
        let angle = Math.atan2(dy, dx);

        let dangle = angle - this.angle;

        if (this.follow && dangle !== 0) {
            if (dangle > 0) {
                this.angle += this.rotationSpeed * delta
            } else {
                this.angle -= this.rotationSpeed * delta
            }

            if (dangle > -0.01 && dangle < 0.01) {
                this.angle = angle;
            }
        }

        let oldX = this.container.x
        let oldY = this.container.y

        this.container.x -= this.velocity * delta * Math.cos(this.angle);
        this.container.y -= this.velocity * delta * Math.sin(this.angle);

        this.part('sprite').angle = Math.atan2(
            oldY - this.container.y,
            oldX - this.container.x
        )*180/Math.PI + 90
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
            events.emit('enemyDeath');
            this.dying = true;
        }
    }


    isDead = () => {
        return this.dead || this.dying;
    }


    isTargeted = (status) => {
        if (status) {
            events.emit('enemyTargeted', this);
        }

        this.targeted = status;
    }


    createBlackBar = (width, height) => {
        let block = new PIXI.Sprite.from(PIXI.Texture.WHITE);

        block.anchor.set(0.5);
        block.width = width;
        block.height = height;
        block.tint = 0x000000;
        block.y = 30;

        return block;
    }


    createWordText = (from) => {
        let textStyle = new PIXI.TextStyle({ 
            fontFamily: 'Poppins', 
            fontSize: 16,
            align: 'center',
            fill: 0xffffff
        });
        let text = new PIXI.Text(from, textStyle);

        text.anchor.set(0.5);
        text.y = 30;

        return text;
    }
}


export default Enemy;
