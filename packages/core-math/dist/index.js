"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBendRules = exports.BendRules = exports.RegionalStandards = void 0;
exports.getUnitWeight = getUnitWeight;
exports.calculateTotalWeight = calculateTotalWeight;
exports.calculateStirrupCount = calculateStirrupCount;
/**
 * Calculates the weight of a single rebar in kg/m based on its diameter.
 * Formula: D^2 / 162.2
 *
 * @param diameter Diameter of the rebar in mm
 * @returns Weight in kg/m
 */
function getUnitWeight(diameter) {
    return Math.pow(diameter, 2) / 162.2;
}
/**
 * Calculates the total weight of rebar elements in a group.
 *
 * @param diameter Diameter of the rebar in mm
 * @param length Length of one bar in meters
 * @param quantity Total number of bars
 * @returns Total weight in kg
 */
function calculateTotalWeight(diameter, length, quantity) {
    const unitWeight = getUnitWeight(diameter);
    return unitWeight * length * quantity;
}
exports.RegionalStandards = {
    IS: 'IS',
    BS: 'BS',
    ACI: 'ACI',
};
/**
 * Hook and bend allowance rules.
 */
exports.BendRules = {
    'IS': {
        /** IS: 90 degree bend deduction (2 * D) */
        deduction90: (diameter) => 2 * diameter,
        /** IS: 135 degree stirrup hook allowance (10 * D) */
        allowance135: (diameter) => 10 * diameter,
    },
    'BS': {
        /** BS: 90 degree bend deduction (typically 2 * D depending on radius, using 2D for simplicity) */
        deduction90: (diameter) => 2 * diameter,
        /** BS: 135 degree stirrup hook allowance (typically 12 * D or based on min radius) */
        allowance135: (diameter) => 12 * diameter,
    },
    'ACI': {
        /** ACI: 90 degree bend deduction (approx 2 * D) */
        deduction90: (diameter) => 2 * diameter,
        /** ACI: 135 degree stirrup hook allowance (6 * D or 3 inches max, simplified to 6 * D) */
        allowance135: (diameter) => 6 * diameter, // Can be configured further
    }
};
/** Default active bend rules (Fallback to IS for backward compatibility) */
exports.DefaultBendRules = exports.BendRules['IS'];
/**
 * Stirrup count calculator
 *
 * @param clearSpan Clear span in mm
 * @param spacing Spacing in mm
 * @returns Number of stirrups
 */
function calculateStirrupCount(clearSpan, spacing) {
    return Math.floor(clearSpan / spacing) + 1;
}
