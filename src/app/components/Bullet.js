import AngleDelta from 'foundation/math/AngleDelta';
import Entity from "foundation/components/Entity";
import Sprite from "foundation/Sprite";
import { createIdenticon } from 'foundation/Identicon';
import Game from "../Game";


const bulletSprite = createIdenticon('bullet');


class Bullet extends Entity {

    width = 10;
    height = 10;

    target;
    enemyDelta;

    constructor(x, y, target) {
        super(new Sprite(bulletSprite, 10, 10));

        this.vector.x = x;
        this.vector.y = y;

        this.target = target;

        // These never changev
        this.enemyDelta = new AngleDelta(
            this.vector.x,
            this.vector.y,
            this.target.vector.x,
            this.target.vector.y
        );
    }


    onUpdate = (timeDelta) => {
        let vec = this.enemyDelta.getVector(this.enemyDelta.distance, this.enemyDelta.angle);

        this.vector.x += vec.x * (timeDelta / 30);
        this.vector.y += vec.y * (timeDelta / 30);

        if (this.hit()) {
            this.target.takeDamage();
            Game.remove(this);
        }
    }


    hit = () => {
        let t = this.target;
        let ty = t.vector.y;

        if (
            this.vector.y > ty && this.vector.y < ty + t.height
        ) {
            return true;
        }

        return false;
    }


    draw = (context) => {
        context.fillStyle = '#272f3a';

        context.beginPath();
        context.arc(this.vector.x, this.vector.y, 6, 0, 2 * Math.PI);
        context.fill();
    }
}


export default Bullet;
