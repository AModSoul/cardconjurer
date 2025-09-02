//checks to see if it needs to run

//============================================================================
// CONSTANTS AND CONFIGURATION
//============================================================================

const MINIMALIST_DEFAULTS = {
    baseY: 0.935,
    spacing: 0.05,
    minHeight: 0.1,
    maxHeight: 0.25,
    currentHeight: 0.1,
    settings: {
        maxOpacity: 0.95,
        fadeBottomOffset: -0.05,
        fadeTopOffset: -0.15,
        solidEnd: 1,
        bgColor1: '#000000',
        bgColor2: '#000000',
        bgColor3: '#000000',
        bgColorCount: '1'
    },
    dividerSettings: {
        color1: '#FFF7D8',
        color2: '#26C7FE',
        color3: '#B264FF',
        colorCount: 'auto'
    },
    ptSettings: {
        enabled: true,
        colorMode: 'auto',
        color1: '#FFFFFF',
        color2: '#FFFFFF'
    }
};

const COLOR_MAP = {
    'white': '#FFF7D8',
    'blue': '#26C7FE',
    'black': '#B264FF',
    'red': '#F13F35',
    'green': '#29EEA6'
};

const MANA_COLOR_MAP = {
    'w': 'white',
    'u': 'blue',
    'b': 'black',
    'r': 'red',
    'g': 'green'
};

//============================================================================
// SYMBOL LOADING
//============================================================================

const powerSymbol = new Image();
powerSymbol.crossOrigin = 'anonymous';
powerSymbol.src = fixUri('/img/frames/minimalist/p.svg');
let powerSymbolLoaded = false;

const toughnessSymbol = new Image();
toughnessSymbol.crossOrigin = 'anonymous';
toughnessSymbol.src = fixUri('/img/frames/minimalist/t.svg');
let toughnessSymbolLoaded = false;

powerSymbol.onload = () => {
    powerSymbolLoaded = true;
    console.log('Power symbol loaded successfully');
    drawCard();
};

powerSymbol.onerror = () => {
    console.error('Failed to load power symbol');
};

toughnessSymbol.onload = () => {
    toughnessSymbolLoaded = true;
    console.log('Toughness symbol loaded successfully');
    drawCard();
};

toughnessSymbol.onerror = () => {
    console.error('Failed to load toughness symbol');
};

//============================================================================
// UTILITY FUNCTIONS
//============================================================================

function hexToRgba(hex, alpha) {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function getColorHex(colorName) {
    return COLOR_MAP[colorName] || '#FFFFFF';
}

function blendColors(hex1, hex2, ratio = 0.5) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    
    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getManaColorsFromText() {
    if (!card.text.mana || !card.text.mana.text) {
        return [];
    }
    
    const manaText = card.text.mana.text;
    const colors = [];
    const manaMatches = manaText.match(/\{[^}]+\}/g) || [];
    
    for (const match of manaMatches) {
        const symbol = match.toLowerCase().replace(/[{}]/g, '');
        
        if (MANA_COLOR_MAP[symbol]) {
            if (!colors.includes(MANA_COLOR_MAP[symbol])) {
                colors.push(MANA_COLOR_MAP[symbol]);
            }
        } else if (symbol.includes('/')) {
            const hybridColors = symbol.split('/');
            for (const hybridColor of hybridColors) {
                if (MANA_COLOR_MAP[hybridColor] && !colors.includes(MANA_COLOR_MAP[hybridColor])) {
                    colors.push(MANA_COLOR_MAP[hybridColor]);
                }
            }
        }
    }
    
    return colors;
}

function getManaHexColors() {
    return getManaColorsFromText().map(color => getColorHex(color));
}

function getMinimalistSetting(settingName, defaultValue = true) {
    return document.getElementById(`minimalist-${settingName}`)?.checked ?? defaultValue;
}

function updateCardSettings(settingsKey, newSettings) {
    if (!card.minimalist[settingsKey]) {
        card.minimalist[settingsKey] = {};
    }
    card.minimalist[settingsKey] = { ...card.minimalist[settingsKey], ...newSettings };
}

function drawSymbolIfReady(symbol, isLoaded, textObj, color, symbolSize, offsetX) {
    if (textObj.text && textObj.text.length > 0 && isLoaded && symbol.complete) {
        drawColoredSymbol(symbol, textObj, color, symbolSize, offsetX);
    }
}

function setUIDefaults() {
    const settingsMap = {
        'max-opacity': MINIMALIST_DEFAULTS.settings.maxOpacity,
        'fade-bottom-offset': MINIMALIST_DEFAULTS.settings.fadeBottomOffset,
        'fade-top-offset': MINIMALIST_DEFAULTS.settings.fadeTopOffset,
        'bg-gradient-enabled': true,
        'divider-enabled': true,
        'pt-symbols-enabled': MINIMALIST_DEFAULTS.ptSettings.enabled,
        'pt-color-mode': MINIMALIST_DEFAULTS.ptSettings.colorMode,
        'pt-color-1': MINIMALIST_DEFAULTS.ptSettings.color1,
        'pt-color-2': MINIMALIST_DEFAULTS.ptSettings.color2
    };
    
    Object.entries(settingsMap).forEach(([key, value]) => {
        const element = document.getElementById(`minimalist-${key}`);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = value;
            } else {
                element.value = value;
            }
        }
    });
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

//============================================================================
// TEXT MEASUREMENT AND POSITIONING
//============================================================================

function measureTextHeight(text, ctx, width, fontSize) {
    if (!text) return 0;
    
    const cacheKey = `${text.length}_${width}_${fontSize}`;
    if (card.minimalist.textCache && card.minimalist.textCache[cacheKey]) {
        return card.minimalist.textCache[cacheKey];
    }
    
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
        totalLines++;
    }
    
    const result = totalLines * fontSize * 1.2;
    
    if (!card.minimalist.textCache) card.minimalist.textCache = {};
    card.minimalist.textCache[cacheKey] = result;
    
    return result;
}

function updateTextPositions(rulesHeight) {
    const dividerOffset = 0.03;
    const dividerSpacing = 0.02;
    
    const rulesY = card.minimalist.baseY - rulesHeight - dividerOffset;
    const typeY = rulesY - (card.minimalist.spacing * 0.9) - dividerSpacing;
    const titleY = typeY - (card.minimalist.spacing * 0.65);
    const manaY = titleY - (card.minimalist.spacing * 0.6);
    
    const dividerOffset2 = 0.050;
    const dividerY = typeY + dividerOffset2;
    const setSymbolOffsetAboveDivider = 0.025;
    const setSymbolY = dividerY - setSymbolOffsetAboveDivider;

    // Update text positions
    if (card.text.rules) {
        card.text.rules.y = rulesY;
        card.text.rules.height = rulesHeight;
    }
    if (card.text.type) card.text.type.y = typeY;
    if (card.text.title) card.text.title.y = titleY;
    if (card.text.mana) card.text.mana.y = manaY;
    
    // Update set symbol position
    if (card.setSymbolBounds) {
        card.setSymbolBounds.y = setSymbolY;
        resetSetSymbol();
    }

    // Update background gradient
    updateBackgroundGradient(manaY, rulesY);
    
    // Update divider
    const dividerEnabled = getMinimalistSetting('divider-enabled');
    if (dividerEnabled) {
        drawDividerGradient();
    }
    
    drawCard();
    return { rulesY, typeY, titleY, manaY, setSymbolY };
}

function updateBackgroundGradient(manaY, rulesY) {
    if (!card.gradientOptions) return;
    
    const bgGradientEnabled = getMinimalistSetting('bg-gradient-enabled');
    
    if (bgGradientEnabled) {
        const settings = card.minimalist.settings || MINIMALIST_DEFAULTS.settings;
        
        let backgroundColors = [];
        if (settings.bgColorCount === 'mana-auto') {
            backgroundColors = getManaHexColors();
            if (backgroundColors.length === 0) {
                backgroundColors = ['#808080'];
            }
        } else {
            const colorCount = parseInt(settings.bgColorCount);
            const customColors = [settings.bgColor1, settings.bgColor2, settings.bgColor3];
            backgroundColors = customColors.slice(0, colorCount);
        }
        
        const fadeTopY = manaY + settings.fadeTopOffset;
        const fadeBottomY = rulesY + settings.fadeBottomOffset;
        const solidStartY = fadeBottomY;
        const solidEndY = settings.solidEnd;
        
        const fadeHeight = fadeBottomY - fadeTopY;
        const solidHeight = solidEndY - solidStartY;
        
        card.gradientOptions = {
            ...card.gradientOptions,
            yPosition: fadeTopY,
            height: fadeHeight,
            solidHeight: solidHeight,
            maxOpacity: settings.maxOpacity,
            startFromBottom: false,
            fadeDirection: 'down',
            endOpacity: settings.maxOpacity,
            colors: backgroundColors
        };
        
        drawHorizontalGradient(card.gradientOptions);
    } else {
        gradientContext.clearRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    }
}

//============================================================================
// GRADIENT AND VISUAL EFFECTS
//============================================================================

function createGradientForColors(context, x, y, width, colorsToUse, colorCount) {
    const gradient = context.createLinearGradient(x, 0, x + width, 0);
    
    if (colorCount === 0) {
        gradient.addColorStop(0, hexToRgba('#CBC2C0', 0.5));
        gradient.addColorStop(0.25, hexToRgba('#CBC2C0', 1));
        gradient.addColorStop(0.75, hexToRgba('#CBC2C0', 1));
        gradient.addColorStop(1, hexToRgba('#CBC2C0', 0.5));
    } else if (colorCount === 1) {
        const color = colorsToUse[0];
        gradient.addColorStop(0, hexToRgba(color, 0.5));
        gradient.addColorStop(0.25, hexToRgba(color, 1));
        gradient.addColorStop(0.75, hexToRgba(color, 1));
        gradient.addColorStop(1, hexToRgba(color, 0.5));
    } else if (colorCount === 2) {
        const [color1, color2] = colorsToUse;
        gradient.addColorStop(0, hexToRgba(color1, 0.5));
        gradient.addColorStop(0.25, hexToRgba(color1, 1));
        gradient.addColorStop(0.45, hexToRgba(color1, 1));
        gradient.addColorStop(0.5, hexToRgba(blendColors(color1, color2), 1));
        gradient.addColorStop(0.55, hexToRgba(color2, 1));
        gradient.addColorStop(0.75, hexToRgba(color2, 1));
        gradient.addColorStop(1, hexToRgba(color2, 0.5));
    } else if (colorCount === 3) {
        const [color1, color2, color3] = colorsToUse;
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
        gradient.addColorStop(0, hexToRgba('#e3d193', 0.5));
        gradient.addColorStop(0.25, hexToRgba('#e3d193', 1));
        gradient.addColorStop(0.75, hexToRgba('#e3d193', 1));
        gradient.addColorStop(1, hexToRgba('#e3d193', 0.5));
    }
    
    return gradient;
}

function drawDividerGradient() {
    if (!card.text.rules || !card.text.type || card.version !== 'Minimalist') {
        return;
    }
    
    const dividerEnabled = getMinimalistSetting('divider-enabled');
    if (!dividerEnabled) {
        if (card.dividerCanvas) {
            card.dividerContext.clearRect(0, 0, card.dividerCanvas.width, card.dividerCanvas.height);
        }
        return;
    }

    // Initialize divider canvas
    if (!card.dividerCanvas) {
        card.dividerCanvas = document.createElement('canvas');
        card.dividerCanvas.width = card.width;
        card.dividerCanvas.height = card.height;
        card.dividerContext = card.dividerCanvas.getContext('2d');
    }
    
    card.dividerContext.clearRect(0, 0, card.dividerCanvas.width, card.dividerCanvas.height);
    
    // Determine colors and draw divider
    const { colorsToUse, colorCount } = getDividerColors();
    drawDividerBar(colorsToUse, colorCount);
    
    // Draw P/T symbols if enabled
    drawPTSymbols();
}

function getDividerColors() {
    let colorsToUse = [];
    let colorCount = 0;
    
    if (card.minimalist.dividerSettings && card.minimalist.dividerSettings.colorCount !== 'auto') {
        colorCount = parseInt(card.minimalist.dividerSettings.colorCount);
        const customColors = [
            card.minimalist.dividerSettings.color1,
            card.minimalist.dividerSettings.color2,
            card.minimalist.dividerSettings.color3
        ];
        colorsToUse = customColors.slice(0, colorCount);
    } else {
        colorsToUse = getManaHexColors();
        colorCount = colorsToUse.length;
    }
    
    return { colorsToUse, colorCount };
}

function drawDividerBar(colorsToUse, colorCount) {
    const rulesX = card.text.rules.x;
    const rulesWidth = card.text.rules.width;
    const typeY = card.text.type.y;
    const dividerOffset = 0.050;
    const dividerY = typeY + dividerOffset;
    const dividerHeight = 0.002;
    
    const actualX = rulesX * card.width;
    const actualY = dividerY * card.height;
    const actualWidth = rulesWidth * card.width;
    const actualHeight = dividerHeight * card.height;
    
    const gradient = createGradientForColors(card.dividerContext, actualX, actualY, actualWidth, colorsToUse, colorCount);
    
    card.dividerContext.fillStyle = gradient;
    card.dividerContext.fillRect(actualX, actualY, actualWidth, actualHeight);
}

function drawPTSymbols() {
    if (!card.text.power || !card.text.toughness) return;
    
    const ptEnabled = card.minimalist.ptSettings?.enabled ?? true;
    if (!ptEnabled) return;

    const hasPower = card.text.power.text && card.text.power.text.length > 0;
    const hasToughness = card.text.toughness.text && card.text.toughness.text.length > 0;

    if (!hasPower && !hasToughness) return;

    const { powerColor, toughnessColor } = getPTColors();
    const symbolSize = card.text.power.size * card.height * 1.05;
    const offsetX = -symbolSize * 0.81;

    drawSymbolIfReady(powerSymbol, powerSymbolLoaded, card.text.power, powerColor, symbolSize, offsetX);
    drawSymbolIfReady(toughnessSymbol, toughnessSymbolLoaded, card.text.toughness, toughnessColor, symbolSize, offsetX);
}

function getPTColors() {
    const colorMode = card.minimalist.ptSettings?.colorMode ?? 'auto';
    let powerColor, toughnessColor;

    if (colorMode === 'auto') {
        const manaColors = getManaColorsFromText();
        if (manaColors.length === 0) {
            powerColor = toughnessColor = '#CBC2C0';
        } else if (manaColors.length === 1) {
            powerColor = toughnessColor = getColorHex(manaColors[0]);
        } else if (manaColors.length === 2) {
            powerColor = getColorHex(manaColors[0]);
            toughnessColor = getColorHex(manaColors[1]);
        } else {
            powerColor = toughnessColor = '#e3d193';
        }
    } else if (colorMode === '1') {
        powerColor = toughnessColor = card.minimalist.ptSettings.color1;
    } else {
        powerColor = card.minimalist.ptSettings.color1;
        toughnessColor = card.minimalist.ptSettings.color2;
    }

    return { powerColor, toughnessColor };
}

function drawColoredSymbol(symbol, textObj, color, symbolSize, offsetX) {
    const x = textObj.x * card.width + offsetX;
    const y = textObj.y * card.height - (symbolSize - textObj.size * card.height) / 2;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = symbolSize;
    tempCanvas.height = symbolSize;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.drawImage(symbol, 0, 0, symbolSize, symbolSize);
    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, symbolSize, symbolSize);
    
    card.dividerContext.drawImage(tempCanvas, x, y);
}

//============================================================================
// UI CREATION AND EVENT HANDLERS
//============================================================================

function createMinimalistUI() {
    document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `minimalist`)">Minimalist</h3>';
    
    const newHTML = document.createElement('div');
    newHTML.id = 'creator-menu-minimalist';
    newHTML.classList.add('hidden');
    newHTML.innerHTML = getUIHTML();
    
    document.querySelector('#creator-menu-sections').appendChild(newHTML);
}

function getUIHTML() {
    return `
<div class='readable-background padding'>
    <h5 class='padding margin-bottom input-description' style="font-size: 2em; font-weight: bold;">Gradient Settings</h5>
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 10px 0;"></div>

    <h5 class='input-description margin-bottom'>Enable Background Gradient</h5>
    <label class='checkbox-container input margin-bottom'>Toggle Background Gradient
        <input id='minimalist-bg-gradient-enabled' type='checkbox' class='input' onchange='updateMinimalistGradient();' checked>
        <span class='checkmark'></span>
    </label>

    <h5 class='padding input-description'>Maximum Opacity (0-1):</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-max-opacity' type='number' class='input' oninput='updateMinimalistGradient();' min='0' max='1' step='0.01' value='0.95'>
    </div>
    
    <h5 class='padding input-description'>Fade Start Position:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-fade-bottom-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.2' max='0.2' step='0.01' value='-0.05'>
    </div>
    
    <h5 class='padding input-description'>Fade End Position:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-fade-top-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.5' max='0' step='0.01' value='-0.15'>
    </div>
    
    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

    <h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Background Gradient Colors</h5>

    <h5 class='padding input-description'>Background Colors:</h5>
    <div class='padding input-grid margin-bottom'>
        <select id='minimalist-bg-color-count' class='input' onchange='updateMinimalistGradient();'>
            <option value='1' selected>1 Color</option>
            <option value='mana-auto'>Auto (Mana Colors)</option>
            <option value='2'>2 Colors</option>
            <option value='3'>3 Colors</option>
        </select>
    </div> 
    
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

    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

    <h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Divider Bar</h5>

    <h5 class='input-description margin-bottom'>Enable Divider Bar</h5>
    <label class='checkbox-container input margin-bottom'>Toggle Divider Bar
        <input id='minimalist-divider-enabled' type='checkbox' class='input' onchange='updateDividerColors();' checked>
        <span class='checkmark'></span>
    </label>

    <h5 class='padding input-description'>Divider Colors:</h5>
    <div class='padding input-grid margin-bottom'>
        <select id='minimalist-color-count' class='input' onchange='updateDividerColors();'>
            <option value='auto'>Auto (from mana cost)</option>
            <option value='1'>1 Color</option>
            <option value='2'>2 Colors</option>
            <option value='3'>3 Colors</option>
        </select>
    </div>
    
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

    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 10px 0;"></div>
    
    <h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">P/T Symbols</h5>

    <h5 class='input-description margin-bottom'>Enable P/T Symbols</h5>
    <label class='checkbox-container input margin-bottom'>Toggle P/T Symbols
        <input id='minimalist-pt-symbols-enabled' type='checkbox' class='input' onchange='updatePTSymbols();' checked>
        <span class='checkmark'></span>
    </label>

    <h5 class='padding input-description'>Symbol Colors:</h5>
    <div class='padding input-grid margin-bottom'>
        <select id='minimalist-pt-color-mode' class='input' onchange='updatePTSymbols();'>
            <option value='auto'>Auto (from mana cost)</option>
            <option value='1'>1 Color</option>
            <option value='2'>2 Colors</option>
        </select>
    </div>

    <h5 class='padding input-description'>Color 1:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-pt-color-1' type='color' class='input' oninput='updatePTSymbols();' value='#FFFFFF'>
    </div>

    <h5 class='padding input-description'>Color 2:</h5>
    <div class='padding input-grid margin-bottom'>
        <input id='minimalist-pt-color-2' type='color' class='input' oninput='updatePTSymbols();' value='#FFFFFF'>
    </div>

    <div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>
    
    <h5 class='padding input-description'>Reset Settings</h5>
    <div class='padding input-grid margin-bottom'>
        <button id='reset-minimalist-gradient' class='input' onclick='resetMinimalistGradient();'>Reset All Settings</button>
    </div>
</div>`;
}

//============================================================================
// UPDATE FUNCTIONS
//============================================================================

function updateMinimalistGradient() {
    if (card.version === 'Minimalist' && card.gradientOptions) {
        const maxOpacity = parseFloat(document.getElementById('minimalist-max-opacity').value);
        const fadeBottomOffset = parseFloat(document.getElementById('minimalist-fade-bottom-offset').value);
        const fadeTopOffset = parseFloat(document.getElementById('minimalist-fade-top-offset').value);
        const bgColor1 = document.getElementById('minimalist-bg-color-1').value;
        const bgColor2 = document.getElementById('minimalist-bg-color-2').value;
        const bgColor3 = document.getElementById('minimalist-bg-color-3').value;
        const bgColorCount = document.getElementById('minimalist-bg-color-count').value;
        
        updateCardSettings('settings', {
            maxOpacity,
            fadeBottomOffset,
            fadeTopOffset,
            solidEnd: 1,
            bgColor1,
            bgColor2,
            bgColor3,
            bgColorCount
        });
        
        if (card.text.rules) {
            updateTextPositions(card.minimalist.currentHeight);
        }
    }
}

function updateDividerColors() {
    if (card.version === 'Minimalist') {
        const color1 = document.getElementById('minimalist-color-1').value;
        const color2 = document.getElementById('minimalist-color-2').value;
        const color3 = document.getElementById('minimalist-color-3').value;
        const colorCount = document.getElementById('minimalist-color-count').value;
        
        updateCardSettings('dividerSettings', { color1, color2, color3, colorCount });
        drawDividerGradient();
        drawCard();
    }
}

function updatePTSymbols() {
    if (card.version === 'Minimalist') {
        const enabled = document.getElementById('minimalist-pt-symbols-enabled').checked;
        const colorMode = document.getElementById('minimalist-pt-color-mode').value;
        const color1 = document.getElementById('minimalist-pt-color-1').value;
        const color2 = document.getElementById('minimalist-pt-color-2').value;
        
        updateCardSettings('ptSettings', { enabled, colorMode, color1, color2 });
        drawDividerGradient();
        drawCard();
    }
}

function syncDividerColorsWithMana() {
    if (card.minimalist.dividerSettings && card.minimalist.dividerSettings.colorCount === 'auto') {
        const manaColors = getManaColorsFromText();
        
        document.getElementById('minimalist-color-1').value = getColorHex(manaColors[0]) || '#FFF7D8';
        document.getElementById('minimalist-color-2').value = getColorHex(manaColors[1]) || '#26C7FE';
        document.getElementById('minimalist-color-3').value = getColorHex(manaColors[2]) || '#B264FF';
        
        drawDividerGradient();
        drawCard();
    }
}

function resetMinimalistGradient() {
    const manaColors = getManaColorsFromText();
    const defaultColors = {
        color1: getColorHex(manaColors[0]) || '#FFF7D8',
        color2: getColorHex(manaColors[1]) || '#26C7FE',
        color3: getColorHex(manaColors[2]) || '#B264FF',
        colorCount: 'auto',
        bgColor1: '#000000',
        bgColor2: '#000000',
        bgColor3: '#000000',
        bgColorCount: '1'
    };
    
    // Set all UI defaults
    setUIDefaults();
    
    // Update color inputs with mana colors - FIXED
    document.getElementById('minimalist-color-1').value = defaultColors.color1;
    document.getElementById('minimalist-color-2').value = defaultColors.color2;
    document.getElementById('minimalist-color-3').value = defaultColors.color3;
    document.getElementById('minimalist-color-count').value = defaultColors.colorCount;
    
    // Update background color inputs
    document.getElementById('minimalist-bg-color-1').value = defaultColors.bgColor1;
    document.getElementById('minimalist-bg-color-2').value = defaultColors.bgColor2;
    document.getElementById('minimalist-bg-color-3').value = defaultColors.bgColor3;
    document.getElementById('minimalist-bg-color-count').value = defaultColors.bgColorCount;
    
    // Update card settings
    updateCardSettings('settings', { ...MINIMALIST_DEFAULTS.settings, ...defaultColors });
    updateCardSettings('dividerSettings', { 
        color1: defaultColors.color1,
        color2: defaultColors.color2,
        color3: defaultColors.color3,
        colorCount: defaultColors.colorCount
    });
    updateCardSettings('ptSettings', { ...MINIMALIST_DEFAULTS.ptSettings });

    updateTextPositions(card.minimalist.currentHeight);
    
    // Visual feedback
    const resetButton = document.getElementById('reset-minimalist-gradient');
    const originalText = resetButton.textContent;
    resetButton.textContent = 'Settings Reset!';
    resetButton.classList.add('success-highlight');
    
    setTimeout(() => {
        resetButton.textContent = originalText;
        resetButton.classList.remove('success-highlight');
    }, 1500);
}

//============================================================================
// INITIALIZATION AND TEXT HANDLING
//============================================================================

function initializeMinimalistVersion(savedText) {
    if (!card.minimalist.settings) {
        card.minimalist.settings = { ...MINIMALIST_DEFAULTS.settings };
    }
    
    if (!card.gradientOptions) {
        card.gradientOptions = {
            yPosition: 0.5,
            height: 0.3,
            solidHeight: 0.5,
            maxOpacity: card.minimalist.settings.maxOpacity,
            startFromBottom: false,
            fadeDirection: 'down',
            endOpacity: card.minimalist.settings.maxOpacity,
            colors: ['#000000']
        };
    }
    
    // Set UI values from stored settings
    const settings = card.minimalist.settings;
    document.getElementById('minimalist-bg-gradient-enabled').checked = settings.bgGradientEnabled ?? true;
    document.getElementById('minimalist-divider-enabled').checked = settings.dividerEnabled ?? true;
    document.getElementById('minimalist-max-opacity').value = settings.maxOpacity;
    document.getElementById('minimalist-fade-bottom-offset').value = settings.fadeBottomOffset;
    document.getElementById('minimalist-fade-top-offset').value = settings.fadeTopOffset;
    
    // Set background color UI values
    ['bgColor1', 'bgColor2', 'bgColor3', 'bgColorCount'].forEach(key => {
        const element = document.getElementById(`minimalist-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
        if (element) element.value = settings[key] || MINIMALIST_DEFAULTS.settings[key];
    });

    setupTextHandling(savedText);
}

function setupTextHandling(savedText) {
    const debouncedScale = debounce((text) => {
        if (card.text.rules && card.version === 'Minimalist') {
            if (card.minimalist.lastProcessedText === text) return;
            
            card.minimalist.lastProcessedText = text;

            card.minimalist.ctx.clearRect(0, 0, card.width, card.height);
            card.minimalist.ctx.font = `${card.text.rules.size * card.height}px "${card.text.rules.font}"`;
            
            const actualTextHeight = measureTextHeight(
                text,
                card.minimalist.ctx,
                card.text.rules.width * card.width,
                card.text.rules.size * card.height
            );
                    
            const newHeight = Math.min(
                card.minimalist.maxHeight,
                Math.max(
                    card.minimalist.minHeight,
                    (actualTextHeight / card.height)
                )
            );

            const now = Date.now();
            const textLengthChanged = Math.abs((card.minimalist.lastTextLength || 0) - text.length) > 10;
            const timeElapsed = now - (card.minimalist.lastFullUpdate || 0) > 1000;
            
            if (textLengthChanged || timeElapsed) {
                requestAnimationFrame(() => {
                    card.minimalist.currentHeight = newHeight;
                    updateTextPositions(newHeight);
                    drawTextBuffer();
                    drawCard();
                    
                    card.minimalist.lastTextLength = text.length;
                    card.minimalist.lastFullUpdate = now;
                });
            }
        }
    }, 200);
    
    // Restore saved text
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

    if (!hasRulesText) {
        updateTextPositions(card.minimalist.currentHeight);
    }

    // Set up input listener
    const textEditor = document.querySelector('#text-editor');
    if (textEditor) {
        textEditor.addEventListener('input', function() {
            const text = this.value;
            const delay = text.length > 500 ? 250 : 0;
            setTimeout(() => debouncedScale(text), delay);
        });
    }

    // Override textEdited function
    const originalTextEdited = window.textEdited;
    window.textEdited = function() {
        if (originalTextEdited) originalTextEdited();
        
        if (card.version === 'Minimalist') {
            syncDividerColorsWithMana();
            
            if (card.text.rules && card.text.rules.text) {
                setTimeout(() => {
                    debouncedScale(card.text.rules.text);
                }, 400);
            }
        }
    };
}

//============================================================================
// MAIN INITIALIZATION
//============================================================================

if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
    loadedVersions.push('/js/frames/versionMinimalist.js');

    // Initialize card minimalist object
    if (!card.minimalist) {
        card.minimalist = {
            ...MINIMALIST_DEFAULTS,
            textCache: {},
            lastTextLength: 0,
            lastProcessedText: '',
            lastFullUpdate: 0
        };
        
        // Create measurement canvas
        const measureCanvas = document.createElement('canvas');
        measureCanvas.width = card.width;
        measureCanvas.height = card.height;
        card.minimalist.ctx = measureCanvas.getContext('2d');
    }
    
    // Create UI
    createMinimalistUI();

    // Make functions globally accessible
    window.updateMinimalistGradient = updateMinimalistGradient;
    window.updateDividerColors = updateDividerColors;
    window.updatePTSymbols = updatePTSymbols;
    window.updateTextPositions = updateTextPositions;
    window.drawDividerGradient = drawDividerGradient;
    window.syncDividerColorsWithMana = syncDividerColorsWithMana;
    window.resetMinimalistGradient = resetMinimalistGradient;
    window.measureTextHeight = measureTextHeight;
    window.clearMinimalistTextCache = () => { card.minimalist.textCache = {}; };
    window.debounce = debounce;
    window.initializeMinimalistVersion = initializeMinimalistVersion;
}