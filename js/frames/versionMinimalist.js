//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
    loadedVersions.push('/js/frames/versionMinimalist.js');
    
    // Set up the UI tab for minimalist gradient settings
    document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `minimalist`)">Minimalist</h3>';
    var newHTML = document.createElement('div');
    newHTML.id = 'creator-menu-minimalist';
    newHTML.classList.add('hidden');
    
    // Modify the UI HTML to include the reset button
    newHTML.innerHTML = `
    <div class='readable-background padding'>
        <h5 class='padding margin-bottom input-description' style="font-size: 2em; font-weight: bold;">Gradient Settings</h5>

        <div style="height: 55px;"></div>

        <h5 class='padding input-description'>Maximum Opacity (0-1):</h5>
        <div class='padding input-grid margin-bottom'>
            <input id='minimalist-max-opacity' type='number' class='input' oninput='updateMinimalistGradient();' min='0' max='1' step='0.01' value='0.95'>
        </div>
        
        <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 30px 0;"></div>
        
        <h5 class='padding input-description'>Fade Start Position:</h5>
        <div class='padding input-grid margin-bottom'>
            <input id='minimalist-fade-bottom-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.2' max='0.2' step='0.01' value='-0.05'>
        </div>
        
        <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 30px 0;"></div>
        
        <h5 class='padding input-description'>Fade End Position:</h5>
        <div class='padding input-grid margin-bottom'>
            <input id='minimalist-fade-top-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.5' max='0' step='0.01' value='-0.15'>
        </div>
        
        <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 30px 0;"></div>
        
        <h5 class='padding input-description'>Reset Gradient Settings</h5>
        <div class='padding input-grid margin-bottom'>
            <button id='reset-minimalist-gradient' class='input' onclick='resetMinimalistGradient();'>Reset Gradient</button>
        </div>
    </div>`;
    document.querySelector('#creator-menu-sections').appendChild(newHTML);

// Then add the reset function
window.resetMinimalistGradient = function() {
    // Default values
    const defaultSettings = {
        maxOpacity: 0.95,
        fadeBottomOffset: -0.05,
        fadeTopOffset: -0.15,
        solidEnd: 1.05
    };
    
    // Update the UI inputs
    document.getElementById('minimalist-max-opacity').value = defaultSettings.maxOpacity;
    document.getElementById('minimalist-fade-bottom-offset').value = defaultSettings.fadeBottomOffset;
    document.getElementById('minimalist-fade-top-offset').value = defaultSettings.fadeTopOffset;
    
    // Update the card settings
    card.minimalist.settings = { ...defaultSettings };
    
    // Apply the changes
    window.updateTextPositions(card.minimalist.currentHeight);
    
    // Provide visual feedback
    const resetButton = document.getElementById('reset-minimalist-gradient');
    const originalText = resetButton.textContent;
    resetButton.textContent = 'Settings Reset!';
    resetButton.classList.add('success-highlight');
    
    // Revert button text after a short delay
    setTimeout(() => {
        resetButton.textContent = originalText;
        resetButton.classList.remove('success-highlight');
    }, 1500);
};


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

    // Function to update gradient based on UI settings
    window.updateMinimalistGradient = function() {
        if (card.version === 'Minimalist' && card.gradientOptions) {
            // Get values from inputs
            const maxOpacity = parseFloat(document.getElementById('minimalist-max-opacity').value);
            const fadeBottomOffset = parseFloat(document.getElementById('minimalist-fade-bottom-offset').value);
            const fadeTopOffset = parseFloat(document.getElementById('minimalist-fade-top-offset').value);
            
            // Store values in card object for persistence
            card.minimalist.settings = {
                maxOpacity,
                fadeBottomOffset,
                fadeTopOffset,
                solidEnd: 1   // Fixed value that extends to bottom of card
            };
            
            // Re-calculate positions with current text positions
            if (card.text.rules) {
                window.updateTextPositions(card.minimalist.currentHeight);
            }
        }
    };
    
    window.updateTextPositions = function(rulesHeight) {
        // Calculate positions based on rules text height
        const rulesY = card.minimalist.baseY - rulesHeight;
        const typeY = rulesY - (card.minimalist.spacing *0.9);
        const titleY = typeY - (card.minimalist.spacing * 0.65);
        const manaY = titleY - (card.minimalist.spacing * 0.6);
    
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
            // Get settings from the stored values
            const settings = card.minimalist.settings || {
                maxOpacity: 0.95,
                fadeBottomOffset: -0.05,
                fadeTopOffset: -0.15,
                solidEnd: 1
            };
            
            // Apply settings to calculate gradient positions
            const fadeTopY = manaY + settings.fadeTopOffset; // Where fade ends (transparent)
            const fadeBottomY = rulesY + settings.fadeBottomOffset; // Where fade starts (solid)
            const solidStartY = fadeBottomY; // Where solid area starts (aligned with fade bottom)
            const solidEndY = settings.solidEnd; // Where solid area ends (bottom of card)
            
            // Calculate heights as actual values (not percentages)
            const fadeHeight = fadeBottomY - fadeTopY; // Height of fade area
            const solidHeight = solidEndY - solidStartY; // Height of solid area
            
            // Update gradient options with the settings values
            card.gradientOptions = {
                ...card.gradientOptions,
                yPosition: fadeTopY, // Start at the top of the fade area
                height: fadeHeight, // Actual fade height
                solidHeight: solidHeight, // Actual solid height
                maxOpacity: settings.maxOpacity, // Use the settings value
                startFromBottom: false, // Using custom position
                fadeDirection: 'down', // Fade from transparent (top) to solid (bottom)
                endOpacity: settings.maxOpacity // Ensure consistent opacity at the bottom
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
            // Initialize settings if not present
            if (!card.minimalist.settings) {
                card.minimalist.settings = {
                    maxOpacity: 0.95,
                    fadeBottomOffset: +0.01,
                    fadeTopOffset: -0.06,
                    solidEnd: 1
                };
            }
            
            // Set UI values from stored settings
            document.getElementById('minimalist-max-opacity').value = card.minimalist.settings.maxOpacity;
            document.getElementById('minimalist-fade-bottom-offset').value = card.minimalist.settings.fadeBottomOffset;
            document.getElementById('minimalist-fade-top-offset').value = card.minimalist.settings.fadeTopOffset;

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
