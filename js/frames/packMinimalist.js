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
function updateTextPositions(rulesHeight) {
    // Calculate positions based on rules text height
    const rulesY = card.minimalist.baseY - rulesHeight;
    const typeY = rulesY - card.minimalist.spacing;
    const titleY = typeY - card.minimalist.spacing;

    // Update positions of all text elements
    if (card.text.rules) {
        card.text.rules.y = rulesY;
        card.text.rules.height = rulesHeight;
    }
    if (card.text.type) {
        card.text.type.y = typeY;
    }
    if (card.text.title) {
        card.text.title.y = titleY;
    }

    return { rulesY, typeY, titleY };
}
function measureTextHeight(text, ctx, width, fontSize) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > width) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    
    return lines.length * fontSize * 1.2; // 1.2 for line spacing
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
				name: 'Rules Text',
				text: '',
				x: 0.086,
				y: card.minimalist.baseY - card.minimalist.currentHeight,
				width: 0.771,
				height: card.minimalist.currentHeight,
				size: 0.033,
				outlineWidth: 0.008,
				font: 'Plantin MT Pro',
				color: 'white',
				oneLine: false,
				align: 'left',
				scale: function(text) {
					// Clear canvas for measurements
					card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
					
					let currentHeight = card.minimalist.minHeight;
					let textFits = false;
					
					while (!textFits && currentHeight <= card.minimalist.maxHeight) {
						// Set up context for measurement
						card.minimalist.ctx.font = `${this.size * card.height}px "${this.font}"`;
						
						// Measure text at current height
						const actualTextHeight = measureTextHeight(
							text,
							card.minimalist.ctx,
							this.width * card.width,
							this.size * card.height
						);
						
						// Check if text fits current height
						if (actualTextHeight <= currentHeight * card.height) {
							textFits = true;
						} else {
							// Increase height and try again
							currentHeight = Math.min(
								currentHeight + 0.05, // Increment by 5%
								card.minimalist.maxHeight
							);
						}
					}
					
					// Update positions with final height
					card.minimalist.currentHeight = currentHeight;
					updateTextPositions(currentHeight);
					
					console.log('Text scaling:', {
						originalText: text,
						finalHeight: currentHeight,
						textFits: textFits
					});
					
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
            const currentText = document.querySelector('#text-editor').value;
            textEdited(); // Update text content first
            requestAnimationFrame(() => {
                card.text.rules.scale(currentText); // Use actual text content for scaling
            });
            console.log('Text changed:', currentText); // Debug log
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