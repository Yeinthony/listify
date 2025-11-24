export default {
  roundOrDecimals(value: string){
    let number = parseFloat(value); 

    if (number % 1 !== 0) return Math.round( number * 100) / 100;

    return value;
  },

  // thresholdEqual(a, b, threshold = Number.EPSILON) {
  //   return Math.abs(a - b) < threshold
  // },
}