// Base64 character set for IFC GlobalId (64 chars)
const B64 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$';

let _guidCounter = 0;

function ifcGuid(seed: string): string {
  // Generate a deterministic 22-char IFC GlobalId from a seed string
  let hash = 0;
  const input = seed + (_guidCounter++).toString();
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  let result = '';
  for (let i = 0; i < 22; i++) {
    const idx = Math.abs((hash * (i + 1) * 31 + i * 17) % 64);
    result += B64[idx];
  }
  return result;
}

export function exportVastumandalIFC(data: any): string {
  // ISO-10303-21 STEP File format generator for IFC2X3
  _guidCounter = 0;
  const timestamp = new Date().toISOString();
  const unixTime = Math.floor(Date.now() / 1000);

  return `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');
FILE_NAME('vastumandal_project.ifc','${timestamp}',('Vastumandal Engine'),('Architect'),'','Vastumandal Exporter','');
FILE_SCHEMA(('IFC4'));
ENDSEC;

DATA;
#1=IFCPERSON($,'Engineer',$,$,$,$,$,$);
#2=IFCORGANIZATION($,'Vastumandal','Vastumandal Tech',$,$);
#3=IFCPERSONANDORGANIZATION(#1,#2,$);
#4=IFCAPPLICATION(#2,'1.0','Vastumandal','VASTU');
#5=IFCOWNERHISTORY(#3,#4,$,.NOCHANGE.,$,$,$,${unixTime});
#6=IFCCARTESIANPOINT((0.,0.,0.));
#7=IFCDIRECTION((0.,0.,1.));
#8=IFCDIRECTION((1.,0.,0.));
#9=IFCAXIS2PLACEMENT3D(#6,#7,#8);
#10=IFCDIRECTION((0.,1.));
#11=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.0E-5,#9,$);
#12=IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,#11,.MODEL_VIEW.,$);
#13=IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.);
#14=IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.);
#15=IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.);
#16=IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.);
#17=IFCUNITASSIGNMENT((#13,#14,#15,#16));
#18=IFCPROJECT('${ifcGuid('project')}',#5,'Vastumandal Project','Generated BIM Model',$,$,$,(#11),#17);

/* Spatial Hierarchy */
#20=IFCLOCALPLACEMENT($,#9);
#21=IFCSITE('${ifcGuid('site')}',#5,'Site','Plot bounds',$,#20,$,$,.ELEMENT.,(28,0,0),(77,0,0),0.,$,$);
#22=IFCRELAGGREGATES('${ifcGuid('rel_proj_site')}',#5,'ProjectContainer','ProjectSiteLink',#18,(#21));

#30=IFCLOCALPLACEMENT(#20,#9);
#31=IFCBUILDING('${ifcGuid('building')}',#5,'Building','Main Structure',$,#30,$,$,.ELEMENT.,$,$,$);
#32=IFCRELAGGREGATES('${ifcGuid('rel_site_bldg')}',#5,'SiteContainer','SiteBuildingLink',#21,(#31));

#40=IFCLOCALPLACEMENT(#30,#9);
#41=IFCBUILDINGSTOREY('${ifcGuid('storey')}',#5,'Ground Floor','G',$,#40,$,$,.ELEMENT.,0.);
#42=IFCRELAGGREGATES('${ifcGuid('rel_bldg_storey')}',#5,'BuildingContainer','BuildingStoreyLink',#31,(#41));

/* Shared geometry helpers */
#50=IFCCARTESIANPOINT((0.,0.));
#51=IFCAXIS2PLACEMENT2D(#50,#10);
#52=IFCDIRECTION((0.,0.,1.));

/* Floor Slab -> IfcSlab */
#100=IFCCARTESIANPOINT((2500.,2000.,0.));
#101=IFCAXIS2PLACEMENT3D(#100,$,$);
#102=IFCRECTANGLEPROFILEDEF(.AREA.,'SlabProfile',#51,5000.,4000.);
#103=IFCEXTRUDEDAREASOLID(#102,#101,#52,150.);
#104=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#103));
#105=IFCPRODUCTDEFINITIONSHAPE($,$,(#104));
#106=IFCLOCALPLACEMENT(#40,#9);
#107=IFCSLAB('${ifcGuid('slab')}',#5,'Ground Slab','Concrete',$,#106,#105,$);

/* Wall -> IfcWallStandardCase */
#200=IFCCARTESIANPOINT((115.,2000.,0.));
#201=IFCAXIS2PLACEMENT3D(#200,$,$);
#202=IFCRECTANGLEPROFILEDEF(.AREA.,'WallProfile',#51,230.,4000.);
#203=IFCEXTRUDEDAREASOLID(#202,#201,#52,3000.);
#204=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#203));
#205=IFCPRODUCTDEFINITIONSHAPE($,$,(#204));
#206=IFCLOCALPLACEMENT(#40,#9);
#207=IFCWALLSTANDARDCASE('${ifcGuid('wall')}',#5,'Outer Wall','Brick',$,#206,#205,$);

/* Column -> IfcColumn */
#300=IFCCARTESIANPOINT((115.,225.,0.));
#301=IFCAXIS2PLACEMENT3D(#300,$,$);
#302=IFCRECTANGLEPROFILEDEF(.AREA.,'ColProfile',#51,230.,450.);
#303=IFCEXTRUDEDAREASOLID(#302,#301,#52,3000.);
#304=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#303));
#305=IFCPRODUCTDEFINITIONSHAPE($,$,(#304));
#306=IFCLOCALPLACEMENT(#40,#9);
#307=IFCCOLUMN('${ifcGuid('col')}',#5,'C1','Concrete Column',$,#306,#305,$);

/* Beam -> IfcBeam */
#400=IFCCARTESIANPOINT((2000.,115.,3000.));
#401=IFCAXIS2PLACEMENT3D(#400,$,$);
#402=IFCRECTANGLEPROFILEDEF(.AREA.,'BeamProfile',#51,230.,450.);
#403=IFCEXTRUDEDAREASOLID(#402,#401,#52,4000.);
#404=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#403));
#405=IFCPRODUCTDEFINITIONSHAPE($,$,(#404));
#406=IFCLOCALPLACEMENT(#40,#9);
#407=IFCBEAM('${ifcGuid('beam')}',#5,'B1','Concrete Beam',$,#406,#405,$);

/* Pad Footing -> IfcFooting */
#500=IFCCARTESIANPOINT((750.,750.,-450.));
#501=IFCAXIS2PLACEMENT3D(#500,$,$);
#502=IFCRECTANGLEPROFILEDEF(.AREA.,'FootingProfile',#51,1500.,1500.);
#503=IFCEXTRUDEDAREASOLID(#502,#501,#52,450.);
#504=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#503));
#505=IFCPRODUCTDEFINITIONSHAPE($,$,(#504));
#506=IFCLOCALPLACEMENT(#40,#9);
#507=IFCFOOTING('${ifcGuid('footing')}',#5,'F1','Pad Footing',$,#506,#505,.PAD_FOOTING.);

/* Opening -> IfcOpeningElement */
#600=IFCCARTESIANPOINT((115.,1000.,0.));
#601=IFCAXIS2PLACEMENT3D(#600,$,$);
#602=IFCRECTANGLEPROFILEDEF(.AREA.,'OpeningProfile',#51,230.,900.);
#603=IFCEXTRUDEDAREASOLID(#602,#601,#52,2100.);
#604=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#603));
#605=IFCPRODUCTDEFINITIONSHAPE($,$,(#604));
#606=IFCLOCALPLACEMENT(#206,#9);
#607=IFCOPENINGELEMENT('${ifcGuid('opening')}',#5,'Door Opening','Door',$,#606,#605,$);
#608=IFCRELVOIDSELEMENT('${ifcGuid('void')}',#5,'WallDoorVoid','Subtraction',#207,#607);

/* Reinforcing Bar -> IfcReinforcingBar */
#700=IFCCARTESIANPOINT((115.,225.,0.));
#701=IFCAXIS2PLACEMENT3D(#700,$,$);
#702=IFCCIRCLEPROFILEDEF(.AREA.,'RebarProfile',#51,8.);
#703=IFCEXTRUDEDAREASOLID(#702,#701,#52,3000.);
#704=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#703));
#705=IFCPRODUCTDEFINITIONSHAPE($,$,(#704));
#706=IFCLOCALPLACEMENT(#40,#9);
#707=IFCREINFORCINGBAR('${ifcGuid('rebar')}',#5,'MainRebar','T16',$,#706,#705,'C1',$,.MAIN.,$,$,$);

/* Fixture -> IfcFurnishingElement */
#800=IFCCARTESIANPOINT((1500.,1500.,0.));
#801=IFCAXIS2PLACEMENT3D(#800,$,$);
#802=IFCRECTANGLEPROFILEDEF(.AREA.,'FurnProfile',#51,900.,2000.);
#803=IFCEXTRUDEDAREASOLID(#802,#801,#52,600.);
#804=IFCSHAPEREPRESENTATION(#12,'Body','SweptSolid',(#803));
#805=IFCPRODUCTDEFINITIONSHAPE($,$,(#804));
#806=IFCLOCALPLACEMENT(#40,#9);
#807=IFCFURNISHINGELEMENT('${ifcGuid('furn')}',#5,'Bed','Master Bed',$,#806,#805,$);

/* Spatial containment */
#900=IFCRELCONTAINEDINSPATIALSTRUCTURE('${ifcGuid('containment')}',#5,'StoreyElements','Contains',(#107,#207,#307,#407,#507,#707,#807),#41);

ENDSEC;
END-ISO-10303-21;`;
}

