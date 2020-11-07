import AngleDelta from 'foundation/AngleDelta';


class Bullet {
    x;
    y;

    initialX;
    initialY;

    width = 10;
    height = 10;

    color = 'yellow';
    context;

    target;


    constructor(context, x, y, target) {
        this.context = context;
        this.x = x;
        this.y = y;

        // These never change
        this.initialX = x;
        this.initialY = y;

        this.target = target;
    }


    draw = () => {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }


    move = (timeDelta) => {
        let enemyDelta = new AngleDelta(
            this.initialX,
            this.initialY,
            this.target.x,
            this.target.y
        );
        let vec = enemyDelta.getVector(enemyDelta.distance, enemyDelta.angle);

        this.x += vec.x * (timeDelta / 30);
        this.y += vec.y * (timeDelta / 30);
    }


    hit = () => {
        let t = this.target;
        let tx = t.x;
        let ty = t.y;

        if (
            this.x > tx - t.width / 2 && this.x < tx + t.width / 2 &&
            this.y > ty && this.y < ty + t.height
        ) {
            // Wait until the last bullet hits, then register the kill
            if (this.target.word === '') {
                this.target.die();
            }

            return true;
        }

        return false;
    }
}


export default Bullet;