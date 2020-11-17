import AngleDelta from 'foundation/math/AngleDelta';
import Entity from "foundation/components/Entity";
import Vector from "foundation/math/Vector";
import { createIdenticon } from 'foundation/Identicon';
import { events } from 'foundation/components/Emitter';
import Game from "../Game";

import * as PIXI from 'pixi.js';



class Enemy {
    entity;
    ship;
    text;
    blackBar;

    angle = 0;
    playerDelta;

    alertTime = 1000;

    color = 'white';
    targetedColor = 'orange';

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
        let container = new PIXI.Container();
        let sprite = new PIXI.Sprite.from(createIdenticon(word));

        sprite.anchor.set(0.5);
        sprite.width = 30;
        sprite.height = 30;

        container.pivot.x = Math.round(container.width / 2);
        container.pivot.y = Math.round(container.height / 2);

        container.x = Math.random() * (400 - 20) + 20;
        container.y = Math.random() * (-100 - 50) + -50;

        let textStyle = new PIXI.TextStyle({ 
            fontFamily: 'Poppins', 
            fontSize: 16,
            align: 'center',
            fill: 0xffffff
        });
        let text = new PIXI.Text(word, textStyle);
        let textMetrics = PIXI.TextMetrics.measureText(word, textStyle);

        text.anchor.set(0.5);
        text.y = 30;

        let block = new PIXI.Sprite.from(PIXI.Texture.WHITE);
        block.anchor.set(0.5);
        block.width = textMetrics.width;
        block.height = textMetrics.height;
        block.tint = 0x000000;
        block.y = 30;

        this.ship = sprite;
        container.addChild(this.ship);

        this.blackBar = block;
        container.addChild(this.blackBar);

        this.text = text;
        container.addChild(this.text);

        this.entity = container;

        this.life = word.length;
        this.tag = "enemy";
        this.word = word;
        this.originalWord = word;
        this.target = target;
        this.alertTime = Math.floor(Math.random() * 3000) + 1000;

        this.playerDelta = new AngleDelta(
            this.entity.x,
            this.entity.y,
            this.target.entity.x,
            this.target.entity.y
        );
    }


    draw = (delta) => {
        if (this.targeted) {
            this.text.style.fill = 0xff8f00;
        } else {
            this.text.style.fill = 0xffffff;
        }

        this.drawWord();
    }


    drawWord = () => {
        let textMetrics = PIXI.TextMetrics.measureText(this.word, this.text.style);
        this.blackBar.width = textMetrics.width + 10;

        if (this.word === '') {
            this.blackBar.alpha = 0;   
        }

        this.text.text = this.word;
    }

    onEvent = () => {}

    onUpdate = (delta) => {
        if(this.dying) {
            this.ship.alpha -= 0.1 * delta;
        }

        let vec = this.playerDelta.getVector(this.playerDelta.distance, this.playerDelta.angle);

        this.entity.x += vec.x * (delta / 1000);
        this.entity.y += vec.y * (delta / 1000);
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
}


export default Enemy;
