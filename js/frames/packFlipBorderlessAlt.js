//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/flip/borderlessAlt/masks/maskPinlines.png', name:'Pinline'}, {src:'/img/frames/m15/flip/borderlessAlt/masks/maskTwins.png', name:'Twins'}, {src:'/img/frames/m15/flip/borderlessAlt/masks/maskRules.png', name:'Rules'}, {src:'/img/frames/m15/flip/borderlessAlt/masks/maskNoBorder.png', name:'No Border'}, {src:'/img/frames/topHalfSharp.svg', name:'Top Half'}, {src:'/img/frames/bottomHalfSharp.svg', name:'Bottom Half'}, {src:'/img/frames/m15/flip/borderlessAlt/masks/maskBorder.png', name:'Border'}];
var masks2 = [{src:'/img/frames/topHalfSharp.svg', name:'Top PT'}, {src:'/img/frames/bottomHalfSharp.svg', name:'Bottom PT'}]
//var bounds = {x:0.0374, y:0.2277, width:0.9067, height:0.4762};
//defines available frames
availableFrames = [
	{name:'White Frame', src:'/img/frames/m15/flip/borderlessAlt/w.png', masks:masks},
	{name:'Blue Frame', src:'/img/frames/m15/flip/borderlessAlt/u.png', masks:masks},
	{name:'Black Frame', src:'/img/frames/m15/flip/borderlessAlt/b.png', masks:masks},
	{name:'Red Frame', src:'/img/frames/m15/flip/borderlessAlt/r.png', masks:masks},
	{name:'Green Frame', src:'/img/frames/m15/flip/borderlessAlt/g.png', masks:masks},
	{name:'Multicolored Frame', src:'/img/frames/m15/flip/borderlessAlt/m.png', masks:masks},
	{name:'Artifact Frame', src:'/img/frames/m15/flip/borderlessAlt/a.png', masks:masks},
	{name:'Land Frame', src:'/img/frames/m15/flip/borderlessAlt/l.png', masks:masks},
	{name:'Colorless Frame', src:'/img/frames/m15/flip/borderlessAlt/c.png', masks:masks},
	{name:'Vehicle Frame', src:'/img/frames/m15/flip/borderlessAlt/v.png', masks:masks},
    {name:'Black Alt Frame', src:'/img/frames/m15/flip/borderlessAlt/bAlt.png', masks:masks},
	{name:'White Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/w.png', masks:masks2},
	{name:'Blue Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/u.png', masks:masks2},
	{name:'Black Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/b.png', masks:masks2},
	{name:'Red Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/r.png', masks:masks2},
	{name:'Green Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/g.png', masks:masks2},
	{name:'Multicolored Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/m.png', masks:masks2},
	{name:'Artifact Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/a.png', masks:masks2},
	{name:'Land Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/l.png', masks:masks2},
	{name:'Colorless Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/c.png', masks:masks2},
	{name:'Vehicle Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/v.png', masks:masks2},
    {name:'Black Alt Power/Toughness', src:'/img/frames/m15/flip/borderlessAlt/pt/bAlt.png', masks:masks2}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'flip';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9262};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:1855/2010, y:2707/2814, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:174/2814, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
		title: {name:'Title 1', text:'', x:0.0854, y:146/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, color:'white'},
		type: {name:'Type 1', text:'', x:0.0854, y:699/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, color:'white'},
		rules: {name:'Rules Text 1', text:'', x:0.086, y:324/2814, width:0.828, height:0.12, size:0.0362, color:'white'},
		pt: {name:'Power/Toughness 1', text:'', x:0.8267, y:726/2814, width:0.0967, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', color:'white'},
		mana2: {name:'Mana Cost 2', text:'', x:1, y:2513/2814, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0, rotation:180},
		title2: {name:'Title 2', text:'', x:0.9147, y:2540/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0381, rotation:180, color:'white'},
		type2: {name:'Type 2', text:'', x:0.9147, y:1988/2814, width:0.8292, height:0.0543, oneLine:true, font:'belerenb', size:0.0324, rotation:180, color:'white'}, 
		rules2: {name:'Rules Text 2', text:'', x:0.914, y:2360/2814, width:0.828, height:0.12, size:0.0362, rotation:180, color:'white'},
		pt2: {name:'Power/Toughness 2', text:'', x:354/2010, y:1961/2814, width:0.0967, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center', rotation:180, color:'white'}
	  });
	}
//loads available frames
loadFramePack();