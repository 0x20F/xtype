import Vector from "foundation/math/Vector";

class Entity {
    sprite;
    angle = 0;
    spawned;
    tag = "entity";
    emitter;

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

    withEmitter = emitter => {
        this.emitter = emitter;
        return this;
    }

    emit = (e, ...data) => {
        this.emitter.emit(e, ...data);
    }
}


export default Entity;