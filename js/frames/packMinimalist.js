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
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;

//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
    //resets things so that every frame doesn't have to
	card.preserveGradient = true;
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

	
    card.minimalist = {
        baseY: 0.93,
        minHeight: 0.10,
        maxHeight: 0.30,
        spacing: 0.05,
        currentHeight: 0.15,
        ctx: textContext,
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
				scale: function(text) {
					// Clear canvas for measurements
					card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
					card.minimalist.ctx.font = `${this.size * card.height}px "${this.font}"`;
					
					// Measure initial text height
					const actualTextHeight = measureTextHeight(
						text,
						card.minimalist.ctx,
						this.width * card.width,
						this.size * card.height
					);
					
					// Calculate needed height as percentage of card height
					const newHeight = Math.min(
						card.minimalist.maxHeight,
						Math.max(
							card.minimalist.minHeight,
							(actualTextHeight / card.height)
						)
					);
			
					// Batch updates to minimize redraws
					requestAnimationFrame(() => {
						// Update positions with final height
						card.minimalist.currentHeight = newHeight;
						updateTextPositions(newHeight);
						
						// Single redraw at the end
						drawTextBuffer();
						drawCard();
					});
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
	
// Store gradient configuration
try {
    const gradientConfig = {
        context: frameContext,
        color: 'rgb(0, 0, 0)', 
        startY: 1.1,
        height: 0.7,
        maxOpacity: 0.5, // Changed from 0.75 to 0.5 for 50% opacity
        fadeStart: 0.5,
        fadeLength: 0.2
    };

    // Draw gradient and store configuration
    const result = drawHorizontalGradient(gradientConfig);
    
    // Store complete config with gradient info
    card.gradientConfig = {
        enabled: true,
        ...gradientConfig,
        gradient: result.gradient,
        bounds: result.bounds,
        version: 'minimalist'
    };

    console.log('Gradient created successfully');

} catch (error) {
    console.error('Failed to create gradient:', error);
    card.gradientConfig = { enabled: false };
}
// Get text editor element
const textEditor = document.querySelector('#text-editor');

// Set up input listener
if (textEditor) {
    const debouncedScale = debounce((value) => {
        if (card.text.rules) {
            textEdited(); // Update text content first
            requestAnimationFrame(() => {
                card.text.rules.scale(value); // Scale using current text value
                console.log('Text scaling triggered:', {
                    text: value,
                    currentHeight: card.minimalist.currentHeight,
                    minHeight: card.minimalist.minHeight,
                    maxHeight: card.minimalist.maxHeight,
                    scale: card.text.rules.size // Add current scale value to log
                }); // Enhanced debug log
            });
        }
    }, 2000); // 2000ms = 2 seconds

    textEditor.addEventListener('input', function() {
        console.log('Text changed, waiting for pause...'); // Debug log
        debouncedScale(this.value);
    });
}

    // Restore saved text immediately after loading options
	for (const key in savedText) {
        if (card.text[key]) {
            card.text[key].text = savedText[key];
            if (key === 'rules' && savedText[key]) {
                textEdited(); // Update text content first
                requestAnimationFrame(() => {
                    card.text.rules.scale(savedText[key]); // Scale using saved text
                });
                console.log('Initial text loaded:', savedText[key]); // Debug log
            }
        }
	}
};
//loads available frames
loadFramePack();