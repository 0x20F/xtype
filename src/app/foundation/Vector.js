class Vector {
    x;
    y;
    z;

    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getAngleFrom(vector) {
        return Math.atan2(vector.y - this.y, vector.x - this.x) - (90 * Math.PI / 180)
    }
}


export default Vector;