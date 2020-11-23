import AngleDelta from 'foundation/math/AngleDelta';
import { createIdenticon } from 'foundation/Identicon';
import Entity from "foundation/components/Entity";
import Game from "../Game";


const bulletSprite = createIdenticon('bullet');


class Bullet extends Entity {
    width = 10;
    height = 10;

    target;
    enemyDelta;

    constructor(x, y, target) {
        super(x, y);

        this.sprite(bulletSprite);

        this.part('sprite').width = this.width;
        this.part('sprite').height = this.height;

        this.target = target;

        // These never changev
        this.enemyDelta = new AngleDelta(
            this.container.x,
            this.container.y,
            this.target.container.x,
            this.target.container.y
        );
    }


    onUpdate = (delta) => {
        let vec = this.enemyDelta.getVector(this.enemyDelta.distance, this.enemyDelta.angle);

        this.container.x += vec.x * (delta / 10);
        this.container.y += vec.y * (delta / 10);

        if (this.hit()) {
            this.target.takeDamage();
            Game.remove(this);
        }
    }


    hit = () => {
        if (
            this.container.x >= this.target.container.x - this.target.container.width / 2 &&
            this.container.x <= this.target.container.x + this.target.container.width / 2 &&
            this.container.y >= this.target.container.y - this.target.container.height / 2 &&
            this.container.y <= this.target.container.y + this.target.container.height / 2
        ) {
            return true;
        }

        return false;
    }

    draw = () => {};
}


export default Bullet;
