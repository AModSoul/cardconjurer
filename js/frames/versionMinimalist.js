//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
    loadedVersions.push('/js/frames/versionMinimalist.js');

    if (!card.minimalist) {
        card.minimalist = {
            baseY: 0.95,
            spacing: 0.05,
            minHeight: 0.1,
            maxHeight: 0.35,
            currentHeight: 0.1,
            textCache: {},
            lastTextLength: 0,
            lastProcessedText: '',
            lastFullUpdate: 0,
            settings: {
                maxOpacity: 0.95,
                fadeBottomOffset: +0.01,
                fadeTopOffset: -0.06,
                solidEnd: 1,
                bgColor1: '#000000',    // Black
                bgColor2: '#000000',    // Black
                bgColor3: '#000000',    // Black
                bgColorCount: '1'       // Single color instead of auto
            }
        };
            
            // Create a canvas context for text measurements
            const measureCanvas = document.createElement('canvas');
            measureCanvas.width = card.width;
            measureCanvas.height = card.height;
            card.minimalist.ctx = measureCanvas.getContext('2d');
        }
    
    // Set up the UI tab for minimalist gradient settings
    document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `minimalist`)">Minimalist</h3>';
    var newHTML = document.createElement('div');
    newHTML.id = 'creator-menu-minimalist';
    newHTML.classList.add('hidden');
    
// Update the UI HTML to include color controls
// Update the UI HTML to include background gradient color controls
newHTML.innerHTML = `
<div class='readable-background padding'>
    <h5 class='padding margin-bottom input-description' style="font-size: 2em; font-weight: bold;">Gradient Settings</h5>
        
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 10px 0;"></div>

    <h5 class='input-description margin-bottom'>Enable Background Gradient</h5>
    <label class='checkbox-container input margin-bottom'>Toggle Background Gradient
            <input id='minimalist-bg-gradient-enabled' type='checkbox' class='input' onchange='updateMinimalistGradient();' checked>
        <span class='checkmark'></span>
    </label>

    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

    <h5 class='padding input-description'>Maximum Opacity (0-1):</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-max-opacity' type='number' class='input' oninput='updateMinimalistGradient();' min='0' max='1' step='0.01' value='0.95'>
    </div>
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>
    
    <h5 class='padding input-description'>Fade Start Position:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-fade-bottom-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.2' max='0.2' step='0.01' value='-0.05'>
    </div>
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>
    
    <h5 class='padding input-description'>Fade End Position:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-fade-top-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.5' max='0' step='0.01' value='-0.15'>
    </div>
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

    <h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Background Gradient Colors</h5>
    
    <h5 class='padding input-description'>Background Color 1:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-bg-color-1' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
    </div>

    <h5 class='padding input-description'>Background Color 2:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-bg-color-2' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
    </div>

    <h5 class='padding input-description'>Background Color 3:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-bg-color-3' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
    </div>

    <h5 class='padding input-description'>Background Colors:</h5>
    <div class='padding input-grid margin-bottom'>
        <select id='minimalist-bg-color-count' class='input' onchange='updateMinimalistGradient();'>
            <option value='1' selected>1 Color</option>
            <option value='mana-auto'>Auto (Mana Colors)</option>
            <option value='2'>2 Colors</option>
            <option value='3'>3 Colors</option>
        </select>
    </div> 
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>
    
    <h5 class='input-description margin-bottom'>Enable Divider Bar</h5>
    <label class='checkbox-container input margin-bottom'>Toggle Divider Bar
        <input id='minimalist-divider-enabled' type='checkbox' class='input' onchange='updateDividerColors();' checked>
    <span class='checkmark'></span>
    </label>

    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>


    <h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Divider Colors</h5>
    
    <h5 class='padding input-description'>Color 1:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-color-1' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
    </div>
    
    <h5 class='padding input-description'>Color 2:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-color-2' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
    </div>
    
    <h5 class='padding input-description'>Color 3:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-color-3' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
    </div>
    
    <h5 class='padding input-description'>Number of Colors:</h5>
    <div class='padding input-grid margin-bottom'>
        <select id='minimalist-color-count' class='input' onchange='updateDividerColors();'>
            <option value='auto'>Auto (from mana cost)</option>
            <option value='1'>1 Color</option>
            <option value='2'>2 Colors</option>
            <option value='3'>3 Colors</option>
        </select>
    </div>
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>
    
    <h5 class='padding input-description'>Reset Settings</h5>
    <div class='padding input-grid margin-bottom'>
        <button id='reset-minimalist-gradient' class='input' onclick='resetMinimalistGradient();'>Reset All Settings</button>
    </div>
</div>`;
    document.querySelector('#creator-menu-sections').appendChild(newHTML);

    window.updateDividerColors = function() {
        if (card.version === 'Minimalist') {
            // Get color values from inputs
            const color1 = document.getElementById('minimalist-color-1').value;
            const color2 = document.getElementById('minimalist-color-2').value;
            const color3 = document.getElementById('minimalist-color-3').value;
            const colorCount = document.getElementById('minimalist-color-count').value;
            
            // Store values in card object for persistence
            if (!card.minimalist.dividerSettings) {
                card.minimalist.dividerSettings = {};
            }
            
            card.minimalist.dividerSettings = {
                color1,
                color2,
                color3,
                colorCount
            };
            
            // Redraw the divider
            window.drawDividerGradient();
            drawCard();
        }
    };

    // Then add the reset function
    window.resetMinimalistGradient = function() {

        // Reset checkbox states
        document.getElementById('minimalist-bg-gradient-enabled').checked = true;
        document.getElementById('minimalist-divider-enabled').checked = true;

        // Default values
        const defaultSettings = {
            maxOpacity: 0.95,
            fadeBottomOffset: -0.05,
            fadeTopOffset: -0.15,
            solidEnd: 1.05
        };
        
    // Get colors from mana cost for reset
    const manaColors = getManaColorsFromText();
    const defaultColors = {
        color1: getColorHex(manaColors[0]) || '#FFF7D8',
        color2: getColorHex(manaColors[1]) || '#26C7FE', 
        color3: getColorHex(manaColors[2]) || '#B264FF',
        colorCount: 'auto',
        bgColor1: '#000000',    // Black background
        bgColor2: '#000000',    // Black background
        bgColor3: '#000000',    // Black background
        bgColorCount: '1'       // Single black color
    };
        
        // Update the UI inputs
        document.getElementById('minimalist-max-opacity').value = defaultSettings.maxOpacity;
        document.getElementById('minimalist-fade-bottom-offset').value = defaultSettings.fadeBottomOffset;
        document.getElementById('minimalist-fade-top-offset').value = defaultSettings.fadeTopOffset;
        
        // Update background color inputs
        document.getElementById('minimalist-bg-color-1').value = defaultColors.bgColor1;
        document.getElementById('minimalist-bg-color-2').value = defaultColors.bgColor2;
        document.getElementById('minimalist-bg-color-3').value = defaultColors.bgColor3;
        document.getElementById('minimalist-bg-color-count').value = defaultColors.bgColorCount;
        
        // Update divider color inputs
        document.getElementById('minimalist-color-1').value = defaultColors.color1;
        document.getElementById('minimalist-color-2').value = defaultColors.color2;
        document.getElementById('minimalist-color-3').value = defaultColors.color3;
        document.getElementById('minimalist-color-count').value = defaultColors.colorCount;
        
        // Update the card settings
        card.minimalist.settings = { ...defaultSettings, ...defaultColors };
        card.minimalist.dividerSettings = { 
            color1: defaultColors.color1,
            color2: defaultColors.color2,
            color3: defaultColors.color3,
            colorCount: defaultColors.colorCount
        };
        
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

    // Add this near the beginning of your script
    if (!card.minimalist.textCache) {
        card.minimalist.textCache = {};
    }

    // Add this function to clear cache when needed
    window.clearMinimalistTextCache = function() {
        card.minimalist.textCache = {};
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
            
            // Get background color values
            const bgColor1 = document.getElementById('minimalist-bg-color-1').value;
            const bgColor2 = document.getElementById('minimalist-bg-color-2').value;
            const bgColor3 = document.getElementById('minimalist-bg-color-3').value;
            const bgColorCount = document.getElementById('minimalist-bg-color-count').value;
            
            // Store values in card object for persistence
            card.minimalist.settings = {
                maxOpacity,
                fadeBottomOffset,
                fadeTopOffset,
                solidEnd: 1,   // Fixed value that extends to bottom of card
                bgColor1,
                bgColor2,
                bgColor3,
                bgColorCount
            };
            
            // Re-calculate positions with current text positions
            if (card.text.rules) {
                window.updateTextPositions(card.minimalist.currentHeight);
            }
        }
    };
    
    window.updateTextPositions = function(rulesHeight) {
        // Add offset to move everything up to account for divider gradient
        const dividerOffset = 0.03; // Adjust this value to control how much everything moves up
        const dividerSpacing = 0.02; // Additional spacing to account for the divider bar
        
        // Calculate positions based on rules text height with offset
        const rulesY = card.minimalist.baseY - rulesHeight - dividerOffset;
        const typeY = rulesY - (card.minimalist.spacing * 0.9) - dividerSpacing; // Move type up more to account for divider
        const titleY = typeY - (card.minimalist.spacing * 0.65);
        const manaY = titleY - (card.minimalist.spacing * 0.6);
        
        // Calculate divider position (same as in drawDividerGradient)
        const dividerOffset2 = 0.050; // How far below the type text the divider is placed
        const dividerY = typeY + dividerOffset2;
        
        // Position set symbol above the divider
        const setSymbolOffsetAboveDivider = 0.025; // Distance above divider
        const setSymbolY = dividerY - setSymbolOffsetAboveDivider;
    
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
        
        // Update set symbol position (keep same x coordinates, update y)
        if (card.setSymbolBounds) {
            card.setSymbolBounds.y = setSymbolY;
            // Trigger set symbol redraw with new position
            resetSetSymbol();
        }
    
    // Update gradient to match the text area
    if (card.gradientOptions) {
        // Check if background gradient is enabled
        const bgGradientEnabled = document.getElementById('minimalist-bg-gradient-enabled')?.checked ?? true;
        
        if (bgGradientEnabled) {
            // Get settings from the stored values
            const settings = card.minimalist.settings || {
                maxOpacity: 0.95,
                fadeBottomOffset: -0.05,
                fadeTopOffset: -0.15,
                solidEnd: 1,
                bgColor1: '#000000',
                bgColor2: '#000000',
                bgColor3: '#000000',
                bgColorCount: 'auto'
            };
        
    // Determine background colors to use
    let backgroundColors = [];
    if (settings.bgColorCount === 'mana-auto') {
        // Use mana-based colors
        const manaColors = getManaColorsFromText();
        backgroundColors = manaColors.map(color => getColorHex(color));
        if (backgroundColors.length === 0) {
            backgroundColors = ['#808080']; // Grey for colorless
        }
    } else {
        // Use manual color settings
        const colorCount = parseInt(settings.bgColorCount);
        const customColors = [settings.bgColor1, settings.bgColor2, settings.bgColor3];
        backgroundColors = customColors.slice(0, colorCount);
    }
        
        // Apply settings to calculate gradient positions
        const fadeTopY = manaY + settings.fadeTopOffset; // Where fade ends (transparent)
        const fadeBottomY = rulesY + settings.fadeBottomOffset; // Where fade starts (solid)
        const solidStartY = fadeBottomY; // Where solid area starts (aligned with fade bottom)
        const solidEndY = settings.solidEnd; // Where solid area ends (bottom of card)
        
        // Calculate heights as actual values (not percentages)
        const fadeHeight = fadeBottomY - fadeTopY; // Height of fade area
        const solidHeight = solidEndY - solidStartY; // Height of solid area
        
        // Update gradient options with the settings values
    // Update gradient options with the settings values
    card.gradientOptions = {
        ...card.gradientOptions,
        yPosition: fadeTopY, // Start at the top of the fade area
        height: fadeHeight, // Actual fade height
        solidHeight: solidHeight, // Actual solid height
        maxOpacity: settings.maxOpacity, // Use the settings value
        startFromBottom: false, // Using custom position
        fadeDirection: 'down', // Fade from transparent (top) to solid (bottom)
        endOpacity: settings.maxOpacity, // Ensure consistent opacity at the bottom
        colors: backgroundColors // Add the background colors
    };
        // Redraw the gradient with new parameters
        drawHorizontalGradient(card.gradientOptions);
    } else {
        // Clear the gradient if disabled
        gradientContext.clearRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    }
    
    // Check if divider is enabled before drawing it
    const dividerEnabled = document.getElementById('minimalist-divider-enabled')?.checked ?? true;
    if (dividerEnabled) {
        window.drawDividerGradient();
    }
    
    drawCard();
}

    return { rulesY, typeY, titleY, manaY, setSymbolY };
};

window.drawDividerGradient = function() {
    if (!card.text.rules || !card.text.type || card.version !== 'Minimalist') {
        return;
    }
    
    // Check if divider is enabled
    const dividerEnabled = document.getElementById('minimalist-divider-enabled')?.checked ?? true;
    if (!dividerEnabled) {
        // Clear the divider canvas if disabled
        if (card.dividerCanvas) {
            card.dividerContext.clearRect(0, 0, card.dividerCanvas.width, card.dividerCanvas.height);
        }
        return;
    }

    // Create a separate canvas for the divider gradient
    if (!card.dividerCanvas) {
        card.dividerCanvas = document.createElement('canvas');
        card.dividerCanvas.width = card.width;
        card.dividerCanvas.height = card.height;
        card.dividerContext = card.dividerCanvas.getContext('2d');
    }
    
    // Clear the divider canvas
    card.dividerContext.clearRect(0, 0, card.dividerCanvas.width, card.dividerCanvas.height);
    
    // Determine colors to use
    let colorsToUse = [];
    let colorCount = 0;
    
    if (card.minimalist.dividerSettings && card.minimalist.dividerSettings.colorCount !== 'auto') {
        // Use manual color settings
        colorCount = parseInt(card.minimalist.dividerSettings.colorCount);
        const customColors = [
            card.minimalist.dividerSettings.color1,
            card.minimalist.dividerSettings.color2,
            card.minimalist.dividerSettings.color3
        ];
        colorsToUse = customColors.slice(0, colorCount);
    } else {
        // Use auto colors from mana cost
        const manaColors = getManaColorsFromText();
        colorCount = manaColors.length;
        colorsToUse = manaColors.map(color => getColorHex(color));
    }
    
    // Get text box dimensions
    const rulesX = card.text.rules.x;
    const rulesWidth = card.text.rules.width;
    const typeY = card.text.type.y;
    
    // Position divider slightly below the type text
    const dividerOffset = 0.050;
    const dividerY = typeY + dividerOffset;
    
    // Calculate divider bar dimensions
    const dividerHeight = 0.002;
    
    // Convert to actual pixel values
    const actualX = rulesX * card.width;
    const actualY = dividerY * card.height;
    const actualWidth = rulesWidth * card.width;
    const actualHeight = dividerHeight * card.height;
    
    // Create gradient based on color count
    const gradient = card.dividerContext.createLinearGradient(actualX, 0, actualX + actualWidth, 0);
    
    if (colorCount === 0) {
        // No colors, use grey
        gradient.addColorStop(0, hexToRgba('#CBC2C0', 0.5));
        gradient.addColorStop(0.25, hexToRgba('#CBC2C0', 1));
        gradient.addColorStop(0.75, hexToRgba('#CBC2C0', 1));
        gradient.addColorStop(1, hexToRgba('#CBC2C0', 0.5));
    } else if (colorCount === 1) {
        // Single color
        const color = colorsToUse[0];
        gradient.addColorStop(0, hexToRgba(color, 0.5));
        gradient.addColorStop(0.25, hexToRgba(color, 1));
        gradient.addColorStop(0.75, hexToRgba(color, 1));
        gradient.addColorStop(1, hexToRgba(color, 0.5));
    } else if (colorCount === 2) {
        // Two colors with transition
        const color1 = colorsToUse[0];
        const color2 = colorsToUse[1];
        
        gradient.addColorStop(0, hexToRgba(color1, 0.5));
        gradient.addColorStop(0.25, hexToRgba(color1, 1));
        gradient.addColorStop(0.45, hexToRgba(color1, 1));
        gradient.addColorStop(0.5, hexToRgba(blendColors(color1, color2), 1));
        gradient.addColorStop(0.55, hexToRgba(color2, 1));
        gradient.addColorStop(0.75, hexToRgba(color2, 1));
        gradient.addColorStop(1, hexToRgba(color2, 0.5));
    } else if (colorCount === 3) {
        // Three colors with transitions
        const color1 = colorsToUse[0];
        const color2 = colorsToUse[1];
        const color3 = colorsToUse[2];
        
        gradient.addColorStop(0, hexToRgba(color1, 0.5));
        gradient.addColorStop(0.167, hexToRgba(color1, 1));
        gradient.addColorStop(0.31, hexToRgba(color1, 1));
        gradient.addColorStop(0.333, hexToRgba(blendColors(color1, color2), 1));
        gradient.addColorStop(0.356, hexToRgba(color2, 1));
        gradient.addColorStop(0.644, hexToRgba(color2, 1));
        gradient.addColorStop(0.667, hexToRgba(blendColors(color2, color3), 1));
        gradient.addColorStop(0.69, hexToRgba(color3, 1));
        gradient.addColorStop(0.833, hexToRgba(color3, 1));
        gradient.addColorStop(1, hexToRgba(color3, 0.5));
    } else {
        // More than 3 colors - use gold
        gradient.addColorStop(0, hexToRgba('#e3d193', 0.5));
        gradient.addColorStop(0.25, hexToRgba('#e3d193', 1));
        gradient.addColorStop(0.75, hexToRgba('#e3d193', 1));
        gradient.addColorStop(1, hexToRgba('#e3d193', 0.5));
    }
    
    // Draw the divider bar
    card.dividerContext.fillStyle = gradient;
    card.dividerContext.fillRect(actualX, actualY, actualWidth, actualHeight);
};

    // Helper function to extract mana colors from mana cost text
    function getManaColorsFromText() {
        if (!card.text.mana || !card.text.mana.text) {
            return [];
        }
        
        const manaText = card.text.mana.text;
        const colors = [];
        const colorMap = {
            'w': 'white',
            'u': 'blue', 
            'b': 'black',
            'r': 'red',
            'g': 'green'
        };
        
        // Find all {x} patterns in the mana cost
        const manaMatches = manaText.match(/\{[^}]+\}/g) || [];
        
        for (const match of manaMatches) {
            const symbol = match.toLowerCase().replace(/[{}]/g, '');
            
            // Check for basic colors only (w, u, b, r, g)
            if (colorMap[symbol]) {
                if (!colors.includes(colorMap[symbol])) {
                    colors.push(colorMap[symbol]);
                }
            }
            // Check for hybrid mana like {w/u}
            else if (symbol.includes('/')) {
                const hybridColors = symbol.split('/');
                for (const hybridColor of hybridColors) {
                    if (colorMap[hybridColor] && !colors.includes(colorMap[hybridColor])) {
                        colors.push(colorMap[hybridColor]);
                    }
                }
            }
            // Ignore numbers, 'c', and anything else
        }
        
        return colors;
    }

    // Helper function to create rgba string from hex and alpha
    function hexToRgba(hex, alpha) {
        const rgb = hexToRgb(hex);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    // Helper function to get hex values for mana colors
    function getColorHex(colorName) {
        const colorMap = {
            'white': '#FFF7D8',
            'blue': '#26C7FE',
            'black': '#B264FF',
            'red': '#F13F35',
            'green': '#29EEA6',

        };
        
        return colorMap[colorName] || '#FFFFFF'; // Default to white
    }

    // Helper function to blend two hex colors
    function blendColors(hex1, hex2, ratio = 0.5) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        
        const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
        const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
        const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    // sync colors when mana cost changes
    window.syncDividerColorsWithMana = function() {
        if (card.minimalist.dividerSettings && card.minimalist.dividerSettings.colorCount === 'auto') {
            const manaColors = getManaColorsFromText();
            
            // Update color picker values to match mana colors
            document.getElementById('minimalist-color-1').value = getColorHex(manaColors[0]) || '#FFF7D8';
            document.getElementById('minimalist-color-2').value = getColorHex(manaColors[1]) || '#26C7FE';
            document.getElementById('minimalist-color-3').value = getColorHex(manaColors[2]) || '#B264FF';
            
            // Redraw divider
            window.drawDividerGradient();
            drawCard();
        }
    };
        window.measureTextHeight = function(text, ctx, width, fontSize) {
            // More efficient implementation
            if (!text) return 0;
            
            // Cache text metrics where possible
            const cacheKey = `${text.length}_${width}_${fontSize}`;
            if (card.minimalist.textCache && card.minimalist.textCache[cacheKey]) {
                return card.minimalist.textCache[cacheKey];
            }
            
            // Split by lines first, then process words in each line
            const paragraphs = text.split('\n');
            let totalLines = 0;
            
            for (const paragraph of paragraphs) {
                const words = paragraph.split(' ');
                let currentLine = words[0] || '';
                
                for (let i = 1; i < words.length; i++) {
                    const testLine = currentLine + ' ' + words[i];
                    if (ctx.measureText(testLine).width > width) {
                        totalLines++;
                        currentLine = words[i];
                    } else {
                        currentLine = testLine;
                    }
                }
                
                // Count the last line of each paragraph
                totalLines++;
            }
            
            const result = totalLines * fontSize * 1.2;
            
            // Cache the result
            if (!card.minimalist.textCache) card.minimalist.textCache = {};
            card.minimalist.textCache[cacheKey] = result;
            
            return result;
        };
            // Main initialization function that the pack calls
            window.initializeMinimalistVersion = function(savedText) {
                // Initialize settings if not present
                if (!card.minimalist.settings) {
                    card.minimalist.settings = {
                        maxOpacity: 0.95,
                        fadeBottomOffset: +0.01,
                        fadeTopOffset: -0.06,
                        solidEnd: 1,
                        bgColor1: '#000000',    // Black
                        bgColor2: '#000000',    // Black
                        bgColor3: '#000000',    // Black
                        bgColorCount: '1'       // Single color
                    };
                }
                
                // Initialize gradient options if not present
                if (!card.gradientOptions) {
                    card.gradientOptions = {
                        yPosition: 0.5,
                        height: 0.3,
                        solidHeight: 0.5,
                        maxOpacity: card.minimalist.settings.maxOpacity,
                        startFromBottom: false,
                        fadeDirection: 'down',
                        endOpacity: card.minimalist.settings.maxOpacity,
                        colors: ['#000000'] // Start with black
                    };
                }
                
                // Set UI values from stored settings
                document.getElementById('minimalist-bg-gradient-enabled').checked = card.minimalist.settings.bgGradientEnabled ?? true;
                document.getElementById('minimalist-divider-enabled').checked = card.minimalist.settings.dividerEnabled ?? true;
                document.getElementById('minimalist-max-opacity').value = card.minimalist.settings.maxOpacity;
                document.getElementById('minimalist-fade-bottom-offset').value = card.minimalist.settings.fadeBottomOffset;
                document.getElementById('minimalist-fade-top-offset').value = card.minimalist.settings.fadeTopOffset;
                
                // Set background color UI values
                document.getElementById('minimalist-bg-color-1').value = card.minimalist.settings.bgColor1 || '#000000';
                document.getElementById('minimalist-bg-color-2').value = card.minimalist.settings.bgColor2 || '#000000';
                document.getElementById('minimalist-bg-color-3').value = card.minimalist.settings.bgColor3 || '#000000';
                document.getElementById('minimalist-bg-color-count').value = card.minimalist.settings.bgColorCount || '1';

        // Create debounced scaling function with the scaling logic
        const debouncedScale = window.debounce((text) => {
            if (card.text.rules && card.version === 'Minimalist') {
                // Skip processing if text is identical to last processed text
                if (card.minimalist.lastProcessedText === text) {
                    return;
                }
            
                card.minimalist.lastProcessedText = text;  

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

                // Only update visual elements if text length changed significantly
                // or if significant time has passed since last full update
                const now = Date.now();
                const textLengthChanged = Math.abs((card.minimalist.lastTextLength || 0) - text.length) > 10;
                const timeElapsed = now - (card.minimalist.lastFullUpdate || 0) > 1000;
                
                if (textLengthChanged || timeElapsed) {
                    requestAnimationFrame(() => {
                        card.minimalist.currentHeight = newHeight;
                        window.updateTextPositions(newHeight);
                        drawTextBuffer();
                        drawCard();
                        
                        card.minimalist.lastTextLength = text.length;
                        card.minimalist.lastFullUpdate = now;
                    });
                }
            }
        }, 200);
        
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
                const text = this.value;
                
                // For very long text, use a more aggressive throttle
                if (text.length > 500) {
                    // Use a more aggressive debounce for long text
                    setTimeout(() => {
                        debouncedScale(text);
                    }, 250);
                } else {
                    // Normal handling for shorter text
                    debouncedScale(text);
                }
            });
        }

        const originalTextEdited = window.textEdited;
        window.textEdited = function() {
            if (originalTextEdited) originalTextEdited();
            
            if (card.version === 'Minimalist') {
                // Sync divider colors if in auto mode
                window.syncDividerColorsWithMana();
                
                if (card.text.rules && card.text.rules.text) {
                    setTimeout(() => {
                        debouncedScale(card.text.rules.text);
                    }, 400);
                }
            }
        };
    };
}
