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
	// Add the debounce function
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
function updateTextPositions(rulesHeight) {
    // Calculate positions based on rules text height
    const rulesY = card.minimalist.baseY - rulesHeight;
    const typeY = rulesY - (card.minimalist.spacing *0.9);
    const titleY = typeY - (card.minimalist.spacing * 0.65);
    const manaY = titleY - (card.minimalist.spacing * 0.6); // Add mana position above title

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
    if (card.text.mana) {
        card.text.mana.y = manaY;
    }

    // Update gradient to match the text area
    if (card.gradientOptions) {
        // We want:
        // 1. Solid from bottom (1.0) up to rules text start (rulesY)
        // 2. Fade from rules text start up to slightly above mana (manaY - 0.03)
        
        const fadeTopY = manaY - 0.05; // Where fade ends (transparent) - now above mana
        const fadeBottomY = rulesY +0.02; // Where fade starts (solid)
        const solidStartY = rulesY; // Where solid area starts
        const solidEndY = 1.0; // Where solid area ends (bottom of card)
        
        // Calculate heights as actual values (not percentages)
        const fadeHeight = fadeBottomY - fadeTopY; // Height of fade area
        const solidHeight = solidEndY - solidStartY; // Height of solid area
        
        // Update gradient options
        card.gradientOptions = {
            ...card.gradientOptions,
            yPosition: fadeTopY, // Start at the top of the fade area
            height: fadeHeight, // Actual fade height
            solidHeight: solidHeight, // Actual solid height
            maxOpacity: 0.99,
            startFromBottom: false, // Using custom position
            fadeDirection: 'down' // Fade from transparent (top) to solid (bottom)
        };
        
        // Redraw the gradient with new parameters
        drawHorizontalGradient(card.gradientOptions);
        drawCard();
    }

    return { rulesY, typeY, titleY, manaY };
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

    // Create debounced scaling function with the scaling logic
    const debouncedScale = debounce((text) => {
        if (card.text.rules && card.version === 'Minimalist') {
            // Remove this line - it's causing the infinite loop
            // textEdited(); // Update text content first
            
            // Clear canvas for measurements
            card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
            card.minimalist.ctx.font = `${card.text.rules.size * card.height}px "${card.text.rules.font}"`;
            
            // Measure initial text height
            const actualTextHeight = measureTextHeight(
                text,
                card.minimalist.ctx,
                card.text.rules.width * card.width,
                card.text.rules.size * card.height
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
                updateTextPositions(newHeight); // This handles the gradient!
                
                // Single redraw at the end
                drawTextBuffer();
                drawCard();
                
                console.log('Text scaling triggered:', {
                    text: text,
                    currentHeight: card.minimalist.currentHeight,
                    newHeight: newHeight,
                    actualTextHeight: actualTextHeight
                });
            });
        }
    }, 300);

    // Restore saved text immediately after loading options
    let hasRulesText = false;
    for (const key in savedText) {
        if (card.text[key]) {
            card.text[key].text = savedText[key];
            if (key === 'rules' && savedText[key]) {
                hasRulesText = true;
                textEdited(); // Update text content first
                requestAnimationFrame(() => {
                    debouncedScale(savedText[key]);
                });
                console.log('Initial text loaded:', savedText[key]);
            }
        }
    }

    // If no rules text to restore, draw initial gradient
    if (!hasRulesText) {
        updateTextPositions(card.minimalist.currentHeight);
    }

    // Move these INSIDE the onclick function so they can access debouncedScale
    // Set up input listener for live typing
    const textEditor = document.querySelector('#text-editor');
    if (textEditor) {
        textEditor.addEventListener('input', function() {
            debouncedScale(this.value);
        });
    }

    // Set up listener for card imports
    const originalTextEdited = window.textEdited;
    window.textEdited = function() {
        if (originalTextEdited) originalTextEdited();
        
        if (card.version === 'Minimalist' && card.text.rules && card.text.rules.text) {
            setTimeout(() => {
                debouncedScale(card.text.rules.text);
            }, 50);
        }
    };

};

//loads available frames
loadFramePack();