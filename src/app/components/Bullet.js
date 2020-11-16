import AngleDelta from 'foundation/math/AngleDelta';
import { createIdenticon } from 'foundation/Identicon';
import Game from "../Game";

import * as PIXI from 'pixi.js';


const bulletSprite = createIdenticon('bullet');


class Bullet {
    entity;
    sprite;

    width = 10;
    height = 10;

    target;
    enemyDelta;

    constructor(x, y, target) {
        let container = new PIXI.Container();
        let sprite = new PIXI.Sprite.from(bulletSprite);

        sprite.anchor.set(0.5);
        sprite.width = this.width;
        sprite.height = this.height;

        container.pivot.x = Math.round(container.width / 2);
        container.pivot.y = Math.round(container.height / 2);

        container.x = x;
        container.y = y;

        this.sprite = sprite;
        container.addChild(this.sprite);

        this.entity = container;

        this.target = target;

        // These never changev
        this.enemyDelta = new AngleDelta(
            this.entity.x,
            this.entity.y,
            this.target.entity.x,
            this.target.entity.y
        );
    }


    onEvent = () => {}


    onUpdate = (delta) => {
        if (this.target.dead || this.target.dying) {
            this.sprite.alpha -= 0.1 * (delta / 2);
        }

        let vec = this.enemyDelta.getVector(this.enemyDelta.distance, this.enemyDelta.angle);

        this.entity.x += vec.x * (delta / 30);
        this.entity.y += vec.y * (delta / 30);

        if (this.hit()) {
            this.target.takeDamage();
            Game.remove(this);
        }
    }


    hit = () => {
        let t = this.target;
        let ty = t.entity.y;

        if (
            this.entity.y > ty && this.entity.y < ty + t.height
        ) {
            return true;
        }

        return false;
    }

    draw = () => {};
}


export default Bullet;
