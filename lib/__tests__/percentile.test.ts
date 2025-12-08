import { calculatePercentile } from '../percentile'

describe('calculatePercentile', () => {
  describe('validates output is always in valid range', () => {
    it('should never return percentile > 100', () => {
      // Test all integer scores from 0 to 100
      for (let score = 0; score <= 100; score++) {
        const percentile = calculatePercentile(score)
        expect(percentile).toBeLessThanOrEqual(100)
        expect(percentile).toBeGreaterThanOrEqual(0)
      }
    })

    it('should clamp scores outside 0-100 range', () => {
      expect(calculatePercentile(-10)).toBe(calculatePercentile(0))
      expect(calculatePercentile(150)).toBe(calculatePercentile(100))
    })
  })

  describe('representative score mappings', () => {
    it('should map score 70 to 5-50% range (at boundary should be 50%)', () => {
      const percentile = calculatePercentile(70)
      expect(percentile).toBe(50)
    })

    it('should map score 80 to 1-5% range (at boundary should be 5%)', () => {
      const percentile = calculatePercentile(80)
      expect(percentile).toBe(5)
    })

    it('should map score 85 to 0.1-0.5% range (at boundary should be 0.5%)', () => {
      const percentile = calculatePercentile(85)
      expect(percentile).toBe(0.5)
    })

    it('should map score 90 to 0.01-0.05% range (at boundary should be 0.05%)', () => {
      const percentile = calculatePercentile(90)
      expect(percentile).toBe(0.05)
    })

    it('should map score 95 to 0.001-0.004% range (at boundary should be 0.004%)', () => {
      const percentile = calculatePercentile(95)
      expect(percentile).toBeCloseTo(0.004, 6)
    })

    it('should map score 99 to 0.0001%', () => {
      const percentile = calculatePercentile(99)
      expect(percentile).toBe(0.0001)
    })

    it('should map score 100 to 0.0001%', () => {
      const percentile = calculatePercentile(100)
      expect(percentile).toBe(0.0001)
    })
  })

  describe('piecewise range validations', () => {
    it('should map scores <70 to 50-100% range', () => {
      const score0 = calculatePercentile(0)
      const score35 = calculatePercentile(35)
      const score69 = calculatePercentile(69)
      
      expect(score0).toBeCloseTo(100, 2)
      expect(score35).toBeGreaterThan(50)
      expect(score35).toBeLessThan(100)
      expect(score69).toBeGreaterThan(50)
      expect(score69).toBeLessThan(55) // Close to 50% boundary
    })

    it('should map scores 70-79 to 5-50% range', () => {
      const score70 = calculatePercentile(70)
      const score75 = calculatePercentile(75)
      const score79 = calculatePercentile(79)
      
      expect(score70).toBeCloseTo(50, 2)
      expect(score75).toBeGreaterThan(5)
      expect(score75).toBeLessThan(50)
      expect(score79).toBeGreaterThan(5)
      expect(score79).toBeLessThan(10) // Close to 5% boundary
    })

    it('should map scores 80-84 to 1-5% range', () => {
      const score80 = calculatePercentile(80)
      const score82 = calculatePercentile(82)
      const score84 = calculatePercentile(84)
      
      expect(score80).toBeCloseTo(5, 2)
      expect(score82).toBeGreaterThan(1)
      expect(score82).toBeLessThan(5)
      expect(score84).toBeGreaterThan(1)
      expect(score84).toBeLessThan(2) // Close to 1% boundary
    })

    it('should map scores 85-89 to 0.1-0.5% range', () => {
      const score85 = calculatePercentile(85)
      const score87 = calculatePercentile(87)
      const score89 = calculatePercentile(89)
      
      expect(score85).toBeCloseTo(0.5, 4)
      expect(score87).toBeGreaterThan(0.1)
      expect(score87).toBeLessThan(0.5)
      expect(score89).toBeGreaterThan(0.1)
      expect(score89).toBeLessThan(0.2) // Close to 0.1% boundary (with interpolation)
    })

    it('should map scores 90-94 to 0.01-0.05% range', () => {
      const score90 = calculatePercentile(90)
      const score92 = calculatePercentile(92)
      const score94 = calculatePercentile(94)
      
      expect(score90).toBeCloseTo(0.05, 6)
      expect(score92).toBeGreaterThan(0.01)
      expect(score92).toBeLessThan(0.05)
      expect(score94).toBeGreaterThan(0.01)
      expect(score94).toBeLessThan(0.02) // Close to 0.01% boundary (with interpolation)
    })

    it('should map scores 95-98 to 0.001-0.004% range', () => {
      const score95 = calculatePercentile(95)
      const score96 = calculatePercentile(96)
      const score98 = calculatePercentile(98)
      
      expect(score95).toBeCloseTo(0.004, 6)
      expect(score96).toBeGreaterThan(0.001)
      expect(score96).toBeLessThan(0.004)
      expect(score98).toBeGreaterThan(0.001)
      expect(score98).toBeLessThan(0.002) // Close to 0.001% boundary (with interpolation)
    })

    it('should map scores 99-100 to 0.0001%', () => {
      const score99 = calculatePercentile(99)
      const score100 = calculatePercentile(100)
      
      expect(score99).toBe(0.0001)
      expect(score100).toBe(0.0001)
    })
  })

  describe('monotonicity validation', () => {
    it('should be monotonically decreasing (higher score = lower percentile)', () => {
      const scores = [0, 20, 40, 60, 70, 75, 80, 85, 90, 95, 99, 100]
      const percentiles = scores.map(s => calculatePercentile(s))
      
      for (let i = 1; i < percentiles.length; i++) {
        expect(percentiles[i]).toBeLessThanOrEqual(percentiles[i - 1])
      }
    })

    it('should show decreasing percentiles across all integer scores', () => {
      for (let score = 1; score <= 100; score++) {
        const current = calculatePercentile(score)
        const previous = calculatePercentile(score - 1)
        expect(current).toBeLessThanOrEqual(previous)
      }
    })
  })

  describe('edge cases and boundaries', () => {
    it('should handle exact boundary transitions correctly', () => {
      // Test that boundaries transition smoothly
      const score69_99 = calculatePercentile(69.99)
      const score70 = calculatePercentile(70)
      expect(Math.abs(score69_99 - score70)).toBeLessThan(1) // Should be close

      const score79_99 = calculatePercentile(79.99)
      const score80 = calculatePercentile(80)
      expect(Math.abs(score79_99 - score80)).toBeLessThan(1)
    })

    it('should handle decimal scores correctly', () => {
      const score75_5 = calculatePercentile(75.5)
      expect(score75_5).toBeGreaterThan(0)
      expect(score75_5).toBeLessThan(100)
      
      // Should be between 70 and 80 percentile values
      const score75 = calculatePercentile(75)
      const score76 = calculatePercentile(76)
      expect(score75_5).toBeLessThanOrEqual(score75)
      expect(score75_5).toBeGreaterThanOrEqual(score76)
    })
  })

  describe('realistic usage scenarios', () => {
    it('should classify ultra-rare scores correctly (99-100)', () => {
      // Top 0.0001% - one in a million
      expect(calculatePercentile(100)).toBe(0.0001)
      expect(calculatePercentile(99)).toBe(0.0001)
    })

    it('should classify excellent scores correctly (90-94)', () => {
      // Top 0.01-0.05%
      const score92 = calculatePercentile(92)
      expect(score92).toBeGreaterThan(0.01)
      expect(score92).toBeLessThan(0.05)
    })

    it('should classify very good scores correctly (85-89)', () => {
      // Top 0.1-0.5%
      const score87 = calculatePercentile(87)
      expect(score87).toBeGreaterThan(0.1)
      expect(score87).toBeLessThan(0.5)
    })

    it('should classify good scores correctly (80-84)', () => {
      // Top 1-5%
      const score82 = calculatePercentile(82)
      expect(score82).toBeGreaterThan(1)
      expect(score82).toBeLessThan(5)
    })

    it('should classify above-average scores correctly (70-79)', () => {
      // Top 5-50%
      const score75 = calculatePercentile(75)
      expect(score75).toBeGreaterThan(5)
      expect(score75).toBeLessThan(50)
    })

    it('should classify below-average scores correctly (<70)', () => {
      // 50-100% (bottom half)
      const score50 = calculatePercentile(50)
      const score30 = calculatePercentile(30)
      expect(score50).toBeGreaterThan(50)
      expect(score50).toBeLessThan(100)
      expect(score30).toBeGreaterThan(50)
      expect(score30).toBeLessThan(100)
    })
  })

  describe('linear interpolation within ranges', () => {
    it('should interpolate linearly within 70-79 range', () => {
      const score70 = calculatePercentile(70)  // Should be ~30%
      const score75 = calculatePercentile(75)  // Should be midpoint
      const score79 = calculatePercentile(79)  // Should be ~5%
      
      // Midpoint should be approximately halfway between endpoints
      const expectedMidpoint = (score70 + score79) / 2
      // Allow some tolerance since 75 is the exact breakpoint
      expect(score75).toBeGreaterThan(expectedMidpoint - 3)
      expect(score75).toBeLessThan(expectedMidpoint + 3)
    })

    it('should interpolate linearly within 80-84 range', () => {
      const score80 = calculatePercentile(80)  // Should be ~5%
      const score82 = calculatePercentile(82)  // Should be midpoint
      const score84 = calculatePercentile(84)  // Should be ~1%
      
      const expectedMidpoint = (score80 + score84) / 2
      expect(score82).toBeCloseTo(expectedMidpoint, 1)
    })
  })
})
