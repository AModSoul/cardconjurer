//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
    loadedVersions.push('/js/frames/versionMinimalist.js');
    
    // Make debounce globally accessible
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    window.updateTextPositions = function(rulesHeight) {
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
    };
    
    window.measureTextHeight = function(text, ctx, width, fontSize) {
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
    };
        // Main initialization function that the pack calls
        window.initializeMinimalistVersion = function(savedText) {
            // Create debounced scaling function with the scaling logic
            const debouncedScale = window.debounce((text) => {
                if (card.text.rules && card.version === 'Minimalist') {
                    // Clear canvas for measurements
                    card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
                    card.minimalist.ctx.font = `${card.text.rules.size * card.height}px "${card.text.rules.font}"`;
                    
                    // Measure initial text height
                    const actualTextHeight = window.measureTextHeight(
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
                        window.updateTextPositions(newHeight);
                        
                        // Single redraw at the end
                        drawTextBuffer();
                        drawCard();
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
                        textEdited();
                        requestAnimationFrame(() => {
                            debouncedScale(savedText[key]);
                        });
                    }
                }
            }

                    // If no rules text to restore, draw initial gradient
        if (!hasRulesText) {
            window.updateTextPositions(card.minimalist.currentHeight);
        }

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
}
