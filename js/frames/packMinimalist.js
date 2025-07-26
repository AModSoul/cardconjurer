//Create objects for common properties across available frames
var bounds3 = {x:0, y:0, width:1, height:1};
function createDynamicTextCanvas() {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = card.width;
    textCanvas.height = card.height;
    textCanvas.id = 'dynamicTextCanvas';
    const ctx = textCanvas.getContext('2d');
    return { canvas: textCanvas, ctx: ctx };
}
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

    // Create and store dynamic text canvas
    const dynamicCanvas = document.createElement('canvas');
    dynamicCanvas.width = card.width;
    dynamicCanvas.height = card.height;
    card.minimalist = {
        baseY: 0.9,
        minHeight: 0.15,
        maxHeight: 0.6,
        spacing: 0.05,
        currentHeight: 0.15,
        canvas: dynamicCanvas,
        ctx: dynamicCanvas.getContext('2d')
    };

    //art bounds
    card.artBounds = {x:0, y:0, width:1, height:0.9224};
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
            y: 0.0683,
            width: 0.9190,
            height: 71/2100,
            oneLine: true,
            size: 71/1638,
            align: 'right',
            shadowX: -0.001,
            shadowY: 0.0029,
            manaCost: true,
            manaSpacing: 0
        },
        nickname: {
                name: 'Nickname',
                text: '',
                x: 0.090,
                y: 0.0582,
                width: 0.8292,
                height: 0.0543,
                outlineWidth: 0.008,
                oneLine: true,
                font: 'belerenb',
                size: 0.0381,
                color: 'white'
            },
			title: {
				name: 'Title',
				text: '',
				x: 0.14,
				y: card.minimalist.baseY - card.minimalist.currentHeight - 
				   card.minimalist.spacing - 0.08,
				width: 0.768,
				height: 0.0243,
				oneLine: true,
				outlineWidth: 0.0065,
				font: 'mplantin',
				size: 0.0229,
				color: 'white',
				align: 'right'
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
				outlineWidth: 0.008,
				color: 'white'
			},
			rules: {
				// ...existing properties...
				scale: function(text) {
					// Clear canvas for measurements
					card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
					card.minimalist.ctx.font = `${this.size * card.height}px "${this.font}"`;
					
					// Split text and measure
					const lines = text.split('\n');
					const lineHeight = this.size * 1.2; // 120% line height
					
					// Calculate height as percentage of card height
					const heightPercentage = (lineHeight * lines.length) / card.height;
					
					// Update heights with proper percentage calculation
					const newHeight = Math.min(
						card.minimalist.maxHeight,
						Math.max(card.minimalist.minHeight, heightPercentage)
					);
					
					console.log('Text height calculation:', {
						lines: lines.length,
						lineHeight,
						heightPercentage,
						newHeight
					});
					
					// Update positions
					card.minimalist.currentHeight = newHeight;
					this.height = newHeight;
					this.y = card.minimalist.baseY - newHeight;
					
					// Move other elements
					if (card.text.type) {
						card.text.type.y = this.y - card.minimalist.spacing;
					}
					if (card.text.title) {
						card.text.title.y = card.text.type.y - card.minimalist.spacing;
					}
					
					// Force redraw
					drawTextBuffer();
					drawCard();
				}
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

    // Set up input listener
    const rulesInput = document.querySelector('#rules');
    if (rulesInput) {
        const newRulesInput = rulesInput.cloneNode(true);
        rulesInput.parentNode.replaceChild(newRulesInput, rulesInput);
        newRulesInput.addEventListener('input', function() {
            if (card.text.rules) {
                card.text.rules.scale(this.value);
            }
        });
    }

    // Restore saved text immediately after loading options
    for (const key in savedText) {
        if (card.text[key]) {
            card.text[key].text = savedText[key];
            if (key === 'rules') {
                requestAnimationFrame(() => {
                    card.text.rules.scale(savedText[key]);
                });
            }
        }
    }
};

//loads available frames
loadFramePack();