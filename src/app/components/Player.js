import Bullet from "components/Bullet";
import { createIdenticon } from 'foundation/Identicon';
import { events } from 'foundation/components/Emitter';
import Entity from 'foundation/components/Entity';
import Game from "../Game";



class Player extends Entity {
    width = 50;
    height = 50;
    target;
    name;


    constructor(playerName, x, y) {
        super(x, y);

        this.name = playerName;
        this.sprite(createIdenticon(playerName));
    }


    shouldResetTarget = (key) => {
        return key.toLowerCase() == 'backspace' && this.target !== null;
    }


    onEvent = (eventType, event) => {
        if (eventType !== 'keydown') {
            return;
        }

        const { key } = event;

        if (this.shouldResetTarget(key)) {
            this.target.isTargeted(false);
            this.target = null;
        }

        let target = this.getTarget(key);
        if (target) {
            this.makeAttack(target, key);
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
        enemies = enemies.sort((a, b) => a.container.y - b.container.y);

        // Get the closest one
        let enemy = enemies.pop();

        this.target = enemy;
        this.target.isTargeted(true);

        return this.target;
    }


    makeAttack = (target, key) => {
        let missed = true;

        if (target.word.toLowerCase().startsWith(key.toLowerCase())) {
            Game.add(new Bullet(this.container.x, this.container.y, target))

            target.takeHit();

            if (target.isDead()) {
                this.target = null;
            }

            missed = false;
        }

        events.emit('shotFired', missed);
    }
}


export default Player;
