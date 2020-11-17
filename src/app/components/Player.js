import Bullet from "components/Bullet";
import { createIdenticon } from 'foundation/Identicon';
import { events } from 'foundation/components/Emitter';
import Game from "../Game";

import * as PIXI from 'pixi.js';



class Player {
    entity;

    width = 50;
    height = 50;
    target;

    constructor(playerName, x, y) {
        let container = new PIXI.Container();
        let sprite = new PIXI.Sprite.from(createIdenticon(playerName));

        // Move anchor to the middle
        sprite.anchor.set(0.5);
        container.addChild(sprite);

        // Center the sprite inside the container
        container.pivot.x = Math.round(container.width / 2);
        container.pivot.y = Math.round(container.height / 2);

        // Move container to player position
        container.x = x;
        container.y = y;

        this.entity = container;
    }

    shouldResetTarget = (key) => {
        return key.toLowerCase() == 'backspace' && this.target !== null;
    }

    onUpdate = () => {}

    draw = () => {}

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
        enemies = enemies.sort((a, b) => a.entity.y - b.entity.y);

        // Get the closest one
        let enemy = enemies.pop();

        this.target = enemy;
        this.target.isTargeted(true);

        return this.target;
    }

    makeAttack = (target, key) => {
        let missed = true;

        if (target.word.toLowerCase().startsWith(key.toLowerCase())) {
            Game.add(new Bullet(this.entity.x, this.entity.y, target))

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
