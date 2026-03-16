/**
 * Tests for formatter utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatMagnitude,
  formatDepth,
  formatDateTime,
  formatCoordinates,
  getMagnitudeSeverity,
  calculateMarkerSize,
  formatLocation,
  formatFeltReports
} from '../formatters.js';

describe('formatters', () => {
  describe('formatMagnitude', () => {
    it('should format magnitude with one decimal place', () => {
      expect(formatMagnitude(5.67)).toBe('5.7');
      expect(formatMagnitude(3)).toBe('3.0');
    });

    it('should handle null/undefined values', () => {
      expect(formatMagnitude(null)).toBe('N/A');
      expect(formatMagnitude(undefined)).toBe('N/A');
    });
  });

  describe('formatDepth', () => {
    it('should format depth with km unit', () => {
      expect(formatDepth(10.5)).toBe('10.5 km');
      expect(formatDepth(0)).toBe('0.0 km');
    });

    it('should handle null/undefined values', () => {
      expect(formatDepth(null)).toBe('N/A');
      expect(formatDepth(undefined)).toBe('N/A');
    });
  });

  describe('formatCoordinates', () => {
    it('should format coordinates with direction indicators', () => {
      expect(formatCoordinates(40.7128, -74.0060)).toBe('40.7128°N, 74.0060°W');
      expect(formatCoordinates(-33.8688, 151.2093)).toBe('33.8688°S, 151.2093°E');
    });

    it('should handle null/undefined values', () => {
      expect(formatCoordinates(null, null)).toBe('N/A');
      expect(formatCoordinates(undefined, undefined)).toBe('N/A');
    });
  });

  describe('getMagnitudeSeverity', () => {
    it('should return correct severity levels', () => {
      expect(getMagnitudeSeverity(2.5).label).toBe('Minor');
      expect(getMagnitudeSeverity(4.0).label).toBe('Light');
      expect(getMagnitudeSeverity(6.0).label).toBe('Moderate');
      expect(getMagnitudeSeverity(8.0).label).toBe('Major');
    });

    it('should handle null/undefined values', () => {
      expect(getMagnitudeSeverity(null).label).toBe('Minor');
      expect(getMagnitudeSeverity(undefined).label).toBe('Minor');
    });
  });

  describe('calculateMarkerSize', () => {
    it('should return appropriate marker sizes', () => {
      expect(calculateMarkerSize(1.0)).toBeGreaterThanOrEqual(5);
      expect(calculateMarkerSize(5.0)).toBeGreaterThan(calculateMarkerSize(3.0));
      expect(calculateMarkerSize(8.0)).toBeLessThanOrEqual(25);
    });

    it('should handle null/undefined values', () => {
      expect(calculateMarkerSize(null)).toBe(5);
      expect(calculateMarkerSize(undefined)).toBe(5);
    });
  });

  describe('formatLocation', () => {
    it('should clean location strings', () => {
      expect(formatLocation('23km NNE of Los Angeles, CA')).toBe('Los Angeles, CA');
      expect(formatLocation('45km SW of Tokyo, Japan')).toBe('Tokyo, Japan');
    });

    it('should handle locations without distance prefixes', () => {
      expect(formatLocation('California')).toBe('California');
    });

    it('should handle null/undefined values', () => {
      expect(formatLocation(null)).toBe('Unknown Location');
      expect(formatLocation(undefined)).toBe('Unknown Location');
    });
  });

  describe('formatFeltReports', () => {
    it('should format felt reports correctly', () => {
      expect(formatFeltReports(0)).toBe('No reports');
      expect(formatFeltReports(1)).toBe('1 report');
      expect(formatFeltReports(100)).toBe('100 reports');
      expect(formatFeltReports(1500)).toBe('1,500 reports');
    });

    it('should handle null/undefined values', () => {
      expect(formatFeltReports(null)).toBe('No reports');
      expect(formatFeltReports(undefined)).toBe('No reports');
    });
  });
});