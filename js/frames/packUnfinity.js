//Create objects for common properties across available frames
var masks = [{src:'/img/frames/unfinity/maskUnfinityTitlePinlines.png', name:'Title Pinlines'}, {src:'/img/frames/unfinity/maskUnfinityTitle.png', name:'Title'}, {src:'/img/frames/unfinity/maskUnfinityLand.png', name:'Land Symbol'}, {src:'/img/frames/unstable/pinline.svg', name:'Bottom'}];
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/unfinity/unfinityFrameW.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/unfinity/unfinityFrameU.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/unfinity/unfinityFrameB.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/unfinity/unfinityFrameR.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/unfinity/unfinityFrameG.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/unfinity/unfinityFrameM.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/unfinity/unfinityFrameA.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/unfinity/unfinityFrameC.png', masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'unfinity';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9196};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.5, y:-0.0639, width:0.12, height:0.0410, vertical:'center', horizontal: 'center'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:-1, y:-1, width:0.0007, height:0.0005};
	resetWatermark();
	//text
	loadTextOptions({
		title: {name:'Title', text:'', x:0.0854, y:0.0024, width:0.8292, height:0.0639, oneLine:true, font:'belerenb', size:0.0381, color:'white', align:'center'},
	});
}
//loads available frames
loadFramePack();