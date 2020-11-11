import AngleDelta from 'foundation/AngleDelta';
import Entity from "foundation/Entity";
import Sprite from "foundation/Sprite";
import Identicon from "identicon.js";
import { hashFnv32a } from "foundation/HashFnv32a"
import Game from "../Game";


const hash = hashFnv32a('bullet', 12345) + hashFnv32a('bullet', 54321);
const src = 'data:image/svg+xml;base64,' + new Identicon(hash, {
    background: [24, 27, 33, 1],
    margin: 0,
    size: 20,
    saturation: 0.4,
    brightness: 0.4,
    format: 'svg'
}).toString();


class Bullet extends Entity {

    width = 10;
    height = 10;

    target;
    enemyDelta;

    constructor(x, y, target) {
        super(new Sprite(src, 10, 10));

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
        let tx = t.vector.x;
        let ty = t.vector.y;

        if (
            this.vector.y > ty && this.vector.y < ty + t.height
        ) {
            return true;
        }

        return false;
    }
}


export default Bullet;
