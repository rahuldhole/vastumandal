"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("./index");
(0, vitest_1.describe)("core-math tests", () => {
    (0, vitest_1.describe)("getUnitWeight", () => {
        (0, vitest_1.it)("should calculate correct weight for 10mm bar", () => {
            // 10^2 / 162.2 = 0.6165...
            (0, vitest_1.expect)((0, index_1.getUnitWeight)(10)).toBeCloseTo(0.6165, 3);
        });
        (0, vitest_1.it)("should calculate correct weight for 16mm bar", () => {
            // 16^2 / 162.2 = 1.578...
            (0, vitest_1.expect)((0, index_1.getUnitWeight)(16)).toBeCloseTo(1.578, 3);
        });
    });
    (0, vitest_1.describe)("calculateTotalWeight", () => {
        (0, vitest_1.it)("should calculate total weight for 4 members of 12mm bar, 5m long", () => {
            // Unit weight of 12mm is 144 / 162.2 = 0.88779...
            // Total = 0.88779 * 5m * 4 qty = 17.755...
            (0, vitest_1.expect)((0, index_1.calculateTotalWeight)(12, 5, 4)).toBeCloseTo(17.755, 2);
        });
    });
    (0, vitest_1.describe)("calculateStirrupCount", () => {
        (0, vitest_1.it)("should calculate count based on span and spacing", () => {
            (0, vitest_1.expect)((0, index_1.calculateStirrupCount)(3000, 150)).toBe(21); // (3000/150) + 1
            (0, vitest_1.expect)((0, index_1.calculateStirrupCount)(4000, 200)).toBe(21);
        });
        (0, vitest_1.it)("should handle non-divisible spans correctly", () => {
            // 3050 / 150 = 20.33 => 20 + 1 = 21
            (0, vitest_1.expect)((0, index_1.calculateStirrupCount)(3050, 150)).toBe(21);
        });
        (0, vitest_1.it)("should handle zero or tiny span", () => {
            (0, vitest_1.expect)((0, index_1.calculateStirrupCount)(0, 150)).toBe(1);
        });
    });
    (0, vitest_1.describe)("BendRules", () => {
        (0, vitest_1.it)("should calculate correct deduction for 90 degree bend based on IS", () => {
            (0, vitest_1.expect)(index_1.BendRules['IS'].deduction90(16)).toBe(32);
            (0, vitest_1.expect)(index_1.BendRules['IS'].deduction90(10)).toBe(20);
        });
        (0, vitest_1.it)("should calculate correct allowance for 135 degree stirrup hook based on IS", () => {
            (0, vitest_1.expect)(index_1.BendRules['IS'].allowance135(8)).toBe(80);
            (0, vitest_1.expect)(index_1.BendRules['IS'].allowance135(12)).toBe(120);
        });
    });
});
