export function exportVastumandalIFC(data: any): string {
  // ISO-10303-21 STEP File format generator for IFC4
  const timestamp = new Date().toISOString();
  
  return `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'), '2;1');
FILE_NAME('vastumandal_project.ifc', '${timestamp}', ('Vastumandal Engine'), ('Architect'), 'IFC4', 'Vastumandal Exporter', '');
FILE_SCHEMA(('IFC4'));
ENDSEC;

DATA;
#1= IFCPROJECT('1234567890', #2, 'Vastumandal Project', 'Generated BIM Model', $, $, $, (#3), #4);
#2= IFCOWNERHISTORY(#5, #6, $, .ADDED., $, $, $, ${Math.floor(Date.now() / 1000)});
#3= IFCGEOMETRICREPRESENTATIONCONTEXT($, 'Model', 3, 1.0E-5, #7, #8);
#4= IFCUNITASSIGNMENT((#9, #10));
#5= IFCPERSONANDORGANIZATION(#11, #12, $);
#6= IFCAPPLICATION(#12, '1.0', 'Vastumandal', 'VASTU');
#7= IFCAXIS2PLACEMENT3D(#13, #14, #15);
#8= IFCDIRECTION((0., 1., 0.));
#9= IFCSIUNIT(*, .LENGTHUNIT., .MILLI., .METRE.);
#10= IFCSIUNIT(*, .AREAUNIT., $, .SQUARE_METRE.);
#11= IFCPERSON($, 'Engineer', $, $, $, $, $, $);
#12= IFCORGANIZATION($, 'Vastumandal', 'Tech', $, $);
#13= IFCCARTESIANPOINT((0., 0., 0.));
#14= IFCDIRECTION((0., 0., 1.));
#15= IFCDIRECTION((1., 0., 0.));

/* Spatial Hierarchy */
#20= IFCSITE('site_123', #2, 'Site', 'Plot bounds', $, #21, $, $, .ELEMENT., (34, 0, 0), (118, 0, 0), 0., $, $);
#21= IFCLOCALPLACEMENT($, #7);
#22= IFCRELAGGREGATES('rel_1', #2, 'ProjectContainer', 'Site Aggregation', #1, (#20));

#30= IFCBUILDING('bldg_123', #2, 'Building', 'Main Structure', $, #31, $, $, .ELEMENT., $, $, $);
#31= IFCLOCALPLACEMENT(#21, #7);
#32= IFCRELAGGREGATES('rel_2', #2, 'SiteContainer', 'Building Aggregation', #20, (#30));

#40= IFCBUILDINGSTOREY('storey_0', #2, 'Ground Floor', 'G', $, #41, $, $, .ELEMENT., 0.);
#41= IFCLOCALPLACEMENT(#31, #7);
#42= IFCRELAGGREGATES('rel_3', #2, 'BuildingContainer', 'Storey Aggregation', #30, (#40));

/* Entities mapping simulation */
/* Floor Slabs -> IfcSlab */
#100= IFCSLAB('slab_1', #2, 'Ground Slab', 'Concrete', $, #101, #102, 'FLOOR');
#101= IFCLOCALPLACEMENT(#41, #7);
#102= IFCPRODUCTDEFINITIONSHAPE($, $, (#103));
#103= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#104));
#104= IFCEXTRUDEDAREASOLID(#105, #106, #107, 150.);
#105= IFCRECTANGLEPROFILEDEF(.AREA., 'SlabProfile', #108, 5000., 4000.);
#106= IFCAXIS2PLACEMENT3D(#109, $, $);
#107= IFCDIRECTION((0., 0., 1.));
#108= IFCAXIS2PLACEMENT2D(#110, $);
#109= IFCCARTESIANPOINT((2500., 2000., 0.));
#110= IFCCARTESIANPOINT((0., 0.));

/* Wall -> IfcWallStandardCase */
#200= IFCWALLSTANDARDCASE('wall_1', #2, 'Outer Wall', 'Brick', $, #201, #202, '230MM_WALL');
#201= IFCLOCALPLACEMENT(#41, #7);
#202= IFCPRODUCTDEFINITIONSHAPE($, $, (#203));
#203= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#204));
#204= IFCEXTRUDEDAREASOLID(#205, #206, #107, 3000.);
#205= IFCRECTANGLEPROFILEDEF(.AREA., 'WallProfile', #108, 230., 4000.);
#206= IFCAXIS2PLACEMENT3D(#209, $, $);
#209= IFCCARTESIANPOINT((115., 2000., 0.));

/* Column -> IfcColumn */
#300= IFCCOLUMN('col_1', #2, 'C1', 'Concrete Column', $, #301, #302, $);
#301= IFCLOCALPLACEMENT(#41, #7);
#302= IFCPRODUCTDEFINITIONSHAPE($, $, (#303));
#303= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#304));
#304= IFCEXTRUDEDAREASOLID(#305, #306, #107, 3000.);
#305= IFCRECTANGLEPROFILEDEF(.AREA., 'ColProfile', #108, 230., 450.);
#306= IFCAXIS2PLACEMENT3D(#309, $, $);
#309= IFCCARTESIANPOINT((115., 225., 0.));

/* Beam -> IfcBeam */
#400= IFCBEAM('beam_1', #2, 'B1', 'Concrete Beam', $, #401, #402, $);
#401= IFCLOCALPLACEMENT(#41, #7);
#402= IFCPRODUCTDEFINITIONSHAPE($, $, (#403));
#403= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#404));
#404= IFCEXTRUDEDAREASOLID(#405, #406, #107, 4000.);
#405= IFCRECTANGLEPROFILEDEF(.AREA., 'BeamProfile', #108, 230., 450.);
#406= IFCAXIS2PLACEMENT3D(#409, $, $);
#409= IFCCARTESIANPOINT((2000., 115., 3000.));

/* Pad Footings -> IfcFooting */
#500= IFCFOOTING('footing_1', #2, 'F1', 'Pad Footing', $, #501, #502, .PAD_FOOTING.);
#501= IFCLOCALPLACEMENT(#41, #7);
#502= IFCPRODUCTDEFINITIONSHAPE($, $, (#503));
#503= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#504));
#504= IFCEXTRUDEDAREASOLID(#505, #506, #107, 450.);
#505= IFCRECTANGLEPROFILEDEF(.AREA., 'FootingProfile', #108, 1500., 1500.);
#506= IFCAXIS2PLACEMENT3D(#509, $, $);
#509= IFCCARTESIANPOINT((750., 750., -450.));

/* Openings -> IfcOpeningElement */
#600= IFCOPENINGELEMENT('opening_1', #2, 'Door Opening', 'Door', $, #601, #602, $);
#601= IFCLOCALPLACEMENT(#201, #7); /* Placed relative to wall */
#602= IFCPRODUCTDEFINITIONSHAPE($, $, (#603));
#603= IFCSHAPEREPRESENTATION(#3, 'Body', 'SweptSolid', (#604));
#604= IFCEXTRUDEDAREASOLID(#605, #606, #107, 2100.);
#605= IFCRECTANGLEPROFILEDEF(.AREA., 'OpeningProfile', #108, 230., 900.);
#606= IFCAXIS2PLACEMENT3D(#609, $, $);
#609= IFCCARTESIANPOINT((115., 1000., 0.));
#610= IFCRELVOIDSELEMENT('void_1', #2, 'Wall_Door_Void', 'Subtraction', #200, #600);

/* Spatial containment */
#900= IFCRELCONTAINEDINSPATIALSTRUCTURE('cont_1', #2, 'Storey Elements', 'Contains', (#100, #200, #300, #400, #500), #400);

ENDSEC;
END-ISO-10303-21;`;
}
