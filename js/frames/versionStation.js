//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionStation.js')) {
    loadedVersions.push('/js/frames/versionStation.js');
    
    // Use the existing canvas system like planeswalkers do
    sizeCanvas('stationPreFrame');
    sizeCanvas('stationPostFrame');

    // Declare a single shared badge image
    window.stationBadgeImage = new Image();

    // Set up badge image loading with proper error handling
    stationBadgeImage.crossOrigin = 'anonymous';
    stationBadgeImage.onload = function() {
        console.log('Station badge loaded successfully');
        stationEdited(); // Redraw when image loads
    };
    stationBadgeImage.onerror = function() {
        console.error('Failed to load station badge');
    };
    setImageUrl(stationBadgeImage, '/img/frames/station/badges/a.png');
    
// Set up mana cost listener with multiple retry attempts
let manaListenerAttempts = 0;
const setupManaListenerWithRetry = () => {
    if (setupManaListener()) {
        // Success - also do initial badge update
        updateBadgeImageFromMana();
        console.log('Mana listener setup complete');
    } else if (manaListenerAttempts < 10) {
        // Retry up to 10 times
        manaListenerAttempts++;
        setTimeout(setupManaListenerWithRetry, 200 * manaListenerAttempts);
    } else {
        console.warn('Failed to set up mana listener after 10 attempts');
    }
};

// Start the setup process
setTimeout(setupManaListenerWithRetry, 100);
    
    document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `station`)">Station</h3>';
    var newHTML = document.createElement('div');
    newHTML.id = 'creator-menu-station';
    newHTML.classList.add('hidden');
    newHTML.innerHTML = `
    <div class='readable-background padding'>
        <h5 class='padding margin-bottom input-description'>Station Card Controls - Adjust text box heights and colored square backgrounds for each ability</h5>
        
        <h5 class='padding margin-bottom input-description'>Badge Settings:</h5>
        <div class='padding input-grid margin-bottom'>
            <div><h6 class='padding margin-bottom input-description'>Badge X Position (0.0 to 1.0):</h6><input id='station-badge-x' type='number' class='input' oninput='stationEdited();' min='0' max='1' step='0.001' placeholder='Badge X Position'></div>
            <div><h6 class='padding margin-bottom input-description'>Badge Color Mode:</h6>
                <select id='station-badge-color-mode' class='input' onchange='updateBadgeColorMode();'>
                    <option value='auto'>Auto (Based on Mana Cost)</option>
                    <option value='white'>White</option>
                    <option value='blue'>Blue</option>
                    <option value='black'>Black</option>
                    <option value='red'>Red</option>
                    <option value='green'>Green</option>
                    <option value='multi'>Multicolored</option>
                    <option value='colorless'>Colorless</option>
                </select>
            </div>
            <div><h6 class='padding margin-bottom input-description'>Second Ability Badge Value:</h6><input id='station-badge-value-1' type='text' class='input' oninput='stationEdited();' placeholder='Badge Text'></div>
            <div><h6 class='padding margin-bottom input-description'>Third Ability Badge Value:</h6><input id='station-badge-value-2' type='text' class='input' oninput='stationEdited();' placeholder='Badge Text'></div>
        </div>
        
        <div class='padding margin-bottom'>
            <label><input id='station-disable-first-ability' type='checkbox' onchange='stationEdited();'> Disable First Square (Second square gets first square's color)</label>
        </div>
        
        <h5 class='padding margin-bottom input-description'>Second Ability (Station Text):</h5>
        <div class='padding input-grid margin-bottom'>
            <div><h6 class='padding margin-bottom input-description'>Height:</h6><input id='station-height-1' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Height'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Width:</h6><input id='station-square-width-1' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Square Width'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Height:</h6><input id='station-square-height-1' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Square Height'></div>
            <div><h6 class='padding margin-bottom input-description'>Square X Offset:</h6><input id='station-square-x-1' type='number' class='input' oninput='stationEdited();' placeholder='Square X Offset'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Y Offset:</h6><input id='station-square-y-1' type='number' class='input' oninput='stationEdited();' placeholder='Square Y Offset'></div>
        </div>
        <div class='padding input-grid margin-bottom'>
            <div><h6 class='padding margin-bottom input-description'>Square Color Mode:</h6>
                <select id='station-square-color-mode-1' class='input' onchange='toggleSquareColorPicker(1);'>
                    <option value='auto'>Auto (Based on Mana Cost)</option>
                    <option value='white'>White</option>
                    <option value='blue'>Blue</option>
                    <option value='black'>Black</option>
                    <option value='red'>Red</option>
                    <option value='green'>Green</option>
                    <option value='multi'>Multicolored</option>
                    <option value='colorless'>Colorless</option>
                    <option value='custom'>Custom</option>
                </select>
            </div>
            <div id='station-square-color-picker-1' class='hidden'><h6 class='padding margin-bottom input-description'>Square Color:</h6><input id='station-square-color-1' type='color' class='input' value='#4a4a4a' onchange='stationEdited();'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Opacity:</h6><input id='station-square-opacity-1' type='range' class='input' min='0' max='1' step='0.1' value='0.7' oninput='stationEdited();'></div>
        </div>
        
        <h5 class='padding margin-bottom input-description'>Third Ability (Additional Text):</h5>
        <div class='padding input-grid margin-bottom'>
            <div><h6 class='padding margin-bottom input-description'>Height:</h6><input id='station-height-2' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Height'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Width:</h6><input id='station-square-width-2' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Square Width'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Height:</h6><input id='station-square-height-2' type='number' class='input' oninput='stationEdited();' min='0' placeholder='Square Height'></div>
            <div><h6 class='padding margin-bottom input-description'>Square X Offset:</h6><input id='station-square-x-2' type='number' class='input' oninput='stationEdited();' placeholder='Square X Offset'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Y Offset:</h6><input id='station-square-y-2' type='number' class='input' oninput='stationEdited();' placeholder='Square Y Offset'></div>
        </div>
        <div class='padding input-grid margin-bottom'>
            <div><h6 class='padding margin-bottom input-description'>Square Color Mode:</h6>
                <select id='station-square-color-mode-2' class='input' onchange='toggleSquareColorPicker(2);'>
                    <option value='auto'>Auto (Based on Mana Cost)</option>
                    <option value='white'>White</option>
                    <option value='blue'>Blue</option>
                    <option value='black'>Black</option>
                    <option value='red'>Red</option>
                    <option value='green'>Green</option>
                    <option value='multi'>Multicolored</option>
                    <option value='colorless'>Colorless</option>
                    <option value='custom'>Custom</option>
                </select>
            </div>
            <div id='station-square-color-picker-2' class='hidden'><h6 class='padding margin-bottom input-description'>Square Color:</h6><input id='station-square-color-2' type='color' class='input' value='#4a4a4a' onchange='stationEdited();'></div>
            <div><h6 class='padding margin-bottom input-description'>Square Opacity:</h6><input id='station-square-opacity-2' type='range' class='input' min='0' max='1' step='0.1' value='0.7' oninput='stationEdited();'></div>
        </div>
    </div>`;
    
    if (!card.station) {
        // Initialize with correct Y values if not already set by pack file
        card.station = {
            abilityCount: 3,
            x: 0.1167,
            width: 0.8094,
            badgeX: 0.066,
            badgeValues: ['', '', ''],
            disableFirstAbility: false,
            badgeSettings: {
                fontSize: 0.0250, // Font size as proportion of card height
                width: 162,    // Badge width in pixels
                height: 162    // Badge height in pixels
            },
            squares: {
                1: { width: 1713, height: 300, x: -214, y: 2050, enabled: true, color: '#4a4a4a', opacity: 0.4 },
                2: { width: 1713, height: 246, x: -214, y: 2350, enabled: true, color: '#4a4a4a', opacity: 0.6 }
            },
            baseTextPositions: {
                ability1: {x: 0.18, y: 0.7},
                ability2: {x: 0.18, y: 0.83}
            }
        };
    }
    if (!card.station.badgeValues) {
        card.station.badgeValues = ['', '', ''];
    }
    if (!card.station.badgeSettings) {
        card.station.badgeSettings = {
            fontSize: 0.0240,
            width: 162,
            height: 162
        };
    }
    if (!card.station.colorModes) {
        card.station.colorModes = {
            1: 'auto',
            2: 'auto'
        };
    }
    if (!card.station.badgeColorMode) {
        card.station.badgeColorMode = 'auto';
    }
    if (!card.station.colorSettings) {
        card.station.colorSettings = {
            // Default colors when no mana cost
            default: {
                square1: '#4a4a4a',
                square2: '#3a3a3a'
            },
            // Single mana colors
            w: {
                square1: '#fffbd5',  // Light cream for white
                square2: '#f8f6d8'   // Slightly darker cream
            },
            u: {
                square1: '#0e68ab',  // Blue
                square2: '#0a5a9a'   // Darker blue
            },
            b: {
                square1: '#150b00',  // Very dark brown/black
                square2: '#2d1b00'   // Slightly lighter dark brown
            },
            r: {
                square1: '#d3202a',  // Red
                square2: '#b91c24'   // Darker red
            },
            g: {
                square1: '#00733e',  // Green
                square2: '#005a32'   // Darker green
            },
            // Multicolored
            m: {
                square1: '#f8e71c',  // Gold
                square2: '#e6d419'   // Darker gold
            }
        };
    }

    if (!card.station.packDefaults) {
        card.station.packDefaults = {
            ability: {
                x: 175/2010,
                y: 1775/2814,
                width: 1660/2010,
                height: 280/2814
            }
        };
    }

    document.querySelector('#creator-menu-sections').appendChild(newHTML);
    
    // Initialize after setup
    fixStationInputs(stationEdited);
} else {
    fixStationInputs(stationEdited);
}

function updateStationTextPositions() {
    if (!card.station || !card.station.baseTextPositions) return;
    
    let positionsChanged = false;
    
    // Update ability1 text position and size based on its square OR use pack defaults if disabled
    if (card.text && card.text.ability1) {
        if (card.station.disableFirstAbility) {
            // Reset to pack defaults when first square is disabled
            const newX = 175/2010;
            const newWidth = 1660/2010;
            
            if (card.text.ability1.x !== newX || card.text.ability1.width !== newWidth) {
                card.text.ability1.x = newX;
                card.text.ability1.width = newWidth;
                positionsChanged = true;
                
                console.log('Set ability1 to pack defaults:', {
                    x: card.text.ability1.x,
                    y: card.text.ability1.y,
                    width: card.text.ability1.width,
                    height: card.text.ability1.height
                });
            }
        } else if (card.station.squares[1]) {
            // Use square-based positioning when enabled
            const square = card.station.squares[1];
            const basePos = card.station.baseTextPositions.ability1;
            
            // Calculate square position - SAME calculation as drawStationSquare
            const squareX = scaleX(basePos.x) + square.x;
            const squareY = square.y; // Use real Y coordinate directly (same as drawStationSquare)
            
            // Make text box 90% of square size and center it
            const textWidth = (square.width * 0.9) / card.width;
            const textHeight = (square.height * 0.9) / card.height;
            const textX = (squareX + (square.width * 0.05)) / card.width;
            const textY = (squareY + (square.height * 0.05)) / card.height;
            
            // Only update if values actually changed
            if (card.text.ability1.x !== textX || card.text.ability1.y !== textY || 
                card.text.ability1.width !== textWidth || card.text.ability1.height !== textHeight) {
                
                card.text.ability1.x = textX;
                card.text.ability1.y = textY;
                card.text.ability1.width = textWidth;
                card.text.ability1.height = textHeight;
                positionsChanged = true;
                
                console.log('Set ability1 to square-based positioning:', {
                    x: card.text.ability1.x,
                    y: card.text.ability1.y,
                    width: card.text.ability1.width,
                    height: card.text.ability1.height
                });
            }
        }
    }
    
    // Update ability2 text position and size based on its square (always uses square positioning)
    if (card.text && card.text.ability2 && card.station.squares[2]) {
        const square = card.station.squares[2];
        const basePos = card.station.baseTextPositions.ability2;
        
        // Calculate square position - SAME calculation as drawStationSquare
        const squareX = scaleX(basePos.x) + square.x;
        const squareY = square.y; // Use real Y coordinate directly (same as drawStationSquare)
        
        // Make text box 90% of square size and center it
        const textWidth = (square.width * 0.9) / card.width;
        const textHeight = (square.height * 0.9) / card.height;
        const textX = (squareX + (square.width * 0.05)) / card.width;
        const textY = (squareY + (square.height * 0.05)) / card.height;
        
        // Only update if values actually changed
        if (card.text.ability2.x !== textX || card.text.ability2.y !== textY || 
            card.text.ability2.width !== textWidth || card.text.ability2.height !== textHeight) {
            
            card.text.ability2.x = textX;
            card.text.ability2.y = textY;
            card.text.ability2.width = textWidth;
            card.text.ability2.height = textHeight;
            positionsChanged = true;
        }
    }
    
    // Only trigger redraws if positions actually changed
    if (positionsChanged) {
        // Force text layout updates for all text areas to show changes immediately
        if (typeof textEdited === 'function') {
            setTimeout(() => {
                textEdited();
            }, 10);
        }
        
        // Also force a full card redraw
        if (typeof drawCard === 'function') {
            setTimeout(() => {
                drawCard();
            }, 20);
        }
    }
}

function stationEdited() {
    // Check if canvas contexts exist
    if (!stationPreFrameContext || !stationPostFrameContext) {
        console.error('Station canvas contexts not available');
        return;
    }
    
    // Ensure baseTextPositions exists
    if (!card.station.baseTextPositions) {
        card.station.baseTextPositions = {
            ability1: {x: 0.18, y: 0.7},
            ability2: {x: 0.18, y: 0.83}
        };
    }
    
    // Update badge settings from inputs
    var badgeXInput = document.querySelector('#station-badge-x');
    var badgeValue1Input = document.querySelector('#station-badge-value-1');
    var badgeValue2Input = document.querySelector('#station-badge-value-2');
    var disableFirstAbilityInput = document.querySelector('#station-disable-first-ability');
    
    // Check if the disable first ability checkbox state changed
    const previousDisableState = card.station.disableFirstAbility;
    
    if (badgeXInput) card.station.badgeX = parseFloat(badgeXInput.value) || 0.015;
    if (badgeValue1Input) card.station.badgeValues[1] = badgeValue1Input.value;
    if (badgeValue2Input) card.station.badgeValues[2] = badgeValue2Input.value;
    if (disableFirstAbilityInput) {
        card.station.disableFirstAbility = disableFirstAbilityInput.checked;
        
        // If the checkbox state changed, update colors accordingly
        if (previousDisableState !== card.station.disableFirstAbility) {
            handleDisableFirstAbilityChange();
        }
    }
    
    // Update square properties from inputs
    updateSquareFromInputs(1);
    updateSquareFromInputs(2);
    
    // Update text positions and sizes based on squares AND checkbox state
    updateStationTextPositions();
    
    // Clear canvases
    stationPreFrameContext.clearRect(0, 0, stationPreFrameCanvas.width, stationPreFrameCanvas.height);
    stationPreFrameContext.globalCompositeOperation = 'source-over';
    stationPostFrameContext.clearRect(0, 0, stationPostFrameCanvas.width, stationPostFrameCanvas.height);
    
    // Draw squares (only draw if abilities aren't disabled)
    if (!card.station.disableFirstAbility) {
        drawStationSquare(1);
    }
    drawStationSquare(2);
    
    stationPreFrameContext.globalAlpha = 1;
    
    // Draw badges
    drawStationBadges();
    
    // Trigger card redraw
    drawCard();
}

function updateSquareFromInputs(index) {
    const inputs = {
        width: document.querySelector(`#station-square-width-${index}`),
        height: document.querySelector(`#station-square-height-${index}`),
        x: document.querySelector(`#station-square-x-${index}`),
        y: document.querySelector(`#station-square-y-${index}`),
        color: document.querySelector(`#station-square-color-${index}`),
        opacity: document.querySelector(`#station-square-opacity-${index}`)
    };
    
    if (inputs.width) card.station.squares[index].width = parseInt(inputs.width.value) || 200;
    if (inputs.height) card.station.squares[index].height = parseInt(inputs.height.value) || 30;
    if (inputs.x) card.station.squares[index].x = parseInt(inputs.x.value) || 0;
    if (inputs.y) card.station.squares[index].y = parseInt(inputs.y.value) || 0;
    if (inputs.color) card.station.squares[index].color = inputs.color.value;
    if (inputs.opacity) card.station.squares[index].opacity = parseFloat(inputs.opacity.value);
    
    // Auto-update second square Y position to follow first square (using real coordinates)
    if (index === 1 && card.station.squares[2]) {
        card.station.squares[2].y = card.station.squares[1].y + card.station.squares[1].height;
        // Update the UI input to reflect this change
        var square2YInput = document.querySelector('#station-square-y-2');
        if (square2YInput) square2YInput.value = card.station.squares[2].y;
    }
}

function drawStationSquare(index) {
    const square = card.station.squares[index];
    const abilityName = `ability${index}`;
    
    if (square.enabled && card.text && card.text[abilityName]) {
        const basePos = card.station.baseTextPositions[abilityName];
        // Use real Y coordinates directly, not as offset
        const squareX = scaleX(basePos.x) + square.x;
        const squareY = square.y; // Use real Y coordinate directly
        
        stationPreFrameContext.fillStyle = square.color;
        stationPreFrameContext.globalAlpha = square.opacity;
        stationPreFrameContext.fillRect(squareX, squareY, square.width, square.height);
    }
}

function drawStationBadges() {
    stationPostFrameContext.globalCompositeOperation = 'source-over';
    stationPostFrameContext.globalAlpha = 1;
    
    // Set up text properties for badge values using configurable font size
    stationPostFrameContext.fillStyle = 'white';
    stationPostFrameContext.font = scaleHeight(card.station.badgeSettings.fontSize) + 'px belerenbsc';
    stationPostFrameContext.textAlign = 'center';
    stationPostFrameContext.textBaseline = 'middle';
    
    // Draw badge for ability1 using shared image
    drawBadgeForAbility(1, 'ability1', stationBadgeImage);
    
    // Draw badge for ability2 using shared image
    drawBadgeForAbility(2, 'ability2', stationBadgeImage);
}

function drawBadgeForAbility(index, abilityName, badgeImage) {
    // Only draw if we have a valid number value for the badge
    if (!card.station.badgeValues || !card.station.badgeValues[index] || card.station.badgeValues[index].trim() === '') {
        return; // Exit early if no badge value
    }
    
    // Check if the badge value is a number (or at least contains numbers)
    const badgeValue = card.station.badgeValues[index].trim();
    if (!/\d/.test(badgeValue)) {
        return; // Exit if no numbers in the badge value
    }
    
    if (card.text && card.text[abilityName]) {
        // Get the square properties
        const square = card.station.squares[index];
        const basePos = card.station.baseTextPositions[abilityName];
        
        // Calculate square position - SAME calculation as drawStationSquare
        const squareX = scaleX(basePos.x) + square.x;
        const squareY = square.y; // Use real Y coordinate directly (same as drawStationSquare)
        const squareWidth = square.width;
        const squareHeight = square.height;
        
        // Use fixed pixel dimensions for badges
        const badgeWidth = card.station.badgeSettings.width;   // 162 pixels
        const badgeHeight = card.station.badgeSettings.height; // 162 pixels
        
        // Use badgeX to position the badge horizontally (0.0 = far left, 1.0 = far right)
        const badgeX = (card.station.badgeX * card.width) - (badgeWidth / 2); // Convert proportion to pixels and center badge
        const badgeY = squareY + (squareHeight / 2); // Center badge vertically on square
        
        // Check if badge image is loaded and draw it
        if (typeof badgeImage !== 'undefined' && badgeImage.complete && badgeImage.naturalWidth > 0) {
            stationPostFrameContext.drawImage(badgeImage, badgeX, badgeY - (badgeHeight / 2), badgeWidth, badgeHeight);
        }
        
        // Draw badge text with slight offset to the right for better centering
        const textXOffset = 3; // Adjust this value to move text left (-) or right (+)
        const textYOffset = 0; // Adjust this value to move text up (-) or down (+)
        
        const textX = badgeX + (badgeWidth / 2) + textXOffset; // Center horizontally on badge with offset
        const textY = badgeY + textYOffset; // Center vertically on badge with offset
        
        stationPostFrameContext.fillText(badgeValue, textX, textY);
    }
}

function setupManaListener() {
    // Check if mana text exists and if we've already set up the listener
    if (card.text && card.text.mana && !card.text.mana._stationListenerSet) {
        // Store the original onchange function
        const originalOnChange = card.text.mana.onChange;
        
        // Create a wrapper function that includes our updates
        card.text.mana.onChange = function() {
            // Call the original onChange if it exists
            if (originalOnChange && typeof originalOnChange === 'function') {
                originalOnChange.call(this);
            }
            
            // Update badge image and square colors based on mana cost
            setTimeout(() => {
                updateBadgeImageFromMana(); // This now also calls updateSquareColorsFromMana
            }, 50); // Small delay to ensure text is updated
        };
        
        // Also hook into the text property directly
        let manaTextValue = card.text.mana.text;
        Object.defineProperty(card.text.mana, 'text', {
            get: function() {
                return manaTextValue;
            },
            set: function(value) {
                manaTextValue = value;
                // Trigger badge and color updates when text changes
                setTimeout(() => {
                    updateBadgeImageFromMana(); // This now also calls updateSquareColorsFromMana
                }, 50);
            },
            configurable: true
        });
        
        // Mark that we've set up the listener to prevent duplicates
        card.text.mana._stationListenerSet = true;
        
        console.log('Mana listener set up successfully');
        return true;
    } else if (card.text && card.text.mana && card.text.mana._stationListenerSet) {
        console.log('Mana listener already set up');
        return true;
    } else {
        console.log('Mana text not available yet');
        return false;
    }
}

function updateBadgeImageFromMana() {
    // Only update badge if it's in auto mode
    if (card.station.badgeColorMode !== 'auto') {
        return;
    }
    
    if (!card.text || !card.text.mana) return;
    
    const manaText = card.text.mana.text || '';
    
    // Extract mana symbols from the text
    const manaSymbols = extractManaSymbols(manaText);
    
    // Determine which badge image to use
    let badgeImagePath = '/img/frames/station/badges/a.png'; // default
    
    if (manaSymbols.length === 0) {
        // No mana symbols - use default
        badgeImagePath = '/img/frames/station/badges/a.png';
    } else if (manaSymbols.length === 1) {
        // Single mana color
        const symbol = manaSymbols[0];
        badgeImagePath = `/img/frames/station/badges/${symbol}.png`;
    } else {
        // Multiple mana colors - use multicolored badge
        badgeImagePath = '/img/frames/station/badges/m.png';
    }
    
    // Only update if the image path has actually changed
    if (stationBadgeImage.src !== badgeImagePath && !stationBadgeImage.src.endsWith(badgeImagePath)) {
        console.log('Updating badge image to:', badgeImagePath);
        setImageUrl(stationBadgeImage, badgeImagePath);
    }
    
    // Also update square colors based on mana
    updateSquareColorsFromMana();
}

function updateSquareColorsFromMana() {
    if (!card.text || !card.text.mana || !card.station.colorSettings) return;
    
    // Only update squares that are set to 'auto' mode
    const mode1 = card.station.colorModes[1];
    const mode2 = card.station.colorModes[2];
    
    if (mode1 !== 'auto' && mode2 !== 'auto') {
        return; // No squares are in auto mode, skip mana-based updates
    }
    
    const manaText = card.text.mana.text || '';
    const manaSymbols = extractManaSymbols(manaText);
    
    // Determine which color set to use
    let colorKey = 'default';
    
    if (manaSymbols.length === 0) {
        colorKey = 'default';
    } else if (manaSymbols.length === 1) {
        colorKey = manaSymbols[0]; // w, u, b, r, or g
    } else {
        colorKey = 'm'; // multicolored
    }
    
    // Get the color settings for this mana type
    const colorSet = card.station.colorSettings[colorKey];
    
    if (colorSet) {
        // Check if first ability is disabled
        const disableFirstAbility = card.station.disableFirstAbility;
        
        // Only update square 1 if it's in auto mode
        if (mode1 === 'auto') {
            card.station.squares[1].color = colorSet.square1;
            const colorInput1 = document.querySelector('#station-square-color-1');
            if (colorInput1) colorInput1.value = card.station.squares[1].color;
        }
        
        // Only update square 2 if it's in auto mode
        if (mode2 === 'auto') {
            if (disableFirstAbility) {
                // When first ability is disabled, square 2 uses square 1's color
                card.station.squares[2].color = colorSet.square1;
            } else {
                card.station.squares[2].color = colorSet.square2;
            }
            const colorInput2 = document.querySelector('#station-square-color-2');
            if (colorInput2) colorInput2.value = card.station.squares[2].color;
        }
        
        console.log(`Updated square colors for mana type: ${colorKey}, first ability disabled: ${disableFirstAbility}`);
        console.log(`Square 1 color: ${card.station.squares[1].color}, Square 2 color: ${card.station.squares[2].color}`);
        
        // Force a redraw to show the color changes
        if (typeof stationEdited === 'function') {
            setTimeout(() => {
                if (!card.station.disableFirstAbility) {
                    drawStationSquare(1);
                }
                drawStationSquare(2);
                drawCard();
            }, 10);
        }
    }
}

function extractManaSymbols(manaText) {
    // Extract mana symbols from text like "{w}{u}{2}" etc.
    const manaRegex = /\{([wubrg])\}/gi;
    const matches = manaText.match(manaRegex);
    
    if (!matches) return [];
    
    // Extract unique color symbols
    const colorSymbols = new Set();
    matches.forEach(match => {
        const symbol = match.replace(/[{}]/g, '').toLowerCase();
        if (['w', 'u', 'b', 'r', 'g'].includes(symbol)) {
            colorSymbols.add(symbol);
        }
    });
    
    return Array.from(colorSymbols);
}

function fixStationInputs(callback) {
    // Set the checkbox state
    var disableFirstAbilityInput = document.querySelector('#station-disable-first-ability');
    if (disableFirstAbilityInput) disableFirstAbilityInput.checked = card.station.disableFirstAbility || false;
    
    // Only handle heights for abilities 1 and 2, not ability 0
    if (card.text && card.text.ability1) {
        var height1Input = document.querySelector('#station-height-1');
        if (height1Input) height1Input.value = scaleHeight(card.text.ability1.height);
    }
    if (card.text && card.text.ability2) {
        var height2Input = document.querySelector('#station-height-2');
        if (height2Input) height2Input.value = scaleHeight(card.text.ability2.height);
    }
    
    // Set badge inputs
    var badgeXInput = document.querySelector('#station-badge-x');
    if (badgeXInput) badgeXInput.value = card.station.badgeX;
    
    var badgeValue1Input = document.querySelector('#station-badge-value-1');
    if (badgeValue1Input) badgeValue1Input.value = card.station.badgeValues[1] || '';
    
    var badgeValue2Input = document.querySelector('#station-badge-value-2');
    if (badgeValue2Input) badgeValue2Input.value = card.station.badgeValues[2] || '';
    
    // Set badge color mode dropdown
    const badgeColorMode = document.querySelector('#station-badge-color-mode');
    if (badgeColorMode) {
        badgeColorMode.value = card.station.badgeColorMode || 'auto';
    }
    
    // Set color mode dropdowns and show/hide color pickers
    const colorMode1 = document.querySelector('#station-square-color-mode-1');
    const colorMode2 = document.querySelector('#station-square-color-mode-2');
    const colorPicker1 = document.querySelector('#station-square-color-picker-1');
    const colorPicker2 = document.querySelector('#station-square-color-picker-2');
    
    if (colorMode1) {
        colorMode1.value = card.station.colorModes[1] || 'auto';
        if (colorPicker1) {
            if (card.station.colorModes[1] === 'custom') {
                colorPicker1.classList.remove('hidden');
            } else {
                colorPicker1.classList.add('hidden');
            }
        }
    }
    
    if (colorMode2) {
        colorMode2.value = card.station.colorModes[2] || 'auto';
        if (colorPicker2) {
            if (card.station.colorModes[2] === 'custom') {
                colorPicker2.classList.remove('hidden');
            } else {
                colorPicker2.classList.add('hidden');
            }
        }
    }
    
    var inputs = [
        { id: '#station-square-width-1', value: card.station.squares[1].width },
        { id: '#station-square-height-1', value: card.station.squares[1].height },
        { id: '#station-square-x-1', value: card.station.squares[1].x },
        { id: '#station-square-y-1', value: card.station.squares[1].y },
        { id: '#station-square-color-1', value: card.station.squares[1].color || '#4a4a4a' },
        { id: '#station-square-opacity-1', value: card.station.squares[1].opacity || 0.7 },
        { id: '#station-square-width-2', value: card.station.squares[2].width },
        { id: '#station-square-height-2', value: card.station.squares[2].height },
        { id: '#station-square-x-2', value: card.station.squares[2].x },
        { id: '#station-square-y-2', value: card.station.squares[2].y },
        { id: '#station-square-color-2', value: card.station.squares[2].color || '#4a4a4a' },
        { id: '#station-square-opacity-2', value: card.station.squares[2].opacity || 0.7 }
    ];
    
    inputs.forEach(input => {
        var element = document.querySelector(input.id);
        if (element) element.value = input.value;
    });
    
    if (callback) {
        callback();
    }
}

function toggleSquareColorPicker(index) {
    const modeSelect = document.querySelector(`#station-square-color-mode-${index}`);
    const colorPickerDiv = document.querySelector(`#station-square-color-picker-${index}`);
    
    if (modeSelect && colorPickerDiv) {
        const mode = modeSelect.value;
        card.station.colorModes[index] = mode;
        
        if (mode === 'custom') {
            colorPickerDiv.classList.remove('hidden');
        } else {
            colorPickerDiv.classList.add('hidden');
            
            // Apply the selected preset color
            applyPresetColor(index, mode);
        }
        
        stationEdited();
    }
}

function applyPresetColor(index, mode) {
    const colorSettings = card.station.colorSettings;
    let color = '#4a4a4a'; // default
    
    // Check if first ability is disabled - affects square 2 color selection
    const disableFirstAbility = card.station.disableFirstAbility;
    
    switch(mode) {
        case 'auto':
            // This will be handled by updateSquareColorsFromMana
            updateSquareColorsFromMana();
            return;
        case 'white':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.w.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.w.square1 : colorSettings.w.square2;
            }
            break;
        case 'blue':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.u.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.u.square1 : colorSettings.u.square2;
            }
            break;
        case 'black':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.b.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.b.square1 : colorSettings.b.square2;
            }
            break;
        case 'red':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.r.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.r.square1 : colorSettings.r.square2;
            }
            break;
        case 'green':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.g.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.g.square1 : colorSettings.g.square2;
            }
            break;
        case 'multi':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.m.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.m.square1 : colorSettings.m.square2;
            }
            break;
        case 'colorless':
            if (index === 2 && disableFirstAbility) {
                color = colorSettings.default.square1; // Use square1 color for square2 when first is disabled
            } else {
                color = index === 1 ? colorSettings.default.square1 : colorSettings.default.square2;
            }
            break;
    }
    
    // Apply the color
    card.station.squares[index].color = color;
    
    // Update the color picker to show the applied color
    const colorInput = document.querySelector(`#station-square-color-${index}`);
    if (colorInput) colorInput.value = color;
}

function handleDisableFirstAbilityChange() {
    // When the checkbox changes, we need to update square 2's color if it's not in custom mode
    const mode2 = card.station.colorModes[2];
    
    if (mode2 !== 'custom' && mode2 !== 'auto') {
        // Square 2 is using a manual color mode, so we need to update it
        applyPresetColor(2, mode2);
    } else if (mode2 === 'auto') {
        // If it's in auto mode, trigger the mana-based update
        updateSquareColorsFromMana();
    }
}

function updateBadgeColorMode() {
    const modeSelect = document.querySelector('#station-badge-color-mode');
    
    if (modeSelect) {
        const mode = modeSelect.value;
        card.station.badgeColorMode = mode;
        
        // Apply the selected badge color
        applyBadgeColor(mode);
        
        stationEdited();
    }
}

function applyBadgeColor(mode) {
    let badgeImagePath = '/img/frames/station/badges/a.png'; // default
    
    switch(mode) {
        case 'auto':
            // This will be handled by updateBadgeImageFromMana
            updateBadgeImageFromMana();
            return;
        case 'white':
            badgeImagePath = '/img/frames/station/badges/w.png';
            break;
        case 'blue':
            badgeImagePath = '/img/frames/station/badges/u.png';
            break;
        case 'black':
            badgeImagePath = '/img/frames/station/badges/b.png';
            break;
        case 'red':
            badgeImagePath = '/img/frames/station/badges/r.png';
            break;
        case 'green':
            badgeImagePath = '/img/frames/station/badges/g.png';
            break;
        case 'multi':
            badgeImagePath = '/img/frames/station/badges/m.png';
            break;
        case 'colorless':
            badgeImagePath = '/img/frames/station/badges/a.png';
            break;
    }
    
    // Update the badge image
    console.log('Updating badge image to:', badgeImagePath);
    setImageUrl(stationBadgeImage, badgeImagePath);
}