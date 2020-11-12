import Bullet from "components/Bullet";
import Entity from "foundation/Entity";
import Sprite from "foundation/Sprite";
import { createIdenticon } from 'foundation/Identicon';
import Game from "../Game";

class Player extends Entity {
    x;
    y;

    width = 50;
    height = 50;
    target;

    color = 'white';
    strokeColor = 'red';

    constructor(x, y, playerName) {
        super(new Sprite(createIdenticon(playerName), 50, 50));
        this.vector.x = x;
        this.vector.y = y;
    }

    shouldResetTarget = (key) => {
        return key.toLowerCase() == 'backspace' && this.target !== null;
    }

    onEvent = (eventType, event) => {
        if (eventType === 'keydown') {
            const { key } = event;

            if (this.shouldResetTarget(key)) {
                this.target.targeted = false;
                this.target = null;
            }


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
