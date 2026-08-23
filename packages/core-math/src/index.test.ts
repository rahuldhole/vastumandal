import { describe, it, expect } from "vitest";
import { getUnitWeight, calculateTotalWeight, calculateStirrupCount, BendRules, RegionalStandards } from "./index";

describe("core-math tests", () => {
  describe("getUnitWeight", () => {
    it("should calculate correct weight for 10mm bar", () => {
      // 10^2 / 162.2 = 0.6165...
      expect(getUnitWeight(10)).toBeCloseTo(0.6165, 3);
    });

    it("should calculate correct weight for 16mm bar", () => {
      // 16^2 / 162.2 = 1.578...
      expect(getUnitWeight(16)).toBeCloseTo(1.578, 3);
    });
  });

  describe("calculateTotalWeight", () => {
    it("should calculate total weight for 4 members of 12mm bar, 5m long", () => {
      // Unit weight of 12mm is 144 / 162.2 = 0.88779...
      // Total = 0.88779 * 5m * 4 qty = 17.755...
      expect(calculateTotalWeight(12, 5, 4)).toBeCloseTo(17.755, 2);
    });
  });

  describe("calculateStirrupCount", () => {
    it("should calculate count based on span and spacing", () => {
      expect(calculateStirrupCount(3000, 150)).toBe(21); // (3000/150) + 1
      expect(calculateStirrupCount(4000, 200)).toBe(21);
    });
    
    it("should handle non-divisible spans correctly", () => {
      // 3050 / 150 = 20.33 => 20 + 1 = 21
      expect(calculateStirrupCount(3050, 150)).toBe(21);
    });
    
    it("should handle zero or tiny span", () => {
      expect(calculateStirrupCount(0, 150)).toBe(1);
    });
  });

  describe("BendRules", () => {
    it("should calculate correct deduction for 90 degree bend based on IS", () => {
      expect(BendRules['IS'].deduction90(16)).toBe(32);
      expect(BendRules['IS'].deduction90(10)).toBe(20);
    });

    it("should calculate correct allowance for 135 degree stirrup hook based on IS", () => {
      expect(BendRules['IS'].allowance135(8)).toBe(80);
      expect(BendRules['IS'].allowance135(12)).toBe(120);
    });
  });
});
