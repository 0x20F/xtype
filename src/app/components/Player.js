import Bullet from "components/Bullet";
import Entity from "foundation/components/Entity";
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
        if (this.target) {
            return this.target;
        }

        // Find all enemies that start with your key
        let enemies = Game.find('enemy').filter(e => 
            e.word.toLowerCase().startsWith(key.toLowerCase())
        );

        if (enemies.length === 0) {
            return;
        }

        // Sort them based on distance from the player
        enemies = enemies.sort((a, b) => a.vector.y - b.vector.y);

        // Get the closest one
        let enemy = enemies.pop();

        this.target = enemy;
        this.target.targeted = true;

        return this.target;
    }

    makeAttack = (target, key) => {
        let missed = true;

        if (target.word.toLowerCase().startsWith(key.toLowerCase())) {
            Game.add(new Bullet(this.vector.x, this.vector.y, target))

            target.takeHit();

            if (target.isDead()) {
                this.target = null;
            }

            missed = false;
        }

        this.emit('shotFired', missed);
    }
}


export default Player;
