import { describe, it, expect } from "vitest";
import { exportVastumandalIFC } from "./index";

describe("ifc-exporter tests", () => {
  it("should generate a valid IFC string", () => {
    const ifcString = exportVastumandalIFC({});
    expect(ifcString).toContain("ISO-10303-21;");
    expect(ifcString).toContain("HEADER;");
    expect(ifcString).toContain("FILE_DESCRIPTION");
    expect(ifcString).toContain("DATA;");
    expect(ifcString).toContain("ENDSEC;");
    expect(ifcString).toContain("END-ISO-10303-21;");
  });
});
