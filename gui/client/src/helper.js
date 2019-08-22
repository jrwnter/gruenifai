export const getMinY = (data) => {
    let minVal = Math.floor(data.reduce((min, iteration) => iteration.scoreRange[0] < min ? iteration.scoreRange[0] : min, 1) * 10) / 10;
    return minVal;
}

export const getMaxY = (data) => {
    let maxVal = Math.ceil(data.reduce((max, iteration) => iteration.scoreRange[1] > max ? iteration.scoreRange[1] : max, 0) * 10) / 10;
    return maxVal;
}
