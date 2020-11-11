import Vector from "foundation/Vector";

class Entity {
    sprite;
    angle = 0;
    spawned;
    tag = "entity";

    constructor(sprite) {
        this.sprite = sprite;
        this.vector = new Vector(0,0,0);

        this.spawned = performance.now();
    }

    timeSinceSpawned = () => {
        return performance.now() - this.spawned;
    }

    onUpdate = (timeDelta) => {

    }

    onEvent = (eventType, event) => {

    }

    draw = (context) => {
        context.save();

        context.translate(this.vector.x, this.vector.y)
        this.sprite.draw(context);

        context.restore();
    }
}


export default Entity;