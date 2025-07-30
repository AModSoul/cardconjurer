//Create objects for common properties across available frames
var bounds3 = {x:0, y:0, width:1, height:1};
//defines available frames
availableFrames = [
	{name:'White Nickname', src:'/img/frames/m15/japanShowcase/nickname/w.png', bounds:bounds3},
	{name:'Blue Nickname', src:'/img/frames/m15/japanShowcase/nickname/u.png', bounds:bounds3},
	{name:'Black Nickname', src:'/img/frames/m15/japanShowcase/nickname/b.png', bounds:bounds3},
	{name:'Red Nickname', src:'/img/frames/m15/japanShowcase/nickname/r.png', bounds:bounds3},
	{name:'Green Nickname', src:'/img/frames/m15/japanShowcase/nickname/g.png', bounds:bounds3},
	{name:'Multicolored Nickname', src:'/img/frames/m15/japanShowcase/nickname/m.png', bounds:bounds3},
	{name:'Artifact Nickname', src:'/img/frames/m15/japanShowcase/nickname/a.png', bounds:bounds3},
	{name:'Land Nickname', src:'/img/frames/m15/japanShowcase/nickname/L.png', bounds:bounds3}
	];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;

//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
    //resets things so that every frame doesn't have to
    // Store existing text
    const savedText = {};
    if (card.text) {
        for (const key in card.text) {
            if (card.text[key] && card.text[key].text) {
                savedText[key] = card.text[key].text;
            }
        }
    }

    await resetCardIrregularities();

    //sets card version
    card.version = 'Minimalist';
    card.onload = '/js/frames/versionMinimalist.js';
    await loadScript('/js/frames/versionMinimalist.js');

    // Add a small delay and check if functions are available
    await new Promise(resolve => setTimeout(resolve, 50));
	
    card.minimalist = {
        baseY: 0.9,
        minHeight: 0.10,
        maxHeight: 0.30,
        spacing: 0.05,
        currentHeight: 0.15,
        ctx: textContext,
    };

    // Initialize gradient options - this ensures the gradient system is enabled
    card.gradientOptions = {
        maxOpacity: 0.75
    };

    //art bounds
    card.artBounds = {x:0, y:0, width:1, height:1};
    autoFitArt();
    
    //set symbol bounds
    card.setSymbolBounds = {x:0.91, y:0.635, width:0.12, height:0.0410, vertical:'center', horizontal: 'right'};
    resetSetSymbol();
    
    //watermark bounds
    card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
    resetWatermark();

    loadTextOptions({
        mana: {
            name: 'Mana Cost',
            text: '',
            x: 0.090, // Align with title
            y: card.minimalist.baseY - card.minimalist.currentHeight - 
               card.minimalist.spacing - 0.12, // Position above title
            width: 0.9190,
            height: 71/2100,
            oneLine: true,
            size: 71/1638,
            align: 'left',
            shadowX: -0.001,
            shadowY: 0.0029,
            manaCost: true,
            manaSpacing: 0
        },
			title: {
				name: 'Title',
				text: '',
				x: 0.090,
				y: card.minimalist.baseY - card.minimalist.currentHeight - 
				   card.minimalist.spacing - 0.08,
				width: 0.8292,
				height: 0.0543,
				oneLine: true,
				font: 'belerenb',
				size: 0.0381,
				color: 'white',
				align: 'left'
			},
			type: {
				name: 'Type',
				text: '',
				x: 0.0854,
				y: card.minimalist.baseY - card.minimalist.currentHeight - 
				   card.minimalist.spacing - 0.04,
				width: 0.71,
				height: 0.0543,
				oneLine: true,
				font: 'belerenb',
				size: 0.0279,
				color: 'white'
			},
			rules: {
				name: 'Rules Text',
				text: '',
				x: 0.086,
				y: card.minimalist.baseY - card.minimalist.currentHeight,
				width: 0.771,
				height: card.minimalist.currentHeight,
				size: 0.033,
				font: 'Plantin MT Pro',
				color: 'white',
				oneLine: false,
				align: 'left',
			},
			pt: {
				name: 'Power/Toughness',
				text: '',
				x: 0.804,
				y: 0.896,
				width: 0.1180,
				height: 0.049,
				size: 0.04,
				outlineWidth: 0.008,
				font: 'belerenbsc',
				oneLine: true,
				align: 'center',
				color: 'white'
			}
		}, true);

    // Let the version script handle everything else
    window.initializeMinimalistVersion(savedText);
};

//loads available frames
loadFramePack();