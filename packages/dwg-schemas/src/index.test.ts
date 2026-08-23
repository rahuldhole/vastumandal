import { describe, it, expect } from 'vitest';
import { 
  BylawParamsSchema, 
  SoilConditionSchema, 
  RateCardSchema, 
  RoomSchema,
  G_PLUS_1_RESIDENTIAL,
  G_PLUS_2_APARTMENT
} from './index';

describe('DWG Schemas Validation', () => {
  describe('Presets Validation', () => {
    it('should validate G_PLUS_1_RESIDENTIAL preset', () => {
      expect(() => BylawParamsSchema.parse(G_PLUS_1_RESIDENTIAL.bylaws)).not.toThrow();
      expect(() => SoilConditionSchema.parse(G_PLUS_1_RESIDENTIAL.soil)).not.toThrow();
      expect(() => RateCardSchema.parse(G_PLUS_1_RESIDENTIAL.rates)).not.toThrow();
    });

    it('should validate G_PLUS_2_APARTMENT preset', () => {
      expect(() => BylawParamsSchema.parse(G_PLUS_2_APARTMENT.bylaws)).not.toThrow();
      expect(() => SoilConditionSchema.parse(G_PLUS_2_APARTMENT.soil)).not.toThrow();
      expect(() => RateCardSchema.parse(G_PLUS_2_APARTMENT.rates)).not.toThrow();
    });
  });

  describe('Boundary and Edge Case Validation', () => {
    it('should throw on negative bylaw parameters where not allowed', () => {
      const invalidBylaws = {
        ...G_PLUS_1_RESIDENTIAL.bylaws,
        frontSetback: -5, // Invalid
      };
      
      const result = BylawParamsSchema.safeParse(invalidBylaws);
      expect(result.success).toBe(false);
    });

    it('should throw on zero SBC (Soil Bearing Capacity)', () => {
      const invalidSoil = {
        ...G_PLUS_1_RESIDENTIAL.soil,
        safeBearingCapacity: 0, // Must be positive
      };
      
      const result = SoilConditionSchema.safeParse(invalidSoil);
      expect(result.success).toBe(false);
    });

    it('should throw on invalid room polygon', () => {
      const invalidRoom = {
        id: 'room-1',
        name: 'Living',
        polygon: [[0, 0], [1, 'string']], // Invalid coordinate
        roomType: 'Living',
        targetArea: 10,
      };
      
      const result = RoomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });
  });
});
