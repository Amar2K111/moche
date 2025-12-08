/**
 * Calculates percentile ranking based on score using a realistic distribution curve.
 * Higher scores are exponentially rarer, reflecting that most people score in the middle range.
 * 
 * Distribution breakdown (piecewise linear mapping):
 * - 99-100: Top 0.0001% (returns 0.0001)
 * - 95-98: Top 0.001-0.004% (linearly scaled)
 * - 90-94: Top 0.01-0.05% (linearly scaled)
 * - 85-89: Top 0.1-0.5% (linearly scaled)
 * - 80-84: Top 1-5% (linearly scaled)
 * - 70-79: Top 5-50% (linearly scaled)
 * - Below 70: 50-100% (linearly scaled)
 * 
 * @param score - The score value (0-100)
 * @returns Percentile rank as a number (e.g., 5.0 means top 5%, 0.0001 means top 0.0001%)
 */
export function calculatePercentile(score: number): number {
  // Clamp score to valid range
  const clampedScore = Math.max(0, Math.min(100, score));
  
  // Piecewise linear mapping: each range maps to a percentile range
  // Format: [minScore, maxScore, minPercentile, maxPercentile]
  const ranges: Array<[number, number, number, number]> = [
    [99, 100, 0.0001, 0.0001],    // 99-100 → 0.0001%
    [95, 98.99, 0.001, 0.004],    // 95-98 → 0.001-0.004%
    [90, 94.99, 0.01, 0.05],      // 90-94 → 0.01-0.05%
    [85, 89.99, 0.1, 0.5],        // 85-89 → 0.1-0.5%
    [80, 84.99, 1, 5],            // 80-84 → 1-5%
    [70, 79.99, 5, 50],           // 70-79 → 5-50%
    [0, 69.99, 50, 100],          // <70 → 50-100%
  ];
  
  // Find the appropriate range and linearly interpolate
  for (const [minScore, maxScore, minPercentile, maxPercentile] of ranges) {
    if (clampedScore >= minScore && clampedScore <= maxScore) {
      // Linear interpolation within the range
      const scoreRange = maxScore - minScore;
      const percentileRange = maxPercentile - minPercentile;
      
      if (scoreRange === 0) {
        // Single point range
        return minPercentile;
      }
      
      // Calculate position within the range (0 to 1)
      const position = (clampedScore - minScore) / scoreRange;
      
      // Map to percentile (higher score = lower percentile for "top X%")
      // We invert position so higher scores give lower percentiles
      const percentile = maxPercentile - (position * percentileRange);
      
      return Math.max(minPercentile, Math.min(maxPercentile, percentile));
    }
  }
  
  // Fallback (should never reach here due to 0-100 coverage)
  return 100;
}
