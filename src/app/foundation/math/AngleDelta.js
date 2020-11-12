class AngleDelta {
    x;
    y;

    distance;
    angle;

    constructor(x1, y1, x2, y2) {
        let x = x2 - x1;
        let y = y2 - y1;

        this.distance = Math.sqrt(x * x + y * y);
        this.angle = Math.atan2(y, x) * 180 / Math.PI;
    }

    getVector = (magnitude, angle) => {
        let angleRadians = (angle * Math.PI) / 180;

        this.x = magnitude * Math.cos(angleRadians);
        this.y = magnitude * Math.sin(angleRadians);

        return this;
    }
}


export default AngleDelta;