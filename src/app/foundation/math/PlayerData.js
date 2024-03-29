/**
 * Calculate the accuracy of a player during
 * a specific wave. 
 * 
 * @param {object} wave Json object containing all data from a wave
 * 
 * @returns {number} A percentage with 2 decimals
 */
export const calculateAccuracy = wave => {
    const a = wave.shotsMissed ?? 1;
    const b = wave.shotsFired ?? 1;

    return ((1 - (a / b)) * 100);
}



/**
 * Calculate how fast the player was typing
 * during a given wave.
 * 
 * @param {object} wave Json object containing all data from a wave
 * 
 * @returns {number} Words Per Minute of the player with 2 decimals
 */
export const calculateWpm = wave => {
    let shotsHit = wave.shotsFired - wave.shotsMissed;
    let waveTime = (wave.waveEnd - wave.waveStart) / 1000 / 60;

    return ((shotsHit / 5) / waveTime);
}