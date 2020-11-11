import Bullet from "components/Bullet";
import Entity from "foundation/Entity";
import Sprite from "foundation/Sprite";
import Identicon from "identicon.js";
import { hashFnv32a } from "foundation/HashFnv32a";
import Game from "../Game";

class Player extends Entity {
    x;
    y;

    width = 50;
    height = 50;
    target;

    color = 'white';
    strokeColor = 'red';

    constructor(x, y) {
        let hash = hashFnv32a('player', 12345) + hashFnv32a('player', 54321);
        let src = 'data:image/svg+xml;base64,' + new Identicon(hash, {
            background: [24, 27, 33, 1],
            margin: 0,
            size: 60,
            saturation: 0.4,
            brightness: 0.4,
            format: 'svg'
        }).toString();

        super(new Sprite(src, 50, 50));
        this.vector.x = x;
        this.vector.y = y;
    }

    onEvent = (eventType, event) => {
        if (eventType === 'keydown') {
            const { key } = event;

            let target = this.getTarget(key);
            if (target) {
                this.makeAttack(target, key);
            }
        }

    }

    getTarget = (key) => {
        if (!this.target) {
            let enemies = Game.find('enemy');

            for (let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];

                if (enemy.word.toLowerCase().startsWith(key.toLowerCase())) {
                    this.target = enemy;
                    this.target.targeted = true;
                    break;
                }
            }
        }

        return this.target;
    }

    makeAttack = (target, key) => {
        if (target.word.toLowerCase().startsWith(key.toLowerCase())) {
            Game.add(new Bullet(this.vector.x, this.vector.y, target))

            target.takeHit();

            if (target.isDead()) {
                this.target = null;
            }
        }
    }
}


export default Player;
