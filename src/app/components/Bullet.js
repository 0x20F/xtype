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
        if (this.target.dead || this.target.dying) {
            this.part('sprite').alpha -= 0.1 * (delta / 2);
        }

        let vec = this.enemyDelta.getVector(this.enemyDelta.distance, this.enemyDelta.angle);

        this.container.x += vec.x * (delta / 30);
        this.container.y += vec.y * (delta / 30);

        if (this.hit()) {
            this.target.takeDamage();
            Game.remove(this);
        }
    }


    hit = () => {
        let t = this.target;
        let ty = t.container.y;

        if (
            this.container.y > ty && this.container.y < ty + t.container.height
        ) {
            return true;
        }

        return false;
    }

    draw = () => {};
}


export default Bullet;
