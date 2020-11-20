const MIN_VELOCITY = .475;
const MAX_VELOCITY = 4;
const DIFF_PER_WAVE = 0.025;

export default class Velocity {
    maxVelocity = MAX_VELOCITY;
    minVelocity = MIN_VELOCITY;
    velocity = MIN_VELOCITY;
    wave = 0;

    calculate = (wave) => {
        if (this._hasReachedMaximumVelocity()) {
            return this.maxVelocity;
        }

        if (this.wave != wave) {
            this.velocity += DIFF_PER_WAVE;
            this.wave = wave;
        }

        console.log(this.velocity);
        return this.velocity;
    }

    _hasReachedMaximumVelocity = () => {
        return this.velocity >= this.maxVelocity;
    }

}
