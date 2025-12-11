export default {
  roundOrDecimals(value: string){
    let number = parseFloat(value); 

    if (number % 1 !== 0) return Math.round( number * 100) / 100;

    return value;
  },

  // Función para calcular la distancia entre dos coordenadas (fórmula de Haversine)
  calculateDistance (lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  },

  // thresholdEqual(a, b, threshold = Number.EPSILON) {
  //   return Math.abs(a - b) < threshold
  // },
}