import * as PIXI from 'pixi.js';


class Entity {
    container;
    parts = {};

    spawned;
    tag = "entity";


    constructor(x, y) {
        // Create a container to contain everything
        let container = new PIXI.Container();

        // Center children inside the container
        container.pivot.x = Math.round(container.width / 2);
        container.pivot.y = Math.round(container.height / 2);

        // Move container to desired position
        container.x = x;
        container.y = y;

        this.container = container;

        this.spawned = performance.now();
    }


    /**
     * Find out how long the entity has been 
     * alive
     */
    timeSinceSpawned = () => {
        return performance.now() - this.spawned;
    }


    /**
     * Generate a sprite for this entity with
     * all the useful default configuration.
     * 
     * @param {string} from Data Url or http link to an image
     */
    sprite = (from) => {
        let sprite = new PIXI.Sprite.from(from);
        
        // Set the pivot point in the center
        sprite.anchor.set(0.5);

        this.parts.sprite = sprite;
        this.container.addChild(this.parts.sprite);

        return this.parts.sprite;
    }


    /**
     * Get a specific part from this entity
     * 
     * @param {string} key 
     */
    part = (key) => {
        return this.parts[key];
    }


    /**
     * Add a part to the entity
     * 
     * @param {string} key 
     * @param {object} value 
     */
    add = (key, value) => {
        this.parts[key] = value;
        this.container.addChild(value);
    }


    onUpdate = (delta) => {}


    onEvent = (eventType, event) => {}


    draw = (delta) => {}
}


export default Entity;
