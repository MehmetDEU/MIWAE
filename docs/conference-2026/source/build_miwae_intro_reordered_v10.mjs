import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "/Users/mehmetaltay/Documents/ChatGPT/New project";
const buildDir = path.join(workspaceDir, "miwae_presentation_optimized", "build");
const outputDir = path.join(workspaceDir, "miwae_presentation_optimized", "output");
const FINAL_PPTX = path.join(outputDir, "Pragmatic_Considerations_MIWAE_Introduction_Reordered_Working_v1_2026-09-21.pptx");
const SKILL_DIR = "/Users/mehmetaltay/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations";
const RUNTIME_PYTHON = "/Users/mehmetaltay/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const { applyPresentationChartFont, finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR,"container_tools/artifact_tool_utils.mjs")).href);
await fs.mkdir(buildDir,{recursive:true}); await fs.mkdir(outputDir,{recursive:true});

const W=1280,H=720,FONT="Arial";
const C={paper:"#FAFAFA",ink:"#33343F",muted:"#626777",teal:"#176082",teal2:"#78A9C0",navy:"#123B53",copper:"#D58C00",brandOrange:"#F0B113",amber:"#FFD45A",red:"#B94D35",pale:"#E6F0F5",sand:"#FFF4D8",white:"#FFFFFF",line:"#C8C9D3",gray:"#F2F2F5"};
const pres=Presentation.create({slideSize:{width:W,height:H}});
let slideCounter=0;
function addSlide(){slideCounter+=1;const s=pres.slides.add();s._miwaeSlideNo=slideCounter;return s}
const ICLHE_LOGO_BYTES=new Uint8Array(await fs.readFile("/Users/mehmetaltay/Documents/ChatGPT/New project/miwae_presentation_optimized/assets/ICLHE_logo_official.jpg"));
const GITHUB_LOGO_BYTES=new Uint8Array(await fs.readFile("/Users/mehmetaltay/Documents/ChatGPT/New project/miwae_presentation_optimized/assets/github_brand/unpacked/GitHub Logos/PNG/GitHub_Invertocat_Black.png"));

function rect(s,x,y,w,h,fill="none",r=0,lineFill="none",lineWidth=0){return s.shapes.add({geometry:r?"roundRect":"rect",position:{left:x,top:y,width:w,height:h},fill,line:{fill:lineFill,width:lineWidth}})}
function ln(s,x1,y1,x2,y2,color=C.line,width=2){return s.shapes.add({geometry:"line",position:{left:x1,top:y1,width:x2-x1,height:y2-y1},fill:"none",line:{fill:color,width}})}
function tx(s,text,x,y,w,h,size=22,color=C.ink,o={}){const t=s.shapes.add({geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:o.fill??"none",line:{fill:o.lineFill??"none",width:o.lineWidth??0}});t.text=text;t.text.style={typeface:o.font??FONT,fontSize:size,bold:o.bold??false,italic:o.italic??false,color,alignment:o.align??"left",verticalAlignment:o.valign??"top",autoFit:o.autoFit??"shrinkText"};return t}
function label(s,text,x,y,w=390,color=C.teal){return tx(s,text.toUpperCase(),x,y,w,27,13,color,{bold:true,valign:"middle"})}
function tag(s,text,x,y,w=200,fill=C.copper){rect(s,x,y,w,28,fill,10);const tc=(fill===C.brandOrange||fill===C.amber)?C.navy:C.white;tx(s,text.toUpperCase(),x+8,y+3,w-16,20,11,tc,{bold:true,align:"center",valign:"middle"})}
function sectionFor(n){if(n<=8)return ["INTRODUCTION",C.teal];if(n<=13)return ["METHODOLOGY",C.copper];if(n<=20)return ["FINDINGS",C.red];if(n===21)return ["DISCUSSION",C.brandOrange];if(n<=27)return ["MIWAE FRAMEWORK",C.teal];if(n===28)return ["CONCLUSION",C.copper];return ["APPENDIX",C.muted]}
function title(s,text,section,n){const actual=s._miwaeSlideNo;const sec=sectionFor(actual);rect(s,72,39,7,18,sec[1],3);label(s,sec[0],89,35,430,sec[1]);tx(s,text,72,66,1120,70,34,C.ink,{bold:true});ln(s,72,139,1210,139,C.line,1.5);tx(s,String(actual).padStart(2,"0"),1190,36,42,24,12,C.muted,{align:"right"})}
function footer(s,note=""){ln(s,72,678,1210,678,C.line,1);tx(s,"MIWAE",72,686,100,16,10,C.muted,{bold:true});if(note)tx(s,note,215,685,850,18,10,C.muted,{align:"center"})}
function cite(s,text){tx(s,text,85,647,1110,21,10,C.muted,{italic:true,align:"center"})}
function notes(s,text){s.speakerNotes.textFrame.setText(text)}
function metric(s,value,desc,x,y,w=250,color=C.teal){tx(s,value,x,y,w,56,42,color,{bold:true});tx(s,desc,x,y+58,w,58,17,C.muted)}
function numCard(s,n,head,body,x,y,w,h,accent=C.teal,dark=false){rect(s,x,y,w,h,dark?C.navy:C.white,16,C.line,1);tx(s,String(n),x+20,y+18,45,42,28,dark?C.amber:accent,{bold:true});tx(s,head,x+25,y+76,w-50,52,21,dark?C.white:C.ink,{bold:true});tx(s,body,x+25,y+136,w-50,h-154,16,dark?C.white:C.muted)}
function addTableStyle(tb,rows,cols,firstCol=true,bodySize=14){tb.borders.assign({style:"solid",fill:C.line,width:1});tb.cells.block({row:0,column:0,rowCount:1,columnCount:cols}).assign({fill:C.navy,textStyle:{typeface:FONT,fontSize:15,color:C.white,bold:true},margins:{left:10,right:10,top:8,bottom:7},anchor:"middle"});tb.cells.block({row:1,column:0,rowCount:rows-1,columnCount:cols}).assign({fill:C.white,textStyle:{typeface:FONT,fontSize:bodySize,color:C.ink},margins:{left:10,right:10,top:7,bottom:7},anchor:"middle"});if(firstCol)tb.cells.block({row:1,column:0,rowCount:rows-1,columnCount:1}).assign({fill:C.pale,textStyle:{typeface:FONT,fontSize:bodySize,color:C.teal,bold:true}})}

// 1 Cover
{
 const s=addSlide();s.background.fill=C.paper;rect(s,0,0,24,H,C.teal);rect(s,24,0,13,H,C.brandOrange);
 label(s,"ICLHE Symposium 2026 · Oral presentation",82,50,520,C.teal);
 s.images.add({blob:ICLHE_LOGO_BYTES,contentType:"image/jpeg",alt:"Official ICLHE Association logo",fit:"contain",position:{left:980,top:34,width:230,height:126}});
 tx(s,"Pragmatic Considerations for Authors and Publishers on\nModification of Input in Written Academic English",82,142,1080,205,42,C.ink,{bold:true,autoFit:"shrinkText"});
 tx(s,"MIWAE: an ELF-informed coursebook-fit framework for multilingual EMI readers",84,369,995,58,23,C.muted);
 ln(s,82,470,1195,470,C.line,1.5);
 tx(s,"Mehmet Altay · Kocaeli University",82,495,520,30,19,C.ink,{bold:true});
 tx(s,"Dogan Yuksel · The Open University / Kocaeli University",82,532,700,28,17,C.muted);
 tag(s,"synthetic demo evidence",82,607,230,C.teal);tx(s,"15–16 October 2026 · ZHAW Winterthur",350,611,470,25,15,C.muted);
 s.images.add({blob:GITHUB_LOGO_BYTES,contentType:"image/png",alt:"Official GitHub Invertocat logo linking viewers to the MIWAE repository",fit:"contain",position:{left:868,top:598,width:38,height:38}});
 tx(s,"github.com/MehmetDEU/MIWAE",916,604,280,26,14,C.ink,{bold:true,align:"right",valign:"middle"});
 notes(s,"Open with the exact conference title. Explain that pragmatic considerations refer to choices made by authors and publishers about how written academic input is organised, related and supported. The ICLHE logo and palette are drawn from the official association website, https://www.iclhe.org/. The MIWAE API repository is available at https://github.com/MehmetDEU/MIWAE. State that student records and interview excerpts are synthetic demonstration evidence; literature and located textbook examples are source-based.");
}

// 2 EAP and academic ELF
{
 const s=addSlide();s.background.fill=C.paper;title(s,"EAP and academic ELF: related fields, different starting points","Literature",2);
 rect(s,76,176,535,350,C.white,18,C.line,1);rect(s,669,176,535,350,C.navy,18);
 label(s,"English for Academic Purposes",108,204,430,C.teal);tx(s,"Academic communicative needs and practices",108,250,455,62,26,C.ink,{bold:true});
 tx(s,"• research and instruction\n• academic texts and literacy\n• identifiable learner needs",112,330,430,108,20,C.muted);
 tx(s,"Historical tendency: native-speaker usage often supplied the reference norm.",108,452,455,52,17,C.teal,{bold:true});
 label(s,"Academic English as a Lingua Franca",701,204,455,C.amber);tx(s,"English as a shared academic medium",701,250,455,62,26,C.white,{bold:true});
 tx(s,"• multilingual international settings\n• communicative effectiveness\n• norms emerging through use",705,330,430,108,20,C.white);
 tx(s,"Why it emerged: native likeness alone cannot explain successful global academic communication.",701,452,455,52,17,C.amber,{bold:true});
 rect(s,142,557,995,58,C.pale,14);tx(s,"MIWAE connects EAP's attention to academic texts with ELF's attention to communication among multilingual users.",172,570,935,34,20,C.teal,{bold:true,align:"center",valign:"middle"});
 cite(s,"Hyland & Shaw, 2016, pp. 1–2; Seidlhofer, 2011, p. 7; Mauranen, Hynninen & Ranta, 2016, pp. 44–45");footer(s);
 notes(s,"Begin with definitions rather than with MIWAE. Hyland and Shaw define EAP as language research and instruction focused on the communicative needs and practices of people working in academic contexts. Seidlhofer defines ELF as English used among speakers of different first languages when English is their chosen communicative medium, often their only option. Mauranen, Hynninen and Ranta then identify two historical differences: EAP tended to take native-speaker English as its reference and concentrated strongly on written language, whereas academic ELF examined international settings where most participants use English as an additional language. The point is a difference of starting orientation, not a rigid division. ELFA became necessary because successful academic communication in global multilingual settings cannot be explained adequately by closeness to an idealised native norm. Transition: the clearest historical contrast concerns mode—writing in EAP and speech in early academic ELF research.");
}

// 3 mode and written ELF gap
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Writing and speech were starting tendencies—not boundaries","Literature",3);
 rect(s,80,183,515,210,C.white,18,C.line,1);label(s,"EAP's strong tradition",112,211,330,C.teal);tx(s,"WRITTEN LANGUAGE",112,258,430,42,29,C.ink,{bold:true});tx(s,"Reading · writing · academic text",112,314,430,34,19,C.muted);
 rect(s,685,183,515,210,C.navy,18);label(s,"Academic ELF's starting point",717,211,390,C.amber);tx(s,"SPOKEN DISCOURSE",717,258,430,42,29,C.white,{bold:true});tx(s,"Interaction · accommodation · communicative success",717,314,430,42,19,C.white);
 ln(s,595,286,685,286,C.copper,4);
 rect(s,115,432,1050,130,C.pale,18);tx(s,"ELF also operates through writing",155,453,970,34,27,C.teal,{bold:true,align:"center"});tx(s,"WrELFA made written academic ELF observable, yet only a handful of studies had addressed it; Mauranen et al. called the territory almost entirely uncharted.",165,498,950,48,18,C.ink,{bold:true,align:"center"});
 tag(s,"research imbalance",505,589,270,C.copper);cite(s,"Mauranen, Hynninen & Ranta, 2016, pp. 44–45, 48–49, 52–53; Björkman, 2013, pp. 1–2");footer(s);
 notes(s,"Mauranen and colleagues state: ‘EAP has a strong tradition of focusing on written language, whereas academic ELF research started from analysing spoken discourse.’ Early ELF research prioritised speech because researchers wanted to observe how speakers manage communication when English is an additional language for everyone and because change is often first visible in interaction. This history does not make EAP exclusively written or ELF exclusively spoken. Björkman explicitly notes that present-day ELF is used in both spoken and written form, and the WrELFA corpus was built to study written academic discourse. Mauranen and colleagues still found very little written-ELF research and described written academic ELF as almost entirely uncharted. Transition: EMI textbooks turn that imbalance into a practical problem because they carry disciplinary knowledge through writing.");
}

// 4 textbooks as written academic communication
{
 const s=addSlide();s.background.fill=C.paper;title(s,"EMI textbooks make written academic communication central","Research problem",4);
 const chain=[["AUTHORS · EDITORS · PUBLISHERS","select wording, relations and design",C.teal],["EMI TEXTBOOK","stages disciplinary explanations",C.copper],["MULTILINGUAL READERS","interpret through diverse repertoires",C.red],["CONTENT KNOWLEDGE","is accessed and reconstructed",C.amber]];
 chain.forEach((a,i)=>{const x=42+i*305;rect(s,x,190,260,146,i===3?C.navy:C.white,16,C.line,1);label(s,a[0],x+18,211,224,a[2]);tx(s,a[1],x+20,258,220,52,18,i===3?C.white:C.ink,{bold:true,align:"center",valign:"middle"});if(i<3)ln(s,x+260,263,x+300,263,C.teal,4)});
 rect(s,74,390,530,174,C.pale,16);label(s,"Evidence from EMI settings",105,415,360,C.teal);tx(s,"Imported English textbooks can be central course resources; one Chinese EMI study calls them the ‘cornerstone’ of the courses examined.",105,461,460,78,19,C.ink,{bold:true});
 rect(s,676,390,530,174,C.sand,16);label(s,"The unresolved question",707,415,360,C.copper);tx(s,"Do production teams calibrate language and design for readers whose first language is usually not English?",707,461,460,78,21,C.ink,{bold:true});
 tx(s,"A textbook is therefore both a knowledge resource and a written communicative interface.",160,596,960,34,21,C.teal,{bold:true,align:"center"});
 cite(s,"Fang & Xie in Jenkins & Mauranen, 2019, pp. 127, 132–133, 143; Mauranen et al., 2016, pp. 52–53");footer(s);
 notes(s,"Treat the chain as a communication model. Production teams select wording, sequence explanations, place definitions, and coordinate prose with figures or notation. Multilingual students then reconstruct disciplinary meaning from those choices. Jenkins and Mauranen's volume reports English textbooks published by Anglo-American universities in Chinese EMI and describes authentic English textbooks as the cornerstone of the courses studied, often supplemented by Chinese materials. This is evidence from a particular context, so avoid claiming that every EMI programme depends primarily on imported books. It does justify investigating textbooks as written academic communication. The production-location claim must also remain bounded: the source documents Anglo-American university textbooks in that case; it does not prove that all EMI books are produced there. Transition: if textbooks communicate disciplinary meaning to readers, can their prose legitimately be called input?");
}

// 5 input modification
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Can textbook prose be treated as input?","Key construct",5);
 rect(s,80,181,530,245,C.white,18,C.line,1);label(s,"Established in L2 reading",112,210,370,C.teal);tx(s,"Written passages are linguistic input",112,258,445,42,25,C.ink,{bold:true});tx(s,"Reading studies compare baseline, simplified and elaborated versions and test their comprehensibility.",112,318,445,74,19,C.muted);
 rect(s,670,181,530,245,C.navy,18);label(s,"MIWAE's operational extension",702,210,400,C.amber);tx(s,"The input carries disciplinary knowledge",702,258,445,42,25,C.white,{bold:true});tx(s,"The concern is communicative access to precise content, not language acquisition alone.",702,318,445,74,19,C.white);
 tx(s,"Modification means purposeful calibration",120,463,1040,38,27,C.ink,{bold:true,align:"center"});
 const items=["define or gloss","signal relations","sequence explanations","add examples","reactivate context","align prose + visuals"];
 items.forEach((v,i)=>{const x=76+(i%3)*402;const y=519+Math.floor(i/3)*52;rect(s,x,y,370,38,i===5?C.sand:C.pale,10);tx(s,v,x+12,y+7,346,23,16,i===5?C.copper:C.teal,{bold:true,align:"center"})});
 tx(s,"Calibration may simplify locally, elaborate, or redistribute support; it must preserve technical precision.",165,624,950,27,17,C.red,{bold:true,align:"center"});
 cite(s,"Li, Xu & Wang, 2005, pp. 45–74; Council of Europe, 2020, pp. 116–123; MIWAE operational definition");footer(s);
 notes(s,"Yes, written textbook prose can be treated as input. Second-language reading research explicitly uses the term written input and compares unmodified, simplified and elaborated passages. Li, Xu and Wang are a clear example. However, MIWAE makes a stated extension: the object is disciplinary communication in EMI, not only language acquisition. Input modification therefore cannot mean replacing technical language with easy general English. It means calibrating support for a multilingual reader by defining or glossing terms, making rhetorical relations visible, sequencing explanations, giving examples, reactivating prerequisite knowledge, and coordinating prose with visuals or notation. The CEFR mediation scales also recognise explaining concepts and simplifying a text, but MIWAE treats simplification as one possible move among several. Transition: this relational account connects directly to McKinley's argument about academic literacy.");
}

// 6 academic literacy
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Academic literacy links reader readiness to textbook design","Literature bridge",6);
 tx(s,"EMI preparedness cannot be reduced to a language score",126,176,1028,43,28,C.ink,{bold:true,align:"center"});
 const cards=[["LANGUAGE REPERTOIRE","English resources available to the reader",C.teal],["DISCIPLINARY LITERACY","Ways of reading, reasoning and interpreting evidence",C.copper],["TEXTBOOK ENVIRONMENT","How explanations, expectations and resources are staged",C.navy]];
 cards.forEach((a,i)=>{const x=60+i*410;rect(s,x,260,360,220,i===2?C.navy:C.white,18,C.line,1);rect(s,x,260,360,14,a[2],10);label(s,a[0],x+28,291,300,i===2?C.amber:a[2]);tx(s,a[1],x+34,354,292,82,22,i===2?C.white:C.ink,{bold:true,align:"center",valign:"middle"});if(i<2)ln(s,x+360,368,x+407,368,C.teal,4)});
 rect(s,150,526,980,78,C.pale,14);tx(s,"MIWAE asks whether the textbook supports the disciplinary reading practices that multilingual students are still learning.",180,544,920,43,21,C.teal,{bold:true,align:"center",valign:"middle"});
 cite(s,"McKinley, 2025, Beyond Proficiency: Rethinking Preparedness in English-Medium Instruction");footer(s);
 notes(s,"McKinley argues that EMI difficulties often reflect gaps in academic literacy rather than linguistic deficits alone. Preparedness includes learning how a discipline reads, reasons, writes and interprets evidence; standardised English scores have limited power to predict this by themselves. His argument is aimed mainly at institutional and pedagogical support, not textbook evaluation. MIWAE draws a careful correlation: the textbook is one part of the literacy environment through which disciplinary expectations are communicated. A learner may have adequate general English yet still struggle when key relations, evidence patterns, or epistemic expectations remain implicit. Conversely, good design cannot compensate for every gap in prior knowledge. Transition: the CEFR's account of pragmatic competence helps specify which communicative dimensions of textbook design can be examined.");
}

// 7 CEFR pragmatic competence
{
 const s=addSlide();s.background.fill=C.paper;title(s,"CEFR pragmatic competence offers a three-part design lens","Conceptual framework",7);
 tx(s,"CEFR: competence of the user/learner",80,171,445,34,20,C.muted,{bold:true});tx(s,"MIWAE: production-side review questions",705,171,490,34,20,C.muted,{bold:true});
 const rows=[
  ["DISCOURSE","messages organised, structured and arranged","Are cohesion, information structure and relations visible?",C.teal],
  ["FUNCTIONAL","messages used to perform communicative functions","Do definitions, explanations, contrasts and guidance work for the reader?",C.copper],
  ["DESIGN","messages sequenced through interactional or transactional schemata","Are support, examples and modes placed and coordinated at points of need?",C.amber],
 ];
 rows.forEach((a,i)=>{const y=231+i*115;rect(s,76,y,510,92,C.white,14,C.line,1);rect(s,694,y,510,92,i===2?C.sand:C.white,14,C.line,1);label(s,a[0],102,y+13,150,a[3]);tx(s,a[1],262,y+13,296,58,17,C.ink,{bold:true});tx(s,a[2],719,y+12,460,63,17,C.ink,{bold:true,align:"center",valign:"middle"});ln(s,586,y+46,694,y+46,a[3],3)});
 rect(s,146,595,988,48,C.pale,12);tx(s,"This is an operational mapping from user competence to textbook choices—not a CEFR textbook scale.",176,606,928,27,18,C.teal,{bold:true,align:"center"});
 cite(s,"Council of Europe, 2020, pp. 137–138; MIWAE operational extension");footer(s);
 notes(s,"The CEFR says pragmatic competence concerns actual language use in the co-construction of text. It explains that messages are organised, structured and arranged through discourse competence; used to perform communicative functions through functional competence; and sequenced according to interactional and transactional schemata through design competence. The CEFR describes what users and learners can do. It does not provide a textbook rating scale. MIWAE makes an explicit production-side extension: discourse competence motivates questions about cohesion, information structure and rhetorical relations; functional competence motivates questions about definitions, explanations, contrasts and reader guidance; and design competence motivates questions about sequencing, placement and multimodal coordination. Transition: these links lead to a precise research problem and a bounded contribution.");
}

// 8 research problem and contribution
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Research problem and MIWAE contribution","Study purpose",8);
 rect(s,84,173,1112,96,C.teal,18);tx(s,"How can EMI textbooks be examined for the way they modify and organise written disciplinary input for multilingual readers?",132,193,1016,58,27,C.white,{bold:true,align:"center",valign:"middle"});
 label(s,"Documented problem",93,314,330,C.copper);label(s,"Proposed response",704,314,330,C.teal);
 const gaps=["Written academic ELF remains under-researched","Textbook discourse is rarely treated as communication","Reader difficulty is seldom linked to located design choices"];
 gaps.forEach((v,i)=>{rect(s,82,357+i*65,505,48,C.white,12,C.line,1);tx(s,v,103,367+i*65,463,27,16,C.ink,{bold:true,align:"center"})});
 const outs=["Connect reader evidence to textual evidence","Profile function · form · distribution","Support authoring, publishing and coursebook-fit decisions"];
 outs.forEach((v,i)=>{rect(s,693,357+i*65,505,48,i===2?C.sand:C.pale,12);tx(s,v,714,367+i*65,463,27,16,i===2?C.copper:C.teal,{bold:true,align:"center"})});
 ln(s,601,423,679,423,C.teal,4);tx(s,"MIWAE",604,387,72,24,13,C.teal,{bold:true,align:"center"});
 tx(s,"Working meaning: ELFA-friendly design anticipates multilingual readers while preserving disciplinary precision.",145,588,990,46,19,C.ink,{bold:true,align:"center"});footer(s);
 notes(s,"State the question exactly. The problem has three layers: written academic ELF is under-researched; textbook discourse is seldom examined as written communication with a multilingual audience; and reader difficulty is often reported without locating the textual choices that support or obstruct meaning. MIWAE's contribution is to connect reader evidence with observable textual evidence, organise that evidence through function, form and distribution, and support decisions by authors, publishers, syllabus designers and course teams. Define ELFA-friendly as a project term: design that anticipates multilingual readers while preserving disciplinary precision. Do not present MIWAE as a validated universal scale; at this stage it is a provisional framework and review procedure. Transition: the methodology now shows how the synthetic reader evidence and the ten-book pilot were organised.");
}

// 10 design and corpus correction
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Demonstration design and corpus scope","Method",10);tag(s,"synthetic student data",970,40,225);metric(s,"100","second-year students\n50 EE + 50 IR",82,180,230);metric(s,"20","semi-structured interviews\n10 per discipline",340,180,240);metric(s,"10","reviewed textbooks\n5 EE + 5 IR",620,180,240);metric(s,"50","matched passages\n5 per textbook",900,180,250);
 ln(s,82,340,1190,340,C.line,1.5);tx(s,"Text corpus",90,370,250,30,18,C.copper,{bold:true});tx(s,"Nine books support whole-text concordance and figure-reference analyses. All ten books enter the matched Text Inspector sample.",90,410,1080,44,19,C.ink,{bold:true});tx(s,"Hambley replaces the Nilsson instructor solution manual. Mano is an image-only scan, so five stratified passages were recovered with OCR.",90,470,1080,48,18,C.muted);tx(s,"All student records and interview quotations remain fictional demonstration data.",195,578,890,38,19,C.red,{bold:true,align:"center"});footer(s);notes(s,"The balanced set contains five Engineering and five International Relations textbooks. Hambley replaces the unsuitable Nilsson solution manual. Mano enters the 50-passage Text Inspector analysis through OCR, while whole-book scripts use the other nine texts.");
}

// 13 API architecture
{
 const s=addSlide();s.background.fill=C.paper;title(s,"MIWAE Corpus Analysis API","Research infrastructure",13);tag(s,"open prototype",1010,40,180,C.teal);
 const steps=[
  ["SOURCE","TXT, Markdown, PDF, DOCX or grouped CSV",C.teal],
  ["SEGMENT","Pages, paragraphs or matched passages",C.copper],
  ["PROFILE","7 functions and 19 form candidates",C.red],
  ["DISTRIBUTE","Rate, coverage, evenness and optional opportunities",C.amber],
  ["REVIEW","Contextual verification and export",C.navy],
 ];
 steps.forEach((a,i)=>{const x=42+i*248;rect(s,x,184,220,178,i===4?C.navy:C.white,16,C.line,1);label(s,a[0],x+19,208,180,a[2]);tx(s,a[1],x+20,260,180,76,17,i===4?C.white:C.ink,{bold:true,align:"center",valign:"middle"});if(i<4)ln(s,x+220,274,x+246,274,C.teal,3)});
 rect(s,72,398,1136,102,C.pale,16);tx(s,"Optional adapters",98,420,210,26,16,C.teal,{bold:true});tx(s,"Authorized Text Inspector exports",322,414,320,38,19,C.ink,{bold:true,align:"center"});tx(s,"User-supplied EVP or EGP mappings",708,414,390,38,19,C.ink,{bold:true,align:"center"});ln(s,662,414,662,479,C.line,1);
 const ms=[["10","books"],["50","stratified passages"],["9,810","words"],["260","book-feature rows"]];ms.forEach((m,i)=>{const x=94+i*285;tx(s,m[0],x,533,190,42,30,i===3?C.copper:C.teal,{bold:true,align:"center"});tx(s,m[1],x,575,190,28,15,C.muted,{bold:true,align:"center"})});
 tx(s,"Automatic matches remain candidates until contextual verification.",245,612,790,28,18,C.red,{bold:true,align:"center"});tx(s,"github.com/MehmetDEU/MIWAE",485,646,630,24,17,C.teal,{bold:true,align:"center"});footer(s,"MIWAE Corpus Analysis API v0.1");notes(s,"Presentation wording: We developed an open, extensible MIWAE Corpus Analysis API, available at https://github.com/MehmetDEU/MIWAE. It accepts text, PDF, DOCX and structured corpus inputs and generates transparent candidate profiles for functions, grammatical forms and distribution. It can import authorized Text Inspector exports and user-supplied EVP or EGP mappings. Do not claim an official live connection to either provider. The pilot run used 10 books, 50 stratified passages and 9,810 words. Automatic hits require contextual review.");
}


// 14 access and launch
{
 const s=addSlide();s.background.fill=C.paper;title(s,"From GitHub to a running local API","API demonstration",14);tag(s,"public repository",990,40,185,C.teal);
 rect(s,62,184,338,350,C.white,18,C.line,1);label(s,"1  Access",92,211,245,C.teal);tx(s,"github.com/\nMehmetDEU/MIWAE",82,254,298,66,20,C.ink,{bold:true,align:"center",valign:"middle"});rect(s,100,343,262,42,C.pale,12);tx(s,"source · methods · examples",110,352,242,22,15,C.teal,{bold:true,align:"center"});tx(s,"Clone or download the public MIT-licensed prototype.",100,420,262,62,18,C.muted,{align:"center"});
 rect(s,468,184,420,350,C.navy,18);label(s,"2  Launch in Terminal",500,211,320,C.amber);tx(s,"git clone https://github.com/MehmetDEU/MIWAE.git\ncd MIWAE\npython3 -m venv .venv\nsource .venv/bin/activate\npip install '.[dev]'\nuvicorn miwae_api.app:app --reload",500,258,355,206,15,C.white,{font:"Arial",autoFit:"shrinkText"});rect(s,510,478,336,32,"#214653",8);tx(s,"Keep the Terminal process running",522,484,312,20,13,C.teal2,{bold:true,align:"center"});
 rect(s,956,184,262,350,C.white,18,C.line,1);label(s,"3  Open",986,211,195,C.copper);tx(s,"localhost:8000/docs",983,271,208,50,20,C.ink,{bold:true,align:"center",valign:"middle"});rect(s,987,347,200,58,C.copper,12);tx(s,"SWAGGER UI",1002,362,170,26,15,C.white,{bold:true,align:"center"});tx(s,"Choose an endpoint, submit text or a file, and inspect the response.",986,430,200,70,17,C.muted,{align:"center"});
 ln(s,402,355,464,355,C.teal,4);ln(s,890,355,952,355,C.teal,4);tx(s,"Public source",130,574,210,28,17,C.teal,{bold:true,align:"center"});tx(s,"Local processing",573,574,210,28,17,C.copper,{bold:true,align:"center"});tx(s,"Interactive interface",982,574,210,28,17,C.teal,{bold:true,align:"center"});
 tx(s,"The GitHub URL is public. The localhost URL works only while the API is running on that computer.",165,625,950,28,17,C.red,{bold:true,align:"center"});footer(s,"MIWAE Corpus Analysis API v0.1");notes(s,"Demonstrate the distinction between the public repository and the local service. GitHub provides the code; localhost exposes the running Swagger interface on the presenter's computer.");
}

// 15 Swagger workflow
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Four steps turn a passage into an analysis","API demonstration",15);
 const tops=[["1","Open POST /v1/analyze/text"],["2","Select Try it out"],["3","Paste the request JSON"],["4","Select Execute"]];tops.forEach((a,i)=>{const x=57+i*305;rect(s,x,165,278,54,i===3?C.copper:C.white,12,C.line,1);rect(s,x+12,176,32,32,i===3?C.navy:C.teal,16);tx(s,a[0],x+12,179,32,23,14,C.white,{bold:true,align:"center"});tx(s,a[1],x+55,178,205,28,14,i===3?C.white:C.ink,{bold:true,align:"center"})});
 rect(s,73,247,1135,350,C.white,18,C.line,1);rect(s,73,247,1135,42,C.navy,18);tx(s,"●  ●  ●",95,256,100,20,14,C.copper,{bold:true});tx(s,"MIWAE Corpus Analysis API — Swagger UI",325,255,630,23,16,C.white,{bold:true,align:"center"});
 rect(s,95,312,1090,48,"#DDEFE8",8);tx(s,"POST",112,322,75,24,14,"#19734A",{bold:true});tx(s,"/v1/analyze/text",197,320,250,26,17,C.ink,{bold:true});rect(s,1025,319,135,28,C.teal,8);tx(s,"TRY IT OUT",1037,324,112,18,12,C.white,{bold:true,align:"center"});
 rect(s,96,378,720,176,"#142D38",10);tx(s,'{\n  "id": "demo-circuit-text",\n  "title": "Demonstration passage",\n  "text": "In this section, we consider a linear circuit...",\n  "metadata": { "discipline": "Electrical Engineering" }\n}',118,394,675,145,15,C.white,{font:"Arial"});
 rect(s,850,379,310,74,C.pale,12);tx(s,"include_hits = true\nmax_hits = 5",875,394,260,45,17,C.ink,{bold:true,align:"center"});rect(s,910,483,190,49,C.copper,10);tx(s,"EXECUTE",928,496,154,24,16,C.white,{bold:true,align:"center"});
 tx(s,"The request body holds the passage. Query controls determine whether example hits are returned and how many are shown.",150,620,980,29,17,C.muted,{align:"center"});footer(s,"Live interface: http://localhost:8000/docs");notes(s,"Walk through the interface slowly. The endpoint label is clicked, not pasted. The JSON goes into the Request body editor. Execute sends the passage to the local API.");
}

// 16 JSON response anatomy
{
 const s=addSlide();s.background.fill=C.paper;title(s,"The response separates six inspectable evidence layers","API demonstration",16);tag(s,"actual demo output",975,40,200,C.teal);
 rect(s,67,174,600,424,"#142D38",16);tx(s,'{\n  "document": { ... },\n  "statistics": {\n    "word_count": 44,\n    "sentence_count": 5,\n    "type_token_ratio": 0.8182\n  },\n  "functions": [ ... ],\n  "grammatical_forms": [ ... ],\n  "distribution": [ ... ],\n  "segments": [ ... ],\n  "external_profiles": { ... }\n}',96,198,535,366,17,C.white,{font:"Arial"});
 const cards=[["FUNCTIONS","6 hits","meaning access · orientation · relations · engagement · multimodal support",C.teal],["FORMS","10 hits","modal · passive · conditional · interrogative · nominalisation · reference",C.copper],["DISTRIBUTION","26 rows","count · rate per 10k · coverage · evenness · eligible opportunities",C.amber]];cards.forEach((a,i)=>{const y=176+i*132;rect(s,718,y,494,108,i===2?C.sand:C.white,14,C.line,1);label(s,a[0],744,y+14,190,a[3]);tx(s,a[1],977,y+12,200,31,25,a[3],{bold:true,align:"right"});tx(s,a[2],744,y+53,432,38,15,C.ink,{bold:true})});
 rect(s,719,579,492,47,C.pale,12);tx(s,"Download → complete JSON research record",744,590,442,24,17,C.teal,{bold:true,align:"center"});tx(s,"A 44-word demonstration passage produces high per-10,000 rates; these values illustrate output structure, not book-level prevalence.",120,641,1040,25,15,C.red,{bold:true,align:"center"});footer(s);notes(s,"This slide uses the real response from the demonstration passage. Explain the hierarchy before interpreting any metric. A single short segment cannot support meaningful dispersion claims, and normalized rates can appear large.");
}

// 14 quant
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Reading challenge profile in the synthetic dataset","Quantitative demonstration",18);tag(s,"synthetic",1040,40,150);const cats=["Specific\nvocabulary","Difficult\nwords","Careful\nreading","Scan for\ndetail","Supporting\nideas","Read for\ngist","Key ideas","Brief\nnotes","Own-word\nnotes","Text\norganisation"];const vals=[3.48,3.43,3.08,2.90,3.14,3.05,3.06,3.29,3.39,3.12];const ch=s.charts.add("bar",{position:{left:70,top:175,width:835,height:430},categories:cats,series:[{name:"Mean challenge",values:vals,fill:C.teal}],barOptions:{direction:"column",grouping:"clustered",gapWidth:45},hasLegend:false,yAxis:{visible:true,min:0,max:6,majorUnit:1,title:"Mean score (1–6)",textStyle:{typeface:FONT,fontSize:12,fill:C.muted},majorGridlines:{fill:C.line,width:1}},xAxis:{visible:true,textStyle:{typeface:FONT,fontSize:11,fill:C.muted}},dataLabels:{showValue:true,position:"outEnd",textStyle:{typeface:FONT,fontSize:12,fill:C.ink,bold:true}},chartFill:C.paper,plotAreaFill:C.paper,chartLine:{fill:"none",width:0}});applyPresentationChartFont(ch,{fontFamily:FONT});rect(s,950,195,245,120,C.white,15,C.line,1);metric(s,"3.19","overall challenge mean",975,211,210);rect(s,950,347,245,120,C.white,15,C.line,1);metric(s,"−.55","challenge × English",975,363,210,C.copper);rect(s,950,499,245,120,C.white,15,C.line,1);metric(s,"−.48","challenge × GPA",975,515,210,C.copper);footer(s,"Descriptive synthetic patterns; no causal inference");notes(s,"Synthetic n=100. English r=-.548 and GPA r=-.481 with reading challenge.");
}

// 15 EE quotes
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Engineering readers used equations and visuals as parallel routes to meaning","Synthetic excerpts",20);tag(s,"generated demo excerpts",980,40,230);const quotes=[
  ["“Hmm, when the equation, circuit and graph agree, I can check myself. The English may be difficult, but the symbols give another way.”","multimodal verification"],
  ["“The law is stable, yes, but one missing label changes the whole calculation. I need the figure to tell me which quantity is which.”","precision through labels"],
  ["“I could follow each equation separately. I lost why we moved from this step to the next. One sentence between them would help.”","conceptual bridge"],
 ];quotes.forEach((q,i)=>{const y=178+i*140;rect(s,92,y,1095,112,i===1?C.pale:C.white,16,C.line,1);tx(s,q[0],130,y+17,820,75,22,C.ink,{italic:true,bold:i===0});label(s,q[1],970,y+42,185,i===1?C.copper:C.teal)});tx(s,"Interpretation: equations, figures and labels can modify input by confirming relationships, not merely decorating the page.",145,607,990,34,19,C.red,{bold:true,align:"center"});footer(s,"Fictional demonstration language based on the interview guide and project themes");notes(s,"These excerpts are newly generated for the demo presentation and should never be attributed to real students.");
}

// 16 IR quotes
{
 const s=addSlide();s.background.fill=C.paper;title(s,"International Relations readers negotiated competing meanings","Synthetic excerpts",21);tag(s,"generated demo excerpts",980,40,230);const quotes=[
  ["“Power and security look like normal words, but each theory makes them different. I need the chapter to mark whose meaning I am reading.”","term ownership"],
  ["“Uh, the example was clear, but I could not see whether it supported realism or criticised it. The relationship was not signalled.”","rhetorical relation"],
  ["“A comparison table helps me start, but it cannot replace the explanation because theories overlap and authors disagree.”","qualified visual support"],
 ];quotes.forEach((q,i)=>{const y=178+i*140;rect(s,92,y,1095,112,i===1?C.sand:C.white,16,C.line,1);tx(s,q[0],130,y+17,820,75,22,C.ink,{italic:true,bold:i===0});label(s,q[1],970,y+42,185,i===1?C.copper:C.teal)});tx(s,"Interpretation: support must expose perspective, qualification and comparison without presenting contested concepts as fixed facts.",135,607,1010,34,19,C.red,{bold:true,align:"center"});footer(s,"Fictional demonstration language based on the interview guide and project themes");notes(s,"These excerpts are generated, reflecting the user's requested contrast between disciplines without claiming that social-science knowledge is merely subjective.");
}

// 17 disciplinary nuance
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Disciplinary difference changes the form of useful support","Interpretation",22);
 rect(s,85,188,515,350,C.navy,18);label(s,"Electrical Engineering",120,220,330,C.amber);tx(s,"Meaning often travels across prose, formulae, diagrams and worked procedures.",120,270,420,72,24,C.white,{bold:true});tx(s,"Stable symbol systems and testable relations can give readers an additional route to check meaning.",120,365,420,85,20,C.white);tx(s,"Risk: a missing label, assumption or bridge can obstruct the entire procedure.",120,470,420,47,18,C.teal2,{bold:true});
 rect(s,680,188,515,350,C.white,18,C.line,1);label(s,"International Relations",715,220,350,C.teal);tx(s,"Meaning often depends on theoretical perspective, historical context and qualified argument.",715,270,420,72,24,C.ink,{bold:true});tx(s,"Everyday words may become contested disciplinary concepts whose meaning changes across theories.",715,365,420,85,20,C.muted);tx(s,"Risk: a table can clarify comparison but may erase overlap, disagreement or uncertainty.",715,470,420,47,18,C.copper,{bold:true});
 tx(s,"The framework therefore evaluates disciplinary fit rather than assuming one universal modification recipe.",160,586,960,45,23,C.red,{bold:true,align:"center"});cite(s,"Mauranen et al., 2016, p. 50; disciplinary application is a MIWAE inference");footer(s);notes(s,"Avoid a simple objective-versus-subjective binary. The defensible contrast concerns semiotic resources and epistemic organisation.");
}

// 19 F1-F3 table
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Located textbook examples across the seven functions","Textbook evidence",24);
 const values=[
  ["Function","Book and location","Observable form","Potential support"],
  ["1  Meaning access","Goldstein, p. 66","Direct disciplinary definition of power","Scopes a familiar word"],
  ["2  Orientation","Baylis, p. 433","Reader’s Guide previews chapter purpose","Shows the route before detail"],
  ["3  Rhetorical relations","Sedra, p. 39","‘On the other hand’ marks a contrast","Makes a scope difference visible"],
  ["4  Background knowledge","Blanton, p. 278","Formal and familiar labels for drones","Connects new and shared knowledge"],
  ["5  Conceptual continuity","Hambley, p. 571","‘Recall from Section 2.6’","Reactivates a required method"],
  ["6  Reader engagement","Sedra, p. 90","Embedded exercise on op-amp terminals","Supports immediate self-checking"],
  ["7  Multimodal scaffolding","Sadiku, sampled chapters","Figure references with labelled circuit diagrams","Coordinates prose, symbols and visuals"],
 ];
 const tb=s.tables.add({rows:8,columns:4,left:62,top:166,width:1160,height:468,columnWidths:[220,245,345,350],values});addTableStyle(tb,8,4,true,12.5);for(let r=0;r<8;r++)tb.rows[r].height=r===0?45:60;
 tx(s,"Function is coded from local rhetorical purpose; form alone does not establish ELFA friendliness or distribution.",150,642,980,23,15,C.red,{bold:true,align:"center"});footer(s);
 notes(s,"These are located illustrations from the reviewed textbooks. The first six examples come from concordance checking in the nine complete text layers. The seventh summarises the recurring alignment of figure references and labelled circuit diagrams in the Sadiku sample. Do not use this slide to claim whole-book prevalence. Distribution requires a defined denominator and systematic sampling, which is introduced later.");
}

// 21 visual
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Visual scaffolding varied sharply by discipline","Cross-source demonstration",26);tag(s,"synthetic interviews",78,166,205,C.copper);tag(s,"nine full texts",666,166,180,C.teal);rect(s,78,213,500,330,C.white,18,C.line,1);tx(s,"8 / 10",120,255,190,70,50,C.teal,{bold:true});tx(s,"EE interviewees named a graph, table, diagram or worked visual as helpful",120,342,390,95,23,C.ink,{bold:true});tx(s,"0 / 10 IR interviewees did so spontaneously",120,468,390,45,18,C.muted);
 const cats=["Sadiku","Hambley","Sedra","Oppenheim","Goldstein","Blanton","Mingst","Baylis","Dunne"],vals=[158.25,66.61,66.43,47.44,5.95,3.15,1.81,1.20,0.63];const pts=cats.map((_,i)=>({idx:i,fill:i<4?C.teal:C.copper}));const ch=s.charts.add("bar",{position:{left:630,top:207,width:580,height:365},categories:cats,series:[{name:"Figure references per 10k words",values:vals,fill:C.teal,points:pts}],barOptions:{direction:"bar",grouping:"clustered",gapWidth:28},hasLegend:false,xAxis:{visible:true,min:0,max:170,majorUnit:50,title:"Figure references per 10,000 words",textStyle:{typeface:FONT,fontSize:11,fill:C.muted},majorGridlines:{fill:C.line,width:1}},yAxis:{visible:true,textStyle:{typeface:FONT,fontSize:10,fill:C.muted}},dataLabels:{showValue:true,position:"outEnd",textStyle:{typeface:FONT,fontSize:10,fill:C.ink,bold:true}},chartFill:C.paper,plotAreaFill:C.paper,chartLine:{fill:"none",width:0}});applyPresentationChartFont(ch,{fontFamily:FONT});tx(s,"The difference motivates a criterion. Figure references remain a proxy rather than a count of images.",145,605,990,32,19,C.red,{bold:true,align:"center"});footer(s);notes(s,"The interview counts are synthetic. Figure-reference densities are descriptive counts from four complete EE texts and five complete IR texts. Mano is excluded because only five OCR passages are available.");
}

// 22 matched-passage comparison
{
 const s=addSlide();s.background.fill=C.paper;title(s,"IR prose carried more conventional readability burden","Text Inspector findings",27);tag(s,"50 matched passages",982,40,205,C.teal);tx(s,"Five books per field, five passages per book, 170–205 words, five page strata",92,163,1090,28,17,C.muted,{bold:true,align:"center"});
 const values=[
  ["Metric","Engineering mean","IR mean","Observed signal"],
  ["Flesch–Kincaid grade","13.05","14.98","IR higher"],
  ["Flesch reading ease","40.86","30.49","IR lower, indicating harder prose"],
  ["Gunning Fog","16.47","18.46","IR higher"],
  ["Average sentence length","22.14","24.08","IR longer"],
  ["Academic word tokens","15.60%","14.28%","EE slightly higher"],
  ["Lexical diversity, VOCD","61.52","99.95","IR substantially higher"],
  ["Metadiscourse tokens","8.70%","8.15%","Similar discipline means"],
 ];const tb=s.tables.add({rows:8,columns:4,left:70,top:205,width:1140,height:390,columnWidths:[330,190,170,450],values});addTableStyle(tb,8,4,true,13.5);for(let r=0;r<8;r++)tb.rows[r].height=r===0?47:49;tx(s,"These tools describe linguistic form. They do not measure conceptual accessibility, visual support or ELFA friendliness.",150,615,980,28,17,C.red,{bold:true,align:"center"});cite(s,"Text Inspector v2.0, reading mode, 19 Sep 2026; discipline means across 25 passages each");footer(s);notes(s,"The analysis uses five stratified passages from each of ten books. Hambley and Mano replace the previously unsuitable Engineering materials. Mano passages were recovered by OCR. Lower Flesch reading ease and higher grade and Fog scores indicate greater conventional readability burden in the IR sample.");
}

// 24 discussion
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Language burden and support operate through different routes","Integrated interpretation",29);
 rect(s,80,184,535,375,C.navy,18);label(s,"Convergence",115,216,300,C.amber);tx(s,"Engineering",115,266,420,28,21,C.white,{bold:true});tx(s,"Students valued figures, labels and bridges between procedural steps. The full-text corpus also contained far more figure references.",115,305,445,94,19,C.white);tx(s,"International Relations",115,420,420,28,21,C.white,{bold:true});tx(s,"Students valued perspective marking, qualification and comparison. The matched prose sample showed longer sentences and much higher lexical diversity.",115,459,445,84,19,C.white);
 rect(s,685,184,515,375,C.white,18,C.line,1);label(s,"Boundaries of the claim",720,216,390,C.copper);tx(s,"Readability scores cannot establish ELFA friendliness.",720,276,430,48,20,C.ink,{bold:true});tx(s,"Figure references are a proxy rather than an image count.",720,348,430,48,20,C.ink,{bold:true});tx(s,"Synthetic interview patterns illustrate the framework but cannot validate it.",720,420,430,63,20,C.ink,{bold:true});tx(s,"The coursebook decision must combine reader evidence with function, form, placement and disciplinary fit.",720,505,430,45,17,C.red,{bold:true});
 cite(s,"Interpretation combines synthetic interview evidence with descriptive ten-book pilot analyses");footer(s);notes(s,"The disciplinary contrast concerns semiotic resources and epistemic organisation, not a simple objective-versus-subjective binary. Treat the numerical findings as descriptive pilot evidence.");
}

// 23 axes
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Function, form and distribution answer different questions","MIWAE analytic structure",30);const axes=[["FUNCTION","What reader need is addressed?",C.teal],["FORM","Which observable textual, visual or numeric device supplies it?",C.copper],["DISTRIBUTION","How reliably is that device available across eligible points of need?",C.amber],["READER EVIDENCE","Do students notice, use or still need the support?",C.navy]];axes.forEach((a,i)=>{const x=72+i*300;rect(s,x,184,268,235,C.white,18,C.line,1);rect(s,x,184,268,14,a[2],12);label(s,a[0],x+24,226,220,a[2]);tx(s,a[1],x+24,286,220,105,21,C.ink,{bold:true,align:"center",valign:"middle"})});rect(s,90,458,1100,152,C.pale,18);tx(s,"TEXTUAL DISTRIBUTION",120,480,270,24,15,C.teal,{bold:true});tx(s,"Coverage: support at 4 of 6 eligible first introductions",120,516,475,25,17,C.ink,{bold:true});tx(s,"Timing: 3 at first mention, 1 delayed",120,551,475,25,17,C.ink);tx(s,"Spread: support appears in 4 of 5 sampled chapters",120,580,475,25,17,C.ink);tx(s,"PERCEIVED DISTRIBUTION",680,480,310,24,15,C.copper,{bold:true});tx(s,"9 of 20 participants mention the need or support",680,521,425,48,18,C.ink,{bold:true});tx(s,"Keep this separate from the textbook count.",680,574,425,24,16,C.muted);cite(s,"Terminology adapted from Mauranen et al., 2016, p. 46; MIWAE operationalises distribution through coverage, timing and spread");footer(s);notes(s,"Distribution is conditional on eligible opportunities. Define the denominator before coding. A definition is eligible at a term's first required use; a conceptual bridge is eligible where a new explanation depends on earlier content. Textual distribution and participant-mentioned distribution answer different questions and must not be combined.");
}

// 24 CEFR mapping
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Forms and distributions use explicit coding indicators","Framework overview",31);
 const values=[
  ["Function","Observable forms to code","Distribution indicators"],
  ["1  Access to disciplinary meanings","Definition, gloss, adjacent paraphrase, worked example","First-use coverage, proximity to the term, recurrence when meaning shifts"],
  ["2  Orientation and navigation","Preview, roadmap, heading, recap, cross-reference","Coverage at openings and transitions, chapter spread, consistency"],
  ["3  Rhetorical relations and importance","Contrast, cause or qualification marker, importance cue","Coverage of eligible relations, placement before or after the claim, dispersion across modes"],
  ["4  Background knowledge","Context note, analogy, familiar label, local-reference gloss","Coverage at assumed-knowledge points, timing, purposeful repetition"],
  ["5  Conceptual continuity","Recall cue, bridge, restatement, backward or forward reference","Coverage at conceptual dependencies, distance from prior content, recurrence"],
  ["6  Reader engagement and self-monitoring","Question, self-check, pause prompt, worked reasoning","Density per section, placement after the learning point, feedback availability"],
  ["7  Multimodal and numeric scaffolding","Label, caption, figure reference, worked graph, aligned notation","Coverage of visual opportunities, co-location with prose, cross-chapter consistency"],
 ];const tb=s.tables.add({rows:8,columns:3,left:58,top:166,width:1165,height:465,columnWidths:[325,390,450],values});addTableStyle(tb,8,3,true,12.1);for(let r=0;r<8;r++)tb.rows[r].height=r===0?45:60;tx(s,"Distribution needs a denominator: supported opportunities ÷ eligible opportunities in the matched sample.",150,638,980,24,15,C.red,{bold:true,align:"center"});footer(s);notes(s,"The forms are an open coding inventory rather than a closed checklist. Distribution is recorded with an explicit denominator, timing and spread. An opportunity counts as eligible only when the relevant communicative need exists in that location.");
}

// 25 workflow for syllabus designers
{
 const s=addSlide();s.background.fill=C.paper;title(s,"MIWAE coursebook-fit review in six steps","Selection procedure",32);
 const steps=[
  ["1","Profile the course and readers","English level, year, prior knowledge and reading tasks"],
  ["2","Set priorities before inspecting books","Mark each dimension essential, supporting or not applicable"],
  ["3","Sample the same locations in every candidate","Openings, term introductions, transitions, complex examples and chapter closes"],
  ["4","Code function, form and distribution","Record the device, eligible opportunity, timing and chapter spread"],
  ["5","Rate support and tag the evidence","Use 0–3 plus T, TP or TPC evidence status"],
  ["6","Choose, supplement or reconsider","Apply the decision rule and document required teaching support"],
 ];steps.forEach((a,i)=>{const col=i%3,row=i<3?0:1,x=65+col*405,y=180+row*205;numCard(s,a[0],a[1],a[2],x,y,365,170,i===5?C.copper:C.teal,i===5)});tx(s,"Use identical samples and priorities for every candidate book to prevent post hoc scoring.",210,614,860,28,18,C.red,{bold:true,align:"center"});footer(s);notes(s,"This procedure turns the framework into a reproducible local selection instrument for syllabus designers.");
}

// 26 rubric A
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Coursebook-fit rubric, dimensions 1–4","Selection scale",33);
 const values=[
  ["Dimension and review question","0  Unsupported","1  Limited","2  Adequate","3  Systematic"],
  ["1  Meaning access\nAre key terms unpacked where first needed?","No explanation or misleading explanation","Gloss appears late, rarely or without context","Accurate local explanation at main points of need","Terms, examples and references remain consistently aligned"],
  ["2  Orientation\nCan readers see where the explanation is going?","Structure and purpose remain opaque","Headings exist but transitions are weak","Useful previews, recaps and cross-references","Orientation recurs at major conceptual transitions"],
  ["3  Rhetorical relations\nAre claims, contrasts and qualifications visible?","Relations are obscured or mis-signalled","Some markers, with important gaps","Main relations and conditions are explicit","Relations remain explicit across prose, examples and visuals"],
  ["4  Background knowledge\nIs non-shared context made accessible?","Essential context is assumed","Context appears after it is required","Concise context or analogy appears at need","Context is calibrated and revisited without overload"],
 ];const tb=s.tables.add({rows:5,columns:5,left:54,top:170,width:1170,height:460,columnWidths:[325,200,210,210,225],values});addTableStyle(tb,5,5,true,12.2);for(let r=0;r<5;r++)tb.rows[r].height=r===0?55:101;tx(s,"Rate sampled locations, not impressions of the whole book. Use N/A only when the dimension is genuinely irrelevant.",150,641,980,24,15,C.red,{bold:true,align:"center"});footer(s);notes(s,"This rubric is a provisional decision aid. It has not undergone reliability or validity testing.");
}

// 27 rubric B
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Coursebook-fit rubric, dimensions 5–7 and gates","Selection scale",34);
 const values=[
  ["Dimension and review question","0  Unsupported","1  Limited","2  Adequate","3  Systematic"],
  ["5  Conceptual continuity\nAre prerequisites reactivated at dependence?","Earlier concepts are silently assumed","Connections are distant or inconsistent","Bridges and recall cues appear at key dependencies","Connections build a visible cumulative knowledge path"],
  ["6  Reader engagement\nCan readers check or monitor understanding?","No usable self-check route","Prompts are generic or detached","Questions and checks match the learning point","Checks recur with feedback or worked reasoning"],
  ["7  Multimodal support\nDo prose, visuals and notation explain one another?","Modes conflict or essential labels are missing","Visuals exist but links are weak","Labels and references support interpretation","Modes are deliberately sequenced and mutually explanatory"],
 ];const tb=s.tables.add({rows:4,columns:5,left:54,top:170,width:1170,height:355,columnWidths:[325,200,210,210,225],values});addTableStyle(tb,4,5,true,12.2);for(let r=0;r<4;r++)tb.rows[r].height=r===0?55:100;rect(s,84,555,1110,70,C.navy,14);tx(s,"Mandatory gates",110,573,180,25,15,C.amber,{bold:true});tx(s,"disciplinary accuracy · precision preserved · no native-speaker deficit assumption · fit with the course’s epistemic and multimodal practices",300,566,860,42,16,C.white,{bold:true,align:"center"});footer(s);notes(s,"Any accuracy failure overrides a high support rating. The cross-cutting gates protect against oversimplification and inappropriate standardisation.");
}

// 28 evidence and decision
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Evidence tags and the coursebook decision rule","Selection decision",35);
 const ev=[
  ["T","Text only","Located feature with page and sampled denominator"],
  ["TP","Text + perception","Feature linked to student accounts"],
  ["TPC","Text + perception + comprehension","Feature also supported by outcome evidence"],
 ];ev.forEach((a,i)=>{const y=177+i*94;rect(s,78,y,530,72,C.white,14,C.line,1);rect(s,78,y,75,72,i===2?C.navy:C.teal,14);tx(s,a[0],78,y+17,75,35,20,C.white,{bold:true,align:"center"});tx(s,a[1],180,y+9,180,26,18,C.ink,{bold:true});tx(s,a[2],370,y+8,215,48,15,C.muted)});
 const dec=[
  ["CHOOSE","Every essential dimension ≥2 and all gates pass",C.teal],
  ["CHOOSE + SUPPLEMENT","One essential dimension =1 and the gap can be covered explicitly",C.copper],
  ["RECONSIDER","Any essential dimension =0, repeated placement failure, or an accuracy gate fails",C.red],
 ];dec.forEach((a,i)=>{const y=177+i*116;rect(s,680,y,515,94,i===0?C.pale:C.white,14,C.line,1);label(s,a[0],710,y+14,240,a[2]);tx(s,a[1],710,y+47,450,38,16,C.ink,{bold:true})});
 rect(s,105,520,1070,90,C.sand,16);tx(s,"Priority is set before review: E = essential, S = supporting, N/A = irrelevant. Compare books dimension by dimension. Do not publish a universal total score until the instrument is validated.",145,538,990,55,18,C.ink,{bold:true,align:"center"});footer(s);notes(s,"The tags separate what the text visibly contains from what readers report and what comprehension evidence demonstrates.");
}

// 29 conclusion
{
 const s=addSlide();s.background.fill=C.navy;label(s,"Conclusion",78,55,260,C.amber);tx(s,"ELFA friendliness becomes reviewable when reader needs are tied to observable textbook choices.",78,120,1090,125,42,C.white,{bold:true});const pts=[["1","The literature positions MIWAE between written EAP and communication-oriented academic ELF."],["2","The ten-book pilot shows why language burden, visual support and disciplinary meaning must be interpreted together."],["3","The rubric and the open API make the review process inspectable while preserving disciplinary precision."]];pts.forEach((p,i)=>{const y=300+i*93;rect(s,84,y,54,54,i===2?C.copper:C.teal,27);tx(s,p[0],84,y+9,54,36,20,C.white,{bold:true,align:"center"});tx(s,p[1],165,y-1,960,65,22,C.white,{bold:true,valign:"middle"})});tx(s,"MIWAE v0.4 · framework with an open analysis API prototype",78,650,580,25,14,C.teal2,{bold:true});notes(s,"Invite the audience to test whether the dimensions and decision rule capture what they value when choosing EMI textbooks.");
}

// 30 appendix limitations
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Evidence status and next validation steps","Appendix",37);const values=[
  ["Evidence layer","Current status","Next requirement"],
  ["Student records and interviews","Synthetic demonstration data","Collect real data under confirmed ethics and translation procedures"],
  ["Textbook corpus","10 books; 9 complete texts and 1 OCR sample","Complete Mano OCR and verify matched locations across editions"],
  ["Readability comparison","50 passages across 10 books","Repeat with independent sampling and treat CEFR as one linguistic lens"],
  ["MIWAE rubric","Provisional 0–3 decision aid","Pilot with syllabus designers; double-code; test inter-rater agreement"],
  ["Corpus analysis API","Open v0.1 prototype; 50-passage pilot; seven automated tests","Extend parser rules; adjudicate candidates; version the codebook"],
  ["Comprehension effect","Not tested","Compare original and revised passages with comprehension outcomes"],
 ];const tb=s.tables.add({rows:7,columns:3,left:72,top:168,width:1135,height:435,columnWidths:[290,365,480],values});addTableStyle(tb,7,3,true,12.7);for(let r=0;r<7;r++)tb.rows[r].height=r===0?48:64;tx(s,"The presentation demonstrates a research and selection procedure; it does not report completed empirical findings.",150,622,980,30,18,C.red,{bold:true,align:"center"});footer(s);notes(s,"The accepted abstract's past-tense findings language must be reconciled with the actual research status before conference use.");
}

// 31 references
{
 const s=addSlide();s.background.fill=C.paper;title(s,"Selected references","Appendix",38);
 const left=[
  "Biber, D., Johansson, S., Leech, G., Conrad, S., & Finegan, E. (1999). Longman Grammar of Spoken and Written English.",
  "Björkman, B. (2013). English as an Academic Lingua Franca.",
  "Canale, M., & Swain, M. (1980). Theoretical bases of communicative approaches.",
  "Council of Europe. (2020). CEFR Companion Volume.",
  "Evans, S., & Morrison, B. (2011). Meeting the challenges of English-medium higher education.",
  "Jenkins, J., & Mauranen, A. (Eds.). (2019). Linguistic Diversity on the EMI Campus."
 ];
 const right=[
  "Mauranen, A., Hynninen, N., & Ranta, E. (2016). English as the academic lingua franca.",
  "McKinley, J. (2025). Beyond Proficiency: Rethinking Preparedness in English-Medium Instruction. TESOL Journal, e70080.",
  "Quirk, R., Greenbaum, S., Leech, G., & Svartvik, J. (1985). A Comprehensive Grammar of the English Language.",
  "Seidlhofer, B. (2011). Understanding English as a Lingua Franca.",
  "Text Inspector. (2026). Text analysis platform, v2.0.",
  "English Profile. English Vocabulary Profile and English Grammar Profile.",
  "MIWAE Corpus Analysis API. (2026). Version 0.1, open research prototype."
 ];
 rect(s,70,166,545,430,C.white,18,C.line,1);rect(s,665,166,545,430,C.white,18,C.line,1);
 left.forEach((v,i)=>tx(s,v,95,190+i*64,495,54,14,C.ink,{bold:i===5}));right.forEach((v,i)=>tx(s,v,690,185+i*56,495,49,13.4,C.ink,{bold:i===0||i===1||i===2||i===6}));
 tx(s,"Full bibliographic details and textbook editions should be finalised in the paper and conference handout.",180,620,920,30,16,C.muted,{align:"center"});footer(s);
 notes(s,"The ICLHE logo and palette are taken from the official association website: https://www.iclhe.org/. Verify the final bibliography against the conference paper and the editions actually analysed.");
}

const staging=path.join(buildDir,".codex-finalizer-intro-v1");await fs.mkdir(staging,{recursive:true});const candidate=path.join(staging,"candidate.pptx");await (await PresentationFile.exportPptx(pres)).save(candidate);
const tableSlides=[18,20,23,25,26,29];
const requirements={explicitTotalSlideCount:30,requiredNativeTableOwnerSlides:tableSlides,requiredNativeChartOwnerSlides:[14,19],materializeLiteralChartWorkbooks:true,sourceTemplatePath:"/Users/mehmetaltay/Desktop/MIWAE Project/Presentation/MIWAE_ELFA_Friendliness_Framework_Enhanced_Final_2026-09-19.pptx"};
const result=await finalizePresentation({...requirements,workspaceDir,candidatePath:candidate,finalPath:FINAL_PPTX,pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_package_integrity.py"),layoutValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_layout_geometry.py"),layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-bullet-geometry","--validate-heading-fit",...tableSlides.flatMap(n=>["--require-native-table-slide",String(n)])],fontPolicy:{basis:"reference",families:[FONT],referencePath:"/Users/mehmetaltay/Desktop/MIWAE Project/Presentation/MIWAE_ELFA_Friendliness_Framework_Enhanced_Final_2026-09-19.pptx",referenceSha256:"e9190a7ff3586d7dadd7247eb3d15af6356981529e4a12114010dca4d7a2189d"},verifyArtifactToolImport:true,receiptPath:path.join(staging,"MIWAE_intro_reordered_v1.validation.json")});
console.log(JSON.stringify({final:FINAL_PPTX,result},null,2));
