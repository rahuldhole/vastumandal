import { describe, it, expect } from "vitest";
import { exportVastumandalIFC } from "./index";

describe("ifc-exporter tests", () => {
  it("should generate a valid IFC string", () => {
    const ifcString = exportVastumandalIFC({});
    expect(ifcString).toContain("ISO-10303-21;");
    expect(ifcString).toContain("HEADER;");
    expect(ifcString).toContain("FILE_DESCRIPTION");
    expect(ifcString).toContain("FILE_SCHEMA(('IFC4'))");
    expect(ifcString).toContain("DATA;");
    expect(ifcString).toContain("ENDSEC;");
    expect(ifcString).toContain("END-ISO-10303-21;");
  });

  it("should use valid 22-char GlobalIds", () => {
    const ifcString = exportVastumandalIFC({});
    // Match GlobalIds in IFCPROJECT, IFCSITE, etc.
    const guidMatches = ifcString.match(/IFC(?:PROJECT|SITE|BUILDING|BUILDINGSTOREY)\('([^']+)'/g);
    expect(guidMatches).not.toBeNull();
    for (const match of guidMatches!) {
      const guid = match.match(/'([^']+)'/)?.[1];
      expect(guid).toBeDefined();
      expect(guid!.length).toBe(22);
    }
  });
});
