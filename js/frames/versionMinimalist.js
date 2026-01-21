//============================================================================
// CONSTANTS AND CONFIGURATION
//============================================================================

// Check if constants already exist before declaring them
if (typeof window.MINIMALIST_DEFAULTS === 'undefined') {
	window.MINIMALIST_DEFAULTS = {
		baseY: 0.91,
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
			color1: '#ffffff',
			color2: '#ffffff',
			color3: '#ffffff',
			colorCount: 'ci-auto'
		},
		ptSettings: {
			enabled: true,
			colorMode: 'ci-auto',
			color1: '#FFFFFF',
			color2: '#FFFFFF'
		},
		typeSettings: {
			autoColorCI: true,
			customColor: '#FFFFFF'
		}
	};
}

if (typeof window.COLOR_MAP === 'undefined') {
	window.COLOR_MAP = {
		'white': '#FFF7D8',
		'blue': '#26C7FE',
		'black': '#B264FF',
		'red': '#F13F35',
		'green': '#29EEA6'
	};
}

if (typeof window.MANA_COLOR_MAP === 'undefined') {
	window.MANA_COLOR_MAP = {
		'w': 'white',
		'u': 'blue',
		'b': 'black',
		'r': 'red',
		'g': 'green'
	};
}

// Cache color calculations - use window object to avoid redeclaration
if (typeof window.COLOR_CACHE === 'undefined') {
	window.COLOR_CACHE = new Map();
}

// Default/fallback colors used throughout the frame
if (typeof window.MINIMALIST_COLOR_DEFAULTS === 'undefined') {
	window.MINIMALIST_COLOR_DEFAULTS = {
		colorless: '#CBC2C0',    // Used for colorless cards (P/T symbols, divider)
		multicolor: '#e3d193',    // Gold for multicolor
		artifact: '#bff7f8',      // Light Blue for artifacts
		white: '#FFFFFF'          // Default white for text
	};
}

//============================================================================
// PERFORMANCE OPTIMIZATIONS
//============================================================================

// Check if DOM_CACHE already exists
if (typeof DOM_CACHE === 'undefined') {
	const DOM_CACHE = {
		textEditor: null,
		uiElements: new Map(),
		initialized: false
	};
	window.DOM_CACHE = DOM_CACHE;
}

// Check if CALC_CACHE already exists
if (typeof CALC_CACHE === 'undefined') {
	const CALC_CACHE = {
		cardDimensions: null,
		lastWidth: 0,
		lastHeight: 0
	};
	window.CALC_CACHE = CALC_CACHE;
}

function initDOMCache() {
	if (window.DOM_CACHE.initialized) return;
	
	window.DOM_CACHE.textEditor = document.querySelector('#text-editor');
	
	// Cache UI elements that are accessed frequently
	const elementIds = [
		'minimalist-bg-gradient-enabled', 'minimalist-divider-enabled',
		'minimalist-min-rules-height', 'minimalist-max-rules-height', 'minimalist-max-opacity', 'minimalist-fade-bottom-offset',
		'minimalist-fade-top-offset', 'minimalist-bg-color-count',
		'minimalist-color-count', 'minimalist-pt-symbols-enabled',
		'minimalist-pt-color-mode', 'minimalist-bg-color-1',
		'minimalist-bg-color-2', 'minimalist-bg-color-3',
		'minimalist-color-1', 'minimalist-color-2', 'minimalist-color-3',
		'minimalist-pt-color-1', 'minimalist-pt-color-2',
		'minimalist-type-auto-color-ci', 'minimalist-type-color'
	];
	
	elementIds.forEach(id => {
		const element = document.getElementById(id);
		if (element) window.DOM_CACHE.uiElements.set(id, element);
	});
	
	window.DOM_CACHE.initialized = true;
}

function getCachedElement(id) {
	if (!window.DOM_CACHE.initialized) initDOMCache();
	return window.DOM_CACHE.uiElements.get(id) || document.getElementById(id);
}

function getCardDimensions() {
	if (window.CALC_CACHE.lastWidth !== card.width || window.CALC_CACHE.lastHeight !== card.height) {
		window.CALC_CACHE.cardDimensions = {
			width: card.width,
			height: card.height,
			halfWidth: card.width / 2,
			halfHeight: card.height / 2
		};
		window.CALC_CACHE.lastWidth = card.width;
		window.CALC_CACHE.lastHeight = card.height;
	}
	return window.CALC_CACHE.cardDimensions;
}

//============================================================================
// SYMBOL LOADING
//============================================================================

// Check if variables already exist before declaring them
if (typeof powerSymbol === 'undefined') {
	const powerSymbol = new Image();
	powerSymbol.crossOrigin = 'anonymous';
	powerSymbol.src = fixUri('/img/frames/minimalist/p.svg');
	window.powerSymbol = powerSymbol; // Make it globally accessible
}

if (typeof powerSymbolLoaded === 'undefined') {
	let powerSymbolLoaded = false;
	window.powerSymbolLoaded = powerSymbolLoaded; // Make it globally accessible
}

if (typeof toughnessSymbol === 'undefined') {
	const toughnessSymbol = new Image();
	toughnessSymbol.crossOrigin = 'anonymous';
	toughnessSymbol.src = fixUri('/img/frames/minimalist/t.svg');
	window.toughnessSymbol = toughnessSymbol; // Make it globally accessible
}

if (typeof toughnessSymbolLoaded === 'undefined') {
	let toughnessSymbolLoaded = false;
	window.toughnessSymbolLoaded = toughnessSymbolLoaded; // Make it globally accessible
}

// Set up onload handlers only if not already set
if (!window.powerSymbol.onload) {
	window.powerSymbol.onload = () => {
		window.powerSymbolLoaded = true;
		drawCard();
	};
}

if (!window.toughnessSymbol.onload) {
	window.toughnessSymbol.onload = () => {
		window.toughnessSymbolLoaded = true;
		drawCard();
	};
}

//============================================================================
// UTILITY FUNCTIONS
//============================================================================

function hexToRgba(hex, alpha) {
	const cacheKey = `${hex}_${alpha}`;
	if (window.COLOR_CACHE.has(cacheKey)) {
		return window.COLOR_CACHE.get(cacheKey);
	}
	
	const rgb = hexToRgb(hex);
	const result = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
	
	// Limit cache size
	if (window.COLOR_CACHE.size > 100) {
		const firstKey = window.COLOR_CACHE.keys().next().value;
		window.COLOR_CACHE.delete(firstKey);
	}
	
	window.COLOR_CACHE.set(cacheKey, result);
	return result;
}

function getColorHex(colorName) {
	return window.COLOR_MAP[colorName] || '#FFFFFF';
}

function blendColors(hex1, hex2, ratio = 0.5) {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);
	
	const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
	const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
	const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
	
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Update card.colorIdentity based on the current mana cost and rules text
 * This ensures color identity stays in sync when manually typing
 * Includes mana symbols from both mana cost and rules text (like real Magic cards)
 */
function updateColorIdentityFromManaCost() {
	const seenColors = new Set();
	
	// Collect mana symbols from mana cost
	if (card.text?.mana?.text) {
		extractColorsFromText(card.text.mana.text, seenColors);
	}
	
	// Collect mana symbols from rules text
	if (card.text?.rules?.text) {
		extractColorsFromText(card.text.rules.text, seenColors);
	}
	
	// Update color identity with sorted array (WUBRG order)
	const wubrgOrder = ['W', 'U', 'B', 'R', 'G'];
	card.colorIdentity = wubrgOrder.filter(c => seenColors.has(c));
}

/**
 * Extract color identity from text containing mana symbols
 * @param {string} text - Text to scan for mana symbols
 * @param {Set} seenColors - Set to add found colors to
 */
function extractColorsFromText(text, seenColors) {
	if (!text) return;
	
	const manaMatches = text.match(/\{[^}]+\}/g);
	if (!manaMatches) return;
	
	for (const match of manaMatches) {
		const symbol = match.toLowerCase().replace(/[{}]/g, '');
		
		// Map mana symbols to color identity letters
		if (MANA_COLOR_MAP[symbol]) {
			// Single color symbol (w, u, b, r, g)
			seenColors.add(symbol.toUpperCase());
		} else if (symbol.includes('/')) {
			// Hybrid mana - add both colors
			const parts = symbol.split('/');
			for (const part of parts) {
				if (MANA_COLOR_MAP[part]) {
					seenColors.add(part.toUpperCase());
				}
			}
		} else if (symbol.includes('p')) {
			// Phyrexian mana (wp, up, bp, rp, gp)
			const colorPart = symbol.replace('p', '');
			if (MANA_COLOR_MAP[colorPart]) {
				seenColors.add(colorPart.toUpperCase());
			}
		}
	}
}

function getColorIdentityColors() {
	if (!card.colorIdentity || !Array.isArray(card.colorIdentity) || card.colorIdentity.length === 0) {
		return [];
	}
	
	const colors = [];
	const seenColors = new Set();
	
	for (const colorLetter of card.colorIdentity) {
		const colorKey = colorLetter.toLowerCase();
		if (window.MANA_COLOR_MAP[colorKey] && !seenColors.has(window.MANA_COLOR_MAP[colorKey])) {
			colors.push(window.MANA_COLOR_MAP[colorKey]);
			seenColors.add(window.MANA_COLOR_MAP[colorKey]);
		}
	}
	
	return colors;
}

function getColorIdentityHexColors() {
	return getColorIdentityColors().map(color => getColorHex(color));
}

/**
 * Get color(s) based on color identity
 * Returns an object with color array and convenience properties
 * @returns {object} - { colors: array, count: number, isEmpty: boolean, isSingle: boolean, isMulti: boolean }
 */
function getColorsForMode() {
	const colorArray = getColorIdentityColors();
	return {
		colors: colorArray,
		hexColors: colorArray.map(c => getColorHex(c)),
		count: colorArray.length,
		isEmpty: colorArray.length === 0,
		isSingle: colorArray.length === 1,
		isMulti: colorArray.length > 1
	};
}

/**
 * Get a single color for text/UI based on the color count
 * @param {object} colorInfo - Result from getColorsForMode()
 * @param {string} defaultColor - Default color if no colors found
 * @returns {string} - Hex color string
 */
function getSingleColorFromMode(colorInfo, defaultColor = null) {
	defaultColor = defaultColor || window.MINIMALIST_COLOR_DEFAULTS.white;
	if (colorInfo.isEmpty) return defaultColor;
	if (colorInfo.isSingle) return getColorHex(colorInfo.colors[0]);
	return window.MINIMALIST_COLOR_DEFAULTS.multicolor;
}

function getMinimalistSetting(settingName, defaultValue = true) {
	const element = getCachedElement(`minimalist-${settingName}`);
	return element?.checked ?? defaultValue;
}

function updateCardSettings(settingsKey, newSettings) {
	if (!card.minimalist[settingsKey]) {
		card.minimalist[settingsKey] = {};
	}
	card.minimalist[settingsKey] = { ...card.minimalist[settingsKey], ...newSettings };
}

function setUIDefaults() {
	const settingsMap = {
		'max-opacity': window.MINIMALIST_DEFAULTS.settings.maxOpacity, // Use window version
		'fade-bottom-offset': window.MINIMALIST_DEFAULTS.settings.fadeBottomOffset,
		'fade-top-offset': window.MINIMALIST_DEFAULTS.settings.fadeTopOffset,
		'bg-gradient-enabled': true,
		'divider-enabled': true,
		'pt-symbols-enabled': window.MINIMALIST_DEFAULTS.ptSettings.enabled,
		'pt-color-mode': window.MINIMALIST_DEFAULTS.ptSettings.colorMode,
		'pt-color-1': window.MINIMALIST_DEFAULTS.ptSettings.color1,
		'pt-color-2': window.MINIMALIST_DEFAULTS.ptSettings.color2,
		'type-auto-color-ci': window.MINIMALIST_DEFAULTS.typeSettings.autoColorCI,
		'type-color': window.MINIMALIST_DEFAULTS.typeSettings.customColor 
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

function debounce(func, wait, immediate = false) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			if (!immediate) func(...args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func(...args);
	};

}

//============================================================================
// TEXT MEASUREMENT AND POSITIONING
//============================================================================

function measureTextHeight(text, ctx, width, fontSize) {
	if (!text) return 0;
	
	// Create more specific cache key
	const textHash = text.length > 100 ? 
		`${text.substring(0, 50)}_${text.substring(text.length - 50)}_${text.length}` : 
		text;
	const cacheKey = `${textHash}_${width}_${fontSize}`;
	
	if (card.minimalist.textCache && card.minimalist.textCache[cacheKey]) {
		return card.minimalist.textCache[cacheKey];
	}
	
	// Pre-calculate line height
	const lineHeight = fontSize * 1.2;
	const paragraphs = text.split('\n');
	let totalLines = 0;
	
	// Reuse measurement context properties
	ctx.font = `${fontSize}px "${card.text.rules?.font || 'Arial'}"`;
	
	for (const paragraph of paragraphs) {
		if (!paragraph.trim()) {
			totalLines++;
			continue;
		}
		
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
	
	const result = totalLines * lineHeight;
	
	// Limit cache size and manage memory
	if (!card.minimalist.textCache) card.minimalist.textCache = {};
	if (Object.keys(card.minimalist.textCache).length > 50) {
		// Remove oldest entries
		const keys = Object.keys(card.minimalist.textCache);
		keys.slice(0, 25).forEach(key => delete card.minimalist.textCache[key]);
	}
	
	card.minimalist.textCache[cacheKey] = result;
	return result;
}

function measureTextWidth(text, textObj) {
	if (!text) return 0;
	
	const dims = getCardDimensions();
	const ctx = textContext || card.minimalist.ctx;
	
	// Save current context state
	ctx.save();
	
	// Set font properties to match the text object exactly
	const fontSize = textObj.size * dims.height;
	const fontFamily = textObj.font || 'Arial';
	ctx.font = `${fontSize}px "${fontFamily}"`;
	
	// Apply any text styling that might affect width
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';
	
	// Measure the text
	const metrics = ctx.measureText(text);
	const width = metrics.width;
	
	// Restore context state
	ctx.restore();
	
	return width;
}

/**
 * Calculate the proper box height for rules text based on actual text content
 * @param {string} text - The rules text to measure
 * @returns {number} - The calculated height as a fraction of card height (0-1)
 */
function calculateRulesBoxHeight(text) {
	if (!text || !card.text.rules) return card.minimalist.minHeight;
	
	const dims = getCardDimensions();
	const ctx = card.minimalist.ctx;
	
	// Set up the context with the current font
	ctx.clearRect(0, 0, dims.width, dims.height);
	ctx.font = `${card.text.rules.size * dims.height}px "${card.text.rules.font}"`;
	
	// Measure the actual text height
	const actualTextHeight = measureTextHeight(
		text,
		ctx,
		card.text.rules.width * dims.width,
		card.text.rules.size * dims.height
	);
	
	// Calculate and clamp the height
	const newHeight = Math.min(
		card.minimalist.maxHeight,
		Math.max(
			card.minimalist.minHeight,
			(actualTextHeight / dims.height)
		)
	);
	
	return newHeight;
}

//============================================================================
// TEXT PIXEL SCANNING
//============================================================================

function findFirstTextPixel() {
	// Scan the text canvas to find the first rendered pixel of rules text
	if (!textCanvas) {
		return null;
	}
	
	if (!card.text.rules) {
		return null;
	}
	
	if (!card.text.rules.text || card.text.rules.text.trim() === '') {
		return null;
	}
	
	const dims = getCardDimensions();
	const rulesY = card.text.rules.y * dims.height;
	const rulesHeight = card.text.rules.height * dims.height;
	const rulesX = card.text.rules.x * dims.width;
	const rulesWidth = card.text.rules.width * dims.width;
	
	// Get image data from the text canvas in the rules text area
	const ctx = textContext;
	const startY = Math.floor(rulesY);
	const endY = Math.floor(rulesY + rulesHeight);
	const startX = Math.floor(rulesX);
	const width = Math.floor(rulesWidth);
	
	let firstTextY = null;
	let lastTextY = null;
	let pixelsChecked = 0;
	
	// Scan line by line from top to bottom to find first and last text pixels
	for (let y = startY; y < endY; y++) {
		const imageData = ctx.getImageData(startX, y, width, 1);
		const data = imageData.data;
		
		// Check if any pixel in this row has non-zero alpha (is visible)
		let hasTextInRow = false;
		for (let i = 3; i < data.length; i += 4) {
			pixelsChecked++;
			if (data[i] > 0) {
				hasTextInRow = true;
				break;
			}
		}
		
		if (hasTextInRow) {
			if (firstTextY === null) {
				firstTextY = y;
			}
			lastTextY = y;
		}
	}
	
	if (firstTextY === null || lastTextY === null) {
		return card.text.rules.y;
	}
	
	// Calculate text height for logging
	const textHeightPixels = lastTextY - firstTextY;
	
	// Just use the first pixel position directly
	const normalizedTop = firstTextY / dims.height;
	
	return normalizedTop;
}

function updateRulesTextBox(rulesHeight) {
	// Calculate and update only the rules text box position and height
	const dividerToBaseGap = 0.005; // Gap between divider and top of rules box
	const rulesY = card.minimalist.baseY - rulesHeight - dividerToBaseGap;
	
	// Update the rules text position
	if (card.text.rules) {
		card.text.rules.y = rulesY;
		card.text.rules.height = rulesHeight;
	}
	
	// Update background gradient based on new rules position
	updateBackgroundGradient(card.text.mana?.y || 0.5, rulesY);
	
	return { rulesY, dividerToBaseGap };
}

function updateCardLayout(rulesY, dividerToBaseGap) {
	// Position all card elements relative to the rules text box
	// This keeps the layout consistent regardless of rules text length
	
	// Position divider at a fixed gap above the rules box
	const dividerY = rulesY - dividerToBaseGap;
	
	// Position type line above the divider
	const typeToDividerGap = 0.050;
	const typeY = dividerY - typeToDividerGap;
	
	// Position title above type line
	const titleY = typeY - (card.minimalist.spacing * 0.65);
	
	// Position mana cost above title
	const manaY = titleY - (card.minimalist.spacing * 0.6);
	
	// Position set symbol above divider
	const setSymbolOffsetAboveDivider = 0.030;
	const setSymbolY = dividerY - setSymbolOffsetAboveDivider;

	// Store divider position for use in drawing functions
	card.minimalist.dividerY = dividerY;

	// Update text element positions
	if (card.text.type) {
		card.text.type.y = typeY;
		card.text.type.x = 0.090;
	}
	if (card.text.title) {
		card.text.title.y = titleY;
		card.text.title.x = 0.090;
	}
	if (card.text.mana) {
		card.text.mana.y = manaY;
		card.text.mana.x = 0.090;
	}
	
	// Update set symbol position
	if (card.setSymbolBounds) {
		card.setSymbolBounds.y = setSymbolY;
		resetSetSymbol();
	}

	// Update background gradient with new mana position
	updateBackgroundGradient(manaY, rulesY);
	
	// Update divider
	const dividerEnabled = getMinimalistSetting('divider-enabled');
	if (dividerEnabled) {
		drawDividerGradient();
	}
	
	return { dividerY, typeY, titleY, manaY, setSymbolY };
}

function updateDividerAndAbove(dividerY) {
	// Updates only the divider and elements above it
	// Does NOT touch the rules text box position
	// This maintains consistent divider-to-text gap regardless of box size
	
	// Position type line above the divider
	const typeToDividerGap = 0.042;
	const typeY = dividerY - typeToDividerGap;
	
	// Position title above type line
	const titleY = typeY - (card.minimalist.spacing * 0.62);
	
	// Position mana cost above title
	const manaY = titleY - (card.minimalist.spacing * 0.55);
	
	// Position set symbol above divider
	const setSymbolOffsetAboveDivider = 0.028;
	const setSymbolY = dividerY - setSymbolOffsetAboveDivider;

	// Store divider position for use in drawing functions
	card.minimalist.dividerY = dividerY;

	// Update text element positions (but not rules!)
	if (card.text.type) {
		card.text.type.y = typeY;
		card.text.type.x = 0.090;
	}
	if (card.text.title) {
		card.text.title.y = titleY;
		card.text.title.x = 0.090;
	}
	if (card.text.mana) {
		card.text.mana.y = manaY;
		card.text.mana.x = 0.090;
	}
	
	// Update set symbol position
	if (card.setSymbolBounds) {
		card.setSymbolBounds.y = setSymbolY;
		resetSetSymbol();
	}

	// Update background gradient with new positions
	// Keep rules position stable
	const rulesY = card.text.rules ? card.text.rules.y : card.minimalist.baseY - card.minimalist.currentHeight;
	updateBackgroundGradient(manaY, rulesY);
	
	return { dividerY, typeY, titleY, manaY, setSymbolY };
}

async function updateTextPositions(rulesHeight, skipDrawCard = false) {
	// PHASE 1: Position rules text box and all other elements
	const { rulesY, dividerToBaseGap } = updateRulesTextBox(rulesHeight);
	
	// Position all card elements relative to rules box first
	updateCardLayout(rulesY, dividerToBaseGap);
	
	// Update the background gradient
	updateBackgroundGradient(card.text.mana?.y || 0.5, rulesY);
	
	// PHASE 2: Draw the text so it renders on the canvas
	await drawText();
	
	// PHASE 3: Scan the actual rendered text to find where text pixels actually appear
	const actualTextTopY = findFirstTextPixel();
	
	if (actualTextTopY !== null && card.text.rules) {
		// Calculate the gap from divider to actual visible text
		// The divider should be a fixed distance above where text actually appears
		const desiredDividerGap = 0.01; // Gap from divider to actual first text pixel
		const dividerY = actualTextTopY - desiredDividerGap;
		
		// Only update divider position and elements above it
		// DO NOT reposition the rules text box - keep it stable
		updateDividerAndAbove(dividerY);
		
		// Redraw text at new positions (type, title, mana moved)
		await drawText();
		
		// Redraw the divider and card with new positions
		drawDividerGradient();
		if (!skipDrawCard) {
			drawCard();
		}
	} else {
		// Fallback: if scan fails, use the standard positioning
		drawDividerGradient();
		if (!skipDrawCard) {
			drawCard();
		}
	}
	
	return rulesY;
}



//============================================================================
// GRADIENT AND VISUAL EFFECTS
//============================================================================

function createGradientForColors(context, x, y, width, colorsToUse, colorCount) {
	const gradient = context.createLinearGradient(x, 0, x + width, 0);
	
	if (colorCount === 0) {
		const colorless = window.MINIMALIST_COLOR_DEFAULTS.colorless;
		gradient.addColorStop(0, hexToRgba(colorless, 0.5));
		gradient.addColorStop(0.25, hexToRgba(colorless, 1));
		gradient.addColorStop(0.75, hexToRgba(colorless, 1));
		gradient.addColorStop(1, hexToRgba(colorless, 0.5));
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
		const multicolor = window.MINIMALIST_COLOR_DEFAULTS.multicolor;
		gradient.addColorStop(0, hexToRgba(multicolor, 0.5));
		gradient.addColorStop(0.25, hexToRgba(multicolor, 1));
		gradient.addColorStop(0.75, hexToRgba(multicolor, 1));
		gradient.addColorStop(1, hexToRgba(multicolor, 0.5));
	}
	
	return gradient;
}

function drawDividerGradient() {
	if (!card.text.rules || !card.text.type || card.version !== 'Minimalist') {
		return;
	}
	
	// Initialize canvas only once with optimizations
	if (!card.dividerCanvas) {
		const dims = getCardDimensions();
		card.dividerCanvas = document.createElement('canvas');
		card.dividerCanvas.width = dims.width;
		card.dividerCanvas.height = dims.height;
		card.dividerContext = card.dividerCanvas.getContext('2d');
		
		// Set context properties once for better performance
		card.dividerContext.imageSmoothingEnabled = true;
		card.dividerContext.imageSmoothingQuality = 'high';
	}
	
	// Clear and draw in one operation
	const ctx = card.dividerContext;
	const dims = getCardDimensions();
	ctx.clearRect(0, 0, dims.width, dims.height);
	
	const dividerEnabled = getMinimalistSetting('divider-enabled');
	
	// Batch drawing operations
	if (dividerEnabled) {
		const { colorsToUse, colorCount } = getDividerColors();
		drawDividerBar(colorsToUse, colorCount);
	}
	
	drawPTSymbols();
}

function getDividerColors() {
	let colorsToUse = [];
	let colorCount = 0;
	
	if (card.minimalist.dividerSettings && card.minimalist.dividerSettings.colorCount !== 'ci-auto') {
		colorCount = parseInt(card.minimalist.dividerSettings.colorCount);
		const customColors = [
			card.minimalist.dividerSettings.color1,
			card.minimalist.dividerSettings.color2,
			card.minimalist.dividerSettings.color3
		];
		colorsToUse = customColors.slice(0, colorCount);
	} else {
		colorsToUse = getColorIdentityHexColors();
		colorCount = colorsToUse.length;
	}
	
	return { colorsToUse, colorCount };
}

function drawDividerBar(colorsToUse, colorCount) {
	const rulesX = 0.086;
	const rulesWidth = 0.831;
	
	// Use the divider position calculated in updateTextPositions based on text scan
	// Fallback to type line position if not set yet
	const dividerY = card.minimalist.dividerY || (card.text.type.y + 0.050);
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
	const dims = getCardDimensions();
	
	// Symbol sizes
	const powerSymbolWidth = 74;
	const powerSymbolHeight = 130;
	const toughnessSymbolWidth = 75;
	const toughnessSymbolHeight = 130;
	
	// Separate spacing controls for each gap
	const toughnessTextToSymbolSpacing = -45; // pixels between toughness text and toughness symbol
	const toughnessSymbolToPowerTextSpacing = 135; // pixels between toughness symbol and power text
	const powerTextToSymbolSpacing = -45; // pixels between power text and power symbol
	
	// Vertical offset adjustment for symbol alignment (positive = move down, negative = move up)
	const symbolVerticalOffset = 30; // Adjust this value to fine-tune vertical alignment
	
	// Step 1: Keep toughness at pack's fixed position
	const toughnessTextCenterX = card.text.toughness.x * dims.width;
	const toughnessTextY = card.text.toughness.y * dims.height;
	
	// Step 2: Calculate the actual left edge of toughness text (since it's centered)
	const toughnessTextWidth = measureTextWidth(card.text.toughness.text, card.text.toughness);
	const toughnessTextLeftEdge = toughnessTextCenterX - (toughnessTextWidth / 2);
	
	// Position toughness symbol with its own spacing
	const toughnessSymbolX = toughnessTextLeftEdge - toughnessTextToSymbolSpacing;
	const toughnessSymbolY = toughnessTextY - (toughnessSymbolHeight / 2) + (card.text.toughness.size * dims.height / 2) + symbolVerticalOffset;
	
	// Step 3: Position power text with its own spacing from toughness symbol
	const powerTextWidth = measureTextWidth(card.text.power.text, card.text.power);
	const powerTextCenterX = toughnessSymbolX - toughnessSymbolToPowerTextSpacing - (powerTextWidth / 2);
	
	// Step 4: Position power symbol with its own spacing from power text
	const powerTextLeftEdge = powerTextCenterX - (powerTextWidth / 2);
	const powerSymbolX = powerTextLeftEdge - powerTextToSymbolSpacing;
	const powerSymbolY = toughnessTextY - (powerSymbolHeight / 2) + (card.text.power.size * dims.height / 2) + symbolVerticalOffset;
	
	// Update the power text position to align with symbols
	if (hasPower) {
		card.text.power.x = powerTextCenterX / dims.width;
		card.text.power.y = card.text.toughness.y; // Use same Y as toughness
	}
	
	// Draw symbols at calculated positions
	if (hasPower && window.powerSymbolLoaded) {
		drawColoredSymbolAtPosition(window.powerSymbol, powerColor, powerSymbolWidth, powerSymbolHeight, powerSymbolX, powerSymbolY);
	}
	if (hasToughness && window.toughnessSymbolLoaded) {
		drawColoredSymbolAtPosition(window.toughnessSymbol, toughnessColor, toughnessSymbolWidth, toughnessSymbolHeight, toughnessSymbolX, toughnessSymbolY);
	}
}

function getPTColors() {
	const colorMode = card.minimalist.ptSettings?.colorMode ?? 'ci-auto';
	let powerColor, toughnessColor;

	if (colorMode === 'ci-auto') {
		const colorInfo = getColorsForMode();
		
		if (colorInfo.isEmpty) {
			powerColor = toughnessColor = window.MINIMALIST_COLOR_DEFAULTS.colorless;
		} else if (colorInfo.isSingle) {
			powerColor = toughnessColor = getColorHex(colorInfo.colors[0]);
		} else if (colorInfo.count === 2) {
			powerColor = getColorHex(colorInfo.colors[0]);
			toughnessColor = getColorHex(colorInfo.colors[1]);
		} else {
			powerColor = toughnessColor = window.MINIMALIST_COLOR_DEFAULTS.multicolor;
		}
	} else if (colorMode === '1') {
		powerColor = toughnessColor = card.minimalist.ptSettings.color1;
	} else {
		powerColor = card.minimalist.ptSettings.color1;
		toughnessColor = card.minimalist.ptSettings.color2;
	}

	return { powerColor, toughnessColor };
}

function drawColoredSymbolAtPosition(symbol, color, symbolWidth, symbolHeight, x, y) {
	// Reuse temp canvas if possible
	if (!card.minimalist._tempCanvas) {
		card.minimalist._tempCanvas = document.createElement('canvas');
		card.minimalist._tempCtx = card.minimalist._tempCanvas.getContext('2d');
	}
	
	const tempCanvas = card.minimalist._tempCanvas;
	const tempCtx = card.minimalist._tempCtx;
	
	// Only resize if necessary
	if (tempCanvas.width !== symbolWidth || tempCanvas.height !== symbolHeight) {
		tempCanvas.width = symbolWidth;
		tempCanvas.height = symbolHeight;
	}
	
	tempCtx.clearRect(0, 0, symbolWidth, symbolHeight);
	tempCtx.drawImage(symbol, 0, 0, symbolWidth, symbolHeight);
	tempCtx.globalCompositeOperation = 'source-in';
	tempCtx.fillStyle = color;
	tempCtx.fillRect(0, 0, symbolWidth, symbolHeight);
	tempCtx.globalCompositeOperation = 'source-over'; // Reset
	
	card.dividerContext.drawImage(tempCanvas, x, y);
}

/**
 * Create color preset swatches for quick color selection
 * @param {string} inputId - ID of the color input to update
 * @param {function} updateFunction - Function to call when color is selected
 */
function createColorPresets(inputId, updateFunction) {
	const presets = [
		{ name: 'White', color: '#FFFFFF' },
		{ name: 'Blue', color: '#26C7FE' },
		{ name: 'Black', color: '#B264FF' },
		{ name: 'Red', color: '#F13F35' },
		{ name: 'Green', color: '#29EEA6' },
		{ name: 'Multi', color: '#e3d193' },
		{ name: 'Land', color: '#ae9787' },
		{ name: 'Colorless', color: '#CBC2C0' },
		{ name: 'Artifact', color: '#bff7f8' },
		{ name: 'Pure Black', color: '#000000' },
		{ name: 'Pure White', color: '#FFFFFF' }
	];
	
	const container = document.createElement('div');
	container.className = 'color-presets';
	container.style.cssText = 'display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px; padding: 5px 0;';
	
	presets.forEach(preset => {
		const swatch = document.createElement('button');
		swatch.className = 'color-preset-swatch';
		swatch.title = preset.name;
		swatch.style.cssText = `
			width: 24px;
			height: 24px;
			border: 2px solid rgba(255,255,255,0.3);
			border-radius: 4px;
			cursor: pointer;
			background-color: ${preset.color};
			padding: 0;
			transition: transform 0.1s, border-color 0.1s;
		`;
		
		swatch.addEventListener('mouseenter', () => {
			swatch.style.transform = 'scale(1.1)';
			swatch.style.borderColor = 'rgba(255,255,255,0.8)';
		});
		
		swatch.addEventListener('mouseleave', () => {
			swatch.style.transform = 'scale(1)';
			swatch.style.borderColor = 'rgba(255,255,255,0.3)';
		});
		
		swatch.addEventListener('click', (e) => {
			e.preventDefault();
			const input = document.getElementById(inputId);
			if (input) {
				input.value = preset.color;
				updateFunction();
			}
		});
		
		container.appendChild(swatch);
	});
	
	return container;
}

function toggleColorVisibility(type) {
	const config = {
		bg: {
			countElement: 'minimalist-bg-color-count',
			containers: ['bg-color-1-container', 'bg-color-2-container', 'bg-color-3-container'],
			ciAutoValue: 'ci-auto'
		},
		divider: {
			countElement: 'minimalist-color-count',
			containers: ['divider-color-1-container', 'divider-color-2-container', 'divider-color-3-container'],
			ciAutoValue: 'ci-auto'
		},
		pt: {
			countElement: 'minimalist-pt-color-mode',
			containers: ['pt-color-1-container', 'pt-color-2-container'],
			ciAutoValue: 'ci-auto'
		},
		type: {
			checkboxElementCI: 'minimalist-type-auto-color-ci',
			containers: ['type-color-container']
		}
	};

	const settings = config[type];
	if (!settings) return;

	// Handle type color (checkbox-based) differently
	if (type === 'type') {
		const autoColorCICheckbox = document.getElementById(settings.checkboxElementCI);
		const container = document.getElementById(settings.containers[0]);
		const colorInput = document.getElementById('minimalist-type-color');
		
		if (autoColorCICheckbox && container) {
			// If checkbox is checked, hide the custom color input
			const isAutoChecked = autoColorCICheckbox.checked;
			
			// Use flex display instead of block to maintain the layout
			container.style.display = isAutoChecked ? 'none' : 'flex';
			
			// ALWAYS keep the color input enabled, just hide/show the container
			if (colorInput) {
				colorInput.disabled = false;
			}
		}
		return;
	}

	// Handle dropdown-based visibility
	const countElement = document.getElementById(settings.countElement);
	const selectedValue = countElement.value;

	// Hide all containers first
	settings.containers.forEach(containerId => {
		const container = document.getElementById(containerId);
		if (container) container.style.display = 'none';
	});

	// Show appropriate containers based on selection
	if (selectedValue === settings.ciAutoValue) {
		return;
	}

	const numColors = parseInt(selectedValue) || 0;
	for (let i = 0; i < Math.min(numColors, settings.containers.length); i++) {
		const container = document.getElementById(settings.containers[i]);
		if (container) container.style.display = 'block';
	}
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
	
	// Add color presets to all color inputs after the UI is created
	setTimeout(() => {
		// Background gradient colors
		const bgColor1 = document.getElementById('minimalist-bg-color-1');
		const bgColor2 = document.getElementById('minimalist-bg-color-2');
		const bgColor3 = document.getElementById('minimalist-bg-color-3');
		
		if (bgColor1?.parentElement) {
			bgColor1.parentElement.appendChild(createColorPresets('minimalist-bg-color-1', updateMinimalistGradient));
		}
		if (bgColor2?.parentElement) {
			bgColor2.parentElement.appendChild(createColorPresets('minimalist-bg-color-2', updateMinimalistGradient));
		}
		if (bgColor3?.parentElement) {
			bgColor3.parentElement.appendChild(createColorPresets('minimalist-bg-color-3', updateMinimalistGradient));
		}
		
		// Type line color
		const typeColor = document.getElementById('minimalist-type-color');
		if (typeColor?.parentElement?.parentElement) {
			typeColor.parentElement.parentElement.appendChild(createColorPresets('minimalist-type-color', window.updateTypeLineColor));
		}
		
		// Divider colors
		const divColor1 = document.getElementById('minimalist-color-1');
		const divColor2 = document.getElementById('minimalist-color-2');
		const divColor3 = document.getElementById('minimalist-color-3');
		
		if (divColor1?.parentElement) {
			divColor1.parentElement.appendChild(createColorPresets('minimalist-color-1', updateDividerColors));
		}
		if (divColor2?.parentElement) {
			divColor2.parentElement.appendChild(createColorPresets('minimalist-color-2', updateDividerColors));
		}
		if (divColor3?.parentElement) {
			divColor3.parentElement.appendChild(createColorPresets('minimalist-color-3', updateDividerColors));
		}
		
		// P/T symbol colors
		const ptColor1 = document.getElementById('minimalist-pt-color-1');
		const ptColor2 = document.getElementById('minimalist-pt-color-2');
		
		if (ptColor1?.parentElement) {
			ptColor1.parentElement.appendChild(createColorPresets('minimalist-pt-color-1', updatePTSymbols));
		}
		if (ptColor2?.parentElement) {
			ptColor2.parentElement.appendChild(createColorPresets('minimalist-pt-color-2', updatePTSymbols));
		}
	}, 100); // Small delay to ensure DOM is ready
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

	<div style="display: flex; gap: 10px; margin-bottom: 10px;">
		<div style="flex: 1;">
			<h5 class='padding input-description'>Min Rules Height:</h5>
			<div class='padding input-grid'>
				<input id='minimalist-min-rules-height' type='number' class='input' oninput='updateMinimalistMinHeight();' min='0.05' max='0.5' step='0.01' value='0.1'>
			</div>
		</div>
		<div style="flex: 1;">
			<h5 class='padding input-description'>Max Rules Height:</h5>
			<div class='padding input-grid'>
				<input id='minimalist-max-rules-height' type='number' class='input' oninput='updateMinimalistMaxHeight();' min='0.1' max='0.8' step='0.01' value='0.25'>
			</div>
		</div>
		<div style="flex: 1;">
			<h5 class='padding input-description'>Max Opacity:</h5>
			<div class='padding input-grid'>
				<input id='minimalist-max-opacity' type='number' class='input' oninput='updateMinimalistGradient();' min='0' max='1' step='0.01' value='0.95'>
			</div>
		</div>
		<div style="flex: 1;">
			<h5 class='padding input-description'>Fade Start:</h5>
			<div class='padding input-grid'>
				<input id='minimalist-fade-bottom-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.2' max='0.2' step='0.01' value='-0.05'>
			</div>
		</div>
		<div style="flex: 1;">
			<h5 class='padding input-description'>Fade End:</h5>
			<div class='padding input-grid'>
				<input id='minimalist-fade-top-offset' type='number' class='input' oninput='updateMinimalistGradient();' min='-0.5' max='0' step='0.01' value='-0.15'>
			</div>
		</div>
	</div>

	<div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

	<h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Background Gradient Colors</h5>

	<h5 class='padding input-description'>Background Colors:</h5>
	<div class='padding input-grid margin-bottom'>
		<select id='minimalist-bg-color-count' class='input' onchange='updateMinimalistGradient(); toggleColorVisibility("bg");'>
			<option value='1' selected>1 Color</option>
			<option value='ci-auto'>Auto (Color Identity)</option>
			<option value='2'>2 Colors</option>
			<option value='3'>3 Colors</option>
		</select>
	</div> 

	<div style="position: relative; min-height: 60px;">
		<div id='bg-colors-wrapper' style='display: flex; gap: 10px;'>
			<div id='bg-color-1-container' style='display: block; flex: 1;'>
				<h5 class='padding input-description'>Color 1:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-bg-color-1' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
				</div>
			</div>

			<div id='bg-color-2-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 2:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-bg-color-2' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
				</div>
			</div>

			<div id='bg-color-3-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 3:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-bg-color-3' type='color' class='input' oninput='updateMinimalistGradient();' value='#000000'>
				</div>
			</div>
		</div>
	</div>

	<div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

	<h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Type Line Color</h5>

	<div style="display: flex; gap: 10px; margin-bottom: 10px;">
		<div style="flex: 1;">
			<h5 class='input-description margin-bottom'>Auto Type Line Color</h5>
			<label class='checkbox-container input margin-bottom'>Auto Color (from color identity)
				<input id='minimalist-type-auto-color-ci' type='checkbox' class='input' onchange='window.updateTypeLineColor(); toggleColorVisibility("type");' checked>
				<span class='checkmark'></span>
			</label>
		</div>

		<div id='type-color-container' style='display: none; flex: 1; display: flex; flex-direction: column;'>
			<h5 class='input-description' style="margin-bottom: 5px;">Type Line Color:</h5>
			<div style='flex: 1; display: flex; align-items: stretch;'>
				<input id='minimalist-type-color' type='color' class='input' oninput='window.updateTypeLineColor();' value='#FFFFFF' style='height: 100%;'>
			</div>
		</div>
	</div>

	<div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 5px 0;"></div>

	<h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">Divider Bar</h5>

	<div style="display: flex; gap: 10px; margin-bottom: 10px;">
		<div style="flex: 1;">
			<div style="height: 0px;"></div>
			<h5 class='input-description' style="margin-bottom: 5px;">Divider Toggle:</h5>
			<label class='checkbox-container input'>Toggle Divider Bar
				<input id='minimalist-divider-enabled' type='checkbox' class='input' onchange='updateDividerColors();' checked>
				<span class='checkmark'></span>
			</label>
		</div>
		<div style="flex: 1;">
			<h5 class='input-description' style="margin-bottom: 5px;">Divider Colors:</h5>
			<select id='minimalist-color-count' class='input' onchange='updateDividerColors(); toggleColorVisibility("divider");'>
				<option value='ci-auto' selected>Auto (Color Identity)</option>
				<option value='1'>1 Color</option>
				<option value='2'>2 Colors</option>
				<option value='3'>3 Colors</option>
			</select>
		</div>
	</div>

	<div style="position: relative; min-height: 5px;">
		<div id='divider-colors-wrapper' style='display: flex; gap: 10px;'>
			<div id='divider-color-1-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 1:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-color-1' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
				</div>
			</div>

			<div id='divider-color-2-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 2:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-color-2' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
				</div>
			</div>

			<div id='divider-color-3-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 3:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-color-3' type='color' class='input' oninput='updateDividerColors();' value='#FFFFFF'>
				</div>
			</div>
		</div>
	</div>

	<div style="height: 2px; background-color: rgba(255,255,255,0.1); margin: 10px 0;"></div>

	<h5 class='padding margin-bottom input-description' style="font-size: 1.5em; font-weight: bold;">P/T Symbols</h5>

	<div style="display: flex; gap: 10px; margin-bottom: 10px;">
		<div style="flex: 1;">
			<div style="height: 0px;"></div>
			<h5 class='input-description' style="margin-bottom: 5px;">Toggle P/T Symbols:</h5>
			<label class='checkbox-container input'>Toggle P/T Symbols
				<input id='minimalist-pt-symbols-enabled' type='checkbox' class='input' onchange='updatePTSymbols();' checked>
				<span class='checkmark'></span>
			</label>
		</div>
		<div style="flex: 1;">
			<h5 class='input-description' style="margin-bottom: 5px;">Symbol Colors:</h5>
			<select id='minimalist-pt-color-mode' class='input' onchange='updatePTSymbols(); toggleColorVisibility("pt");'>
				<option value='ci-auto' selected>Auto (Color Identity)</option>
				<option value='1'>1 Color</option>
				<option value='2'>2 Colors</option>
			</select>
		</div>
	</div>

	<div style="position: relative; min-height: 5px;">
		<div id='pt-colors-wrapper' style='display: flex; gap: 10px;'>
			<div id='pt-color-1-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 1:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-pt-color-1' type='color' class='input' oninput='updatePTSymbols();' value='#FFFFFF'>
				</div>
			</div>

			<div id='pt-color-2-container' style='display: none; flex: 1;'>
				<h5 class='padding input-description'>Color 2:</h5>
				<div class='padding input-grid margin-bottom'>
					<input id='minimalist-pt-color-2' type='color' class='input' oninput='updatePTSymbols();' value='#FFFFFF'>
				</div>
			</div>
		</div>
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

function updateMinimalistVisuals(options = {}) {
	if (card.version !== 'Minimalist') return;
	
	const {
		includeTextPositions = false,
		includeDivider = true,
		includeText = true,
		includeBackground = false,
		skipDrawCard = false  // Allow caller to skip final drawCard if they'll call it themselves
	} = options;
	
	// Cancel any pending update to avoid redundant redraws
	if (card.minimalist._pendingUpdate) {
		cancelAnimationFrame(card.minimalist._pendingUpdate);
	}
	
	card.minimalist._pendingUpdate = requestAnimationFrame(async () => {
		card.minimalist._pendingUpdate = null;
		
		// Update text positions if needed - this now handles its own text rendering internally
		if (includeTextPositions || (includeBackground && card.text.rules)) {
			await updateTextPositions(card.minimalist.currentHeight);
			// updateTextPositions calls drawCard internally, so we're done
			return;
		}
		
		// Otherwise handle the other updates manually
		if (includeText) {
			textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
			drawTextBuffer();
		}
		
		if (includeDivider) {
			drawDividerGradient(); // This includes P/T symbols
		}
		
		// Only call drawCard once at the end, unless caller will handle it
		if (!skipDrawCard) {
			drawCard();
		}
	});
}

function updateMinimalistGradient() {
	if (card.version === 'Minimalist' && card.gradientOptions) {
		const maxOpacity = parseFloat(getCachedElement('minimalist-max-opacity').value);
		const fadeBottomOffset = parseFloat(getCachedElement('minimalist-fade-bottom-offset').value);
		const fadeTopOffset = parseFloat(getCachedElement('minimalist-fade-top-offset').value);
		const bgColor1 = getCachedElement('minimalist-bg-color-1').value;
		const bgColor2 = getCachedElement('minimalist-bg-color-2').value;
		const bgColor3 = getCachedElement('minimalist-bg-color-3').value;
		const bgColorCount = getCachedElement('minimalist-bg-color-count').value;
		
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
		
		updateMinimalistVisuals({ includeBackground: true });
	}
}

function updateMinimalistMinHeight() {
	if (card.version === 'Minimalist' && card.minimalist) {
		const minHeightInput = getCachedElement('minimalist-min-rules-height');
		let minHeight = parseFloat(minHeightInput.value);
		const maxHeight = card.minimalist.maxHeight;
		
		// Ensure min doesn't exceed max
		if (minHeight > maxHeight) {
			minHeight = maxHeight;
			minHeightInput.value = maxHeight;
		}
		
		card.minimalist.minHeight = minHeight;
		
		// Update the max attribute of the input
		minHeightInput.max = maxHeight;
		
		// Recalculate text positions with new minimum height
		const rulesText = card.text.rules?.text || '';
		const rulesHeight = calculateRulesBoxHeight(rulesText);
		updateTextPositions(rulesHeight);
	}
}

function updateMinimalistMaxHeight() {
	if (card.version === 'Minimalist' && card.minimalist) {
		const maxHeightInput = getCachedElement('minimalist-max-rules-height');
		let maxHeight = parseFloat(maxHeightInput.value);
		const minHeight = card.minimalist.minHeight;
		
		// Ensure max doesn't go below min
		if (maxHeight < minHeight) {
			maxHeight = minHeight;
			maxHeightInput.value = minHeight;
		}
		
		card.minimalist.maxHeight = maxHeight;
		
		// Update the min attribute of the input
		maxHeightInput.min = minHeight;
		
		// Recalculate text positions with new maximum height
		const rulesText = card.text.rules?.text || '';
		const rulesHeight = calculateRulesBoxHeight(rulesText);
		updateTextPositions(rulesHeight);
	}
}

function updateBackgroundGradient(manaY, rulesY) {
	if (!card.gradientOptions) return;
	
	const bgGradientEnabled = getMinimalistSetting('bg-gradient-enabled');
	
	if (bgGradientEnabled) {
		const settings = card.minimalist.settings || MINIMALIST_DEFAULTS.settings;
		
		let backgroundColors = [];
		if (settings.bgColorCount === 'ci-auto') {
			backgroundColors = getColorIdentityHexColors();
			if (backgroundColors.length === 0) {
				backgroundColors = [window.MINIMALIST_COLOR_DEFAULTS.artifact];
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

function updateDividerColors() {
	if (card.version === 'Minimalist') {
		const colorCountElement = getCachedElement('minimalist-color-count');
		const colorCount = colorCountElement?.value;
		
		// Don't update if we don't have a valid value from the UI yet
		if (!colorCount) {
			return;
		}
		
		const color1 = getCachedElement('minimalist-color-1').value;
		const color2 = getCachedElement('minimalist-color-2').value;
		const color3 = getCachedElement('minimalist-color-3').value;
		
		updateCardSettings('dividerSettings', { color1, color2, color3, colorCount });
		updateMinimalistVisuals({ includeDivider: true, includeText: false });
	}
}

function updatePTSymbols() {
	if (card.version === 'Minimalist') {
		const enabled = getCachedElement('minimalist-pt-symbols-enabled').checked;
		const colorMode = getCachedElement('minimalist-pt-color-mode').value;
		const color1 = getCachedElement('minimalist-pt-color-1').value;
		const color2 = getCachedElement('minimalist-pt-color-2').value;
		
		updateCardSettings('ptSettings', { enabled, colorMode, color1, color2 });
		updateMinimalistVisuals({ includeDivider: true, includeText: false });
	}
}

function updateTypeLineColor() {
	if (card.version === 'Minimalist' && card.text.type) {
		const autoColorCIElement = getCachedElement('minimalist-type-auto-color-ci');
		const typeColorInput = getCachedElement('minimalist-type-color');
		
		if (!autoColorCIElement || !typeColorInput) {
			return;
		}
		
		const autoColorCI = autoColorCIElement.checked;
		let newColor;
		
		typeColorInput.disabled = false; // Always enable the input
		
		if (autoColorCI) {
			// Use color identity
			const colorInfo = getColorsForMode();
			newColor = getSingleColorFromMode(colorInfo);
			typeColorInput.value = newColor;
		} else {
			// Use custom color
			newColor = typeColorInput.value;
		}
		
		card.text.type.color = newColor;
		
		updateCardSettings('typeSettings', { 
			autoColorCI: autoColorCI,
			customColor: typeColorInput.value
		});
		
		updateMinimalistVisuals({ includeText: true, includeDivider: false });
	}
}

function resetMinimalistGradient() {
	const ciColors = getColorIdentityColors();
	const defaultColors = {
		color1: getColorHex(ciColors[0]) || '#FFF7D8',
		color2: getColorHex(ciColors[1]) || '#26C7FE',
		color3: getColorHex(ciColors[2]) || '#B264FF',
		colorCount: 'ci-auto',
		bgColor1: '#000000',
		bgColor2: '#000000',
		bgColor3: '#000000',
		bgColorCount: '1'
	};
	
	// Set all UI defaults
	setUIDefaults();
	
	// Reset min/max rules height
	document.getElementById('minimalist-min-rules-height').value = window.MINIMALIST_DEFAULTS.minHeight;
	document.getElementById('minimalist-max-rules-height').value = window.MINIMALIST_DEFAULTS.maxHeight;
	card.minimalist.minHeight = window.MINIMALIST_DEFAULTS.minHeight;
	card.minimalist.maxHeight = window.MINIMALIST_DEFAULTS.maxHeight;
	
	// Update color inputs with mana colors
	document.getElementById('minimalist-color-1').value = defaultColors.color1;
	document.getElementById('minimalist-color-2').value = defaultColors.color2;
	document.getElementById('minimalist-color-3').value = defaultColors.color3;
	document.getElementById('minimalist-color-count').value = defaultColors.colorCount;
	
	// Update background color inputs
	document.getElementById('minimalist-bg-color-1').value = defaultColors.bgColor1;
	document.getElementById('minimalist-bg-color-2').value = defaultColors.bgColor2;
	document.getElementById('minimalist-bg-color-3').value = defaultColors.bgColor3;
	document.getElementById('minimalist-bg-color-count').value = defaultColors.bgColorCount;
	
	// Update type line settings - reset to color identity auto (default)
	document.getElementById('minimalist-type-auto-color-ci').checked = true;
	document.getElementById('minimalist-type-color').value = '#FFFFFF';
	
	// Update P/T settings
	document.getElementById('minimalist-pt-color-mode').value = 'ci-auto';
	document.getElementById('minimalist-pt-color-1').value = '#FFFFFF';
	document.getElementById('minimalist-pt-color-2').value = '#FFFFFF';
	
	// Update card settings
	updateCardSettings('settings', { ...MINIMALIST_DEFAULTS.settings, ...defaultColors });
	updateCardSettings('dividerSettings', { 
		color1: defaultColors.color1,
		color2: defaultColors.color2,
		color3: defaultColors.color3,
		colorCount: defaultColors.colorCount
	});
	updateCardSettings('ptSettings', { ...window.MINIMALIST_DEFAULTS.ptSettings });
	updateCardSettings('typeSettings', { ...window.MINIMALIST_DEFAULTS.typeSettings });

	// Update visibility for all color pickers after resetting values
	toggleColorVisibility('bg');
	toggleColorVisibility('divider');
	toggleColorVisibility('pt');
	toggleColorVisibility('type');
	
	updateTypeLineColor();

	// This is async now, so we need to await it
	updateTextPositions(card.minimalist.currentHeight).then(() => {
		// Visual feedback after update completes
		const resetButton = document.getElementById('reset-minimalist-gradient');
		const originalText = resetButton.textContent;
		resetButton.textContent = 'Settings Reset!';
		resetButton.classList.add('success-highlight');
		
		setTimeout(() => {
			resetButton.textContent = originalText;
			resetButton.classList.remove('success-highlight');
		}, 1500);
	});
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

	// Initialize type line color settings
	const typeSettings = card.minimalist.typeSettings || window.MINIMALIST_COLOR_DEFAULTS;
	const typeAutoCheckboxCI = document.getElementById('minimalist-type-auto-color-ci');
	const typeColorInput = document.getElementById('minimalist-type-color');

	if (typeAutoCheckboxCI) typeAutoCheckboxCI.checked = typeSettings.autoColorCI;
	if (typeColorInput) {
		typeColorInput.value = typeSettings.customColor;
	}

	// Set initial visibility for background color pickers
	setTimeout(() => {
		toggleColorVisibility('bg');
		toggleColorVisibility('divider');
		toggleColorVisibility('pt');
		toggleColorVisibility('type');
		updateTypeLineColor();
		
		// Don't call updateMinimalistVisuals here - setupTextHandling will handle the initial draw
	}, 100);

		// Store original setBottomInfoStyle function and override it
		if (!window.originalSetBottomInfoStyle) {
			window.originalSetBottomInfoStyle = window.setBottomInfoStyle;
			
			// Override the global setBottomInfoStyle function
			window.setBottomInfoStyle = async function() {
				if (card.version === 'Minimalist') {
					// Handle minimalist version specifically
					if (document.querySelector('#enableNewCollectorStyle').checked) {
						await loadBottomInfo({
							topLeft: {text:'{elemidinfo-rarity} {kerning3}{elemidinfo-number}{kerning0}', x:0.090, y:0.9134, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:'white', outlineWidth:0.003},
							note: {text:'{loadx}{elemidinfo-note}', x:0.090, y:0.9263, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:'white', outlineWidth:0.003},
							midLeft: {text:'{elemidinfo-set} \u2022 {elemidinfo-language}  {savex}{fontbelerenbsc}{fontsize' + scaleHeight(0.001) + '}{upinline' + scaleHeight(0.0005) + '}\uFFEE{savex2}{elemidinfo-artist}', x:0.090, y:0.9334, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:'white', outlineWidth:0.003},
							bottomLeft: {text:'NOT FOR SALE', x:0.090, y:0.9605, width:0.8707, height:0.0143, oneLine:true, font:'gothammedium', size:0.0143, color:'white', outlineWidth:0.003},
							wizards: {name:'wizards', text:'{ptshift0,0.0172}\u2122 & \u00a9 {elemidinfo-year} Wizards of the Coast', x:0.090, y:0.9263, width:0.8707, height:0.0167, oneLine:true, font:'mplantin', size:0.0162, color:'white', align:'right', outlineWidth:0.003},
							bottomRight: {text:'{ptshift0,0.0172}CardConjurer.com', x:0.090, y:0.9334, width:0.8707, height:0.0143, oneLine:true, font:'mplantin', size:0.0143, color:'white', align:'right', outlineWidth:0.003}
						});
					} else {
						// Use the old style (pack default)
						await loadBottomInfo({
							topLeft: {text:'{savex}{fontbelerenbsc}{fontsize' + scaleHeight(0.001) + '}{upinline' + scaleHeight(0.0005) + '}\uFFEE{savex2}{elemidinfo-artist}', x:0.090, y:0.9134, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:'white', outlineWidth:0.003},
							midLeft: {text:'{kerning3}{elemidinfo-number}{kerning0}', x:0.090, y:0.9334, width:0.8707, height:0.0171, oneLine:true, font:'gothammedium', size:0.0171, color:'white', outlineWidth:0.003},
							bottomLeft: {text:'NOT FOR SALE', x:0.090, y:0.9605, width:0.8707, height:0.0143, oneLine:true, font:'gothammedium', size:0.0143, color:'white', outlineWidth:0.003},
							wizards: {name:'wizards', text:'{ptshift0,0.0172}\u2122 & \u00a9 {elemidinfo-year} Wizards of the Coast', x:0.090, y:0.9263, width:0.8707, height:0.0167, oneLine:true, font:'mplantin', size:0.0162, color:'white', align:'right', outlineWidth:0.003},
							bottomRight: {text:'{ptshift0,0.0172}CardConjurer.com', x:0.090, y:0.9334, width:0.8707, height:0.0143, oneLine:true, font:'mplantin', size:0.0143, color:'white', align:'right', outlineWidth:0.003}
						});
					}
					// Store the current layout for future use
					preserveMinimalistBottomInfo();
				} else {
					// For non-minimalist versions, use the original function
					await window.originalSetBottomInfoStyle();
				}
			};
		}

	setupTextHandling(savedText);
}

	function setupTextHandling(savedText) {
		const debouncedScale = debounce((text) => {
			if (!card.text.rules || card.version !== 'Minimalist') return;
			if (card.minimalist.lastProcessedText === text) return;
			
			card.minimalist.lastProcessedText = text;
	
			// Check if we're at max height and text is getting longer
			const currentHeight = card.minimalist.currentHeight;
			const isAtMaxHeight = currentHeight >= card.minimalist.maxHeight;
			const textLength = text.length;
			const lastLength = card.minimalist.lastTextLength || 0;
			const textGettingLonger = textLength > lastLength;
			
			// Skip calculation if at max height and text is getting longer
			if (isAtMaxHeight && textGettingLonger) {
				card.minimalist.lastTextLength = textLength;
				return;
			}
			
			// Calculate the proper height using the helper function
			const newHeight = calculateRulesBoxHeight(text);
	
			// Only update if height actually changed
			if (Math.abs(newHeight - currentHeight) < 0.001) {
				card.minimalist.lastTextLength = textLength;
				return;
			}
	
			const now = Date.now();
			const textLengthChanged = Math.abs(lastLength - textLength) > 10;
		const timeElapsed = now - (card.minimalist.lastFullUpdate || 0) > 1000;
		
		if (textLengthChanged || timeElapsed) {
			requestAnimationFrame(async () => {
				card.minimalist.currentHeight = newHeight;
				
				// Now update positions based on the rendered text (it will call drawText internally)
				await updateTextPositions(newHeight);
				
				card.minimalist.lastTextLength = textLength;
				card.minimalist.lastFullUpdate = now;
			});
		}
	}, 200);	// Restore saved text
	let hasRulesText = false;
	for (const key in savedText) {
		if (card.text[key]) {
			card.text[key].text = savedText[key];
			if (key === 'rules' && savedText[key]) {
				hasRulesText = true;
			}
		}
	}

	// Handle combined P/T field from other packs (e.g., "1/1" -> power: "1", toughness: "1")
	if (savedText.pt && savedText.pt.includes('/')) {
		const parts = savedText.pt.split('/');
		if (parts.length === 2) {
			// Set power from first part
			if (card.text.power) {
				card.text.power.text = parts[0].trim();
			}
			// Set toughness from second part
			if (card.text.toughness) {
				card.text.toughness.text = parts[1].trim();
			}
		}
	}

	// If we have rules text, immediately calculate the proper height
	if (hasRulesText && savedText.rules) {
		const newHeight = calculateRulesBoxHeight(savedText.rules);
		
		card.minimalist.currentHeight = newHeight;
		card.minimalist.lastTextLength = savedText.rules.length;
		card.minimalist.lastProcessedText = savedText.rules;
		card.minimalist.lastFullUpdate = Date.now(); // Prevent immediate re-processing
		
		// Update positions - it will handle text rendering internally
		updateTextPositions(card.minimalist.currentHeight);
	} else {
	// No rules text yet, but still draw the initial frame with default settings
	drawTextBuffer();
	updateMinimalistVisuals({
		includeBackground: true,
		includeDivider: true,
		includeText: false
	});
}	// Set up input listener
	const textEditor = getCachedElement('text-editor') || DOM_CACHE.textEditor;
	if (textEditor && !textEditor._minimalistListener) {
		textEditor._minimalistListener = true; // Prevent duplicate listeners
		textEditor.addEventListener('input', function() {
			// Only trigger recalculation for rules text, not P/T or other fields
			const currentTextField = Object.keys(card.text)[selectedTextIndex];
			if (currentTextField !== 'rules') {
				return; // Skip recalculation for non-rules fields
			}
			
			const text = this.value;
			const delay = text.length > 500 ? 250 : 0;
			setTimeout(() => debouncedScale(text), delay);
		}, { passive: true });
	}

	// Override textEdited function
	const originalTextEdited = window.textEdited;
	window.textEdited = async function() {
		if (card.version === 'Minimalist') {
			// Check what text field is currently being edited
			const currentTextField = Object.keys(card.text)[selectedTextIndex];
			const isPowerOrToughness = currentTextField === 'power' || currentTextField === 'toughness';
			
			// If editing power/toughness, just let normal flow handle it
			if (isPowerOrToughness) {
				// Call original to handle the text update normally
				if (originalTextEdited) originalTextEdited();
				
				// After the debounced drawText completes, update P/T positions and redraw
				// Use a slightly longer delay to ensure drawText has completed
				setTimeout(async () => {
					if (card.version === 'Minimalist' && card.dividerCanvas) {
						// Redraw divider with updated P/T symbols (this also updates power.x position)
						drawDividerGradient();
						// Redraw text to show power at its new position
						await drawText();
					}
				}, 600); // 100ms after drawTextBuffer's 500ms delay
				
				return;
			}
			
			// Get the current value from the text editor to ensure we have the latest text
			const textEditor = document.getElementById('text-editor');
			if (textEditor && card.text[currentTextField]) {
				card.text[currentTextField].text = textEditor.value;
			}
			
			// Update color identity from mana cost AND rules text when editing either field
			if (currentTextField === 'mana' || currentTextField === 'rules') {
				updateColorIdentityFromManaCost();
			}
			
			// For non-P/T fields, update type line color
			updateTypeLineColor();
			
			// For rules text, do the full position recalculation
			if (card.text.rules && card.text.rules.text) {
				const text = card.text.rules.text;
				
				// Calculate the proper height using the helper function
				const newHeight = calculateRulesBoxHeight(text);
				
				// Update the height immediately
				card.minimalist.currentHeight = newHeight;
				card.minimalist.lastProcessedText = text;
				card.minimalist.lastTextLength = text.length;
				
				// Update text positions with proper height - this will call drawText and drawCard
				await updateTextPositions(newHeight, false);
				
				// Don't call the original textEdited since we already handled the draw
				return;
			}
		}
		
		// For non-Minimalist or when no rules text, call original
		if (originalTextEdited) originalTextEdited();
	};
	
	// Don't override bottomInfoEdited to preserve minimalist styling
	const originalBottomInfoEdited = window.bottomInfoEdited;
	window.bottomInfoEdited = async function() {
		if (originalBottomInfoEdited) {
			await originalBottomInfoEdited();
		}
		
		// Store the current state if we're in minimalist mode
		if (card.version === 'Minimalist') {
			preserveMinimalistBottomInfo();
		}
	};
}

// functions to preserve and restore minimalist bottom info
function preserveMinimalistBottomInfo() {
	if (card.version === 'Minimalist' && card.bottomInfo) {
		window.minimalistBottomInfo = JSON.parse(JSON.stringify(card.bottomInfo));
	}
}

function restoreMinimalistBottomInfo() {
	if (card.version === 'Minimalist' && window.minimalistBottomInfo) {
		card.bottomInfo = JSON.parse(JSON.stringify(window.minimalistBottomInfo));
		return true;
	}
	return false;
}

//============================================================================
// MAIN INITIALIZATION
//============================================================================

if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
	loadedVersions.push('/js/frames/versionMinimalist.js');

	// Initialize card minimalist object
	if (!card.minimalist) {
		// Deep clone the defaults to avoid reference issues
		const defaults = window.MINIMALIST_DEFAULTS;
		card.minimalist = {
			baseY: defaults.baseY,
			spacing: defaults.spacing,
			minHeight: defaults.minHeight,
			maxHeight: defaults.maxHeight,
			currentHeight: defaults.currentHeight,
			settings: { ...defaults.settings },
			dividerSettings: { ...defaults.dividerSettings },
			ptSettings: { ...defaults.ptSettings },
			typeSettings: { ...defaults.typeSettings },
			textCache: {},
			lastTextLength: 0,
			lastProcessedText: '',
			lastFullUpdate: 0,
			_cachedManaColors: null,
			_lastManaText: ''
		};
		
		// Create measurement canvas
		const dims = getCardDimensions();
		const measureCanvas = document.createElement('canvas');
		measureCanvas.width = dims.width;
		measureCanvas.height = dims.height;
		card.minimalist.ctx = measureCanvas.getContext('2d');
		
		// Initialize performance optimizations
		initDOMCache();
	}
	
	// Ensure all text fields have a fontSize property to prevent errors
	// Some text fields (like power/toughness) use 'size' instead of 'fontSize'
	if (card.text) {
		for (const key in card.text) {
			if (card.text[key] && typeof card.text[key].fontSize === 'undefined') {
				// If fontSize is missing, use the size property or a default
				card.text[key].fontSize = card.text[key].size || 0.04;
			}
		}
	}
	
	// Create UI
	createMinimalistUI();
	
	// Sync UI dropdowns with stored settings to ensure defaults are properly applied
	if (card.minimalist.dividerSettings?.colorCount) {
		const dividerDropdown = document.getElementById('minimalist-color-count');
		if (dividerDropdown) {
			dividerDropdown.value = card.minimalist.dividerSettings.colorCount;
		}
	}
	
	if (card.minimalist.ptSettings?.colorMode) {
		const ptDropdown = document.getElementById('minimalist-pt-color-mode');
		if (ptDropdown) {
			ptDropdown.value = card.minimalist.ptSettings.colorMode;
		}
	}
	
	// Don't draw here - setupTextHandling/initializeMinimalistVersion will handle the initial draw
	
	// Initialize color identity from mana cost if not already set
	if (!card.colorIdentity || card.colorIdentity.length === 0) {
		updateColorIdentityFromManaCost();
	}
	
	// Watch for mana cost and color identity changes (for imports and updates)
	let lastManaText = card.text?.mana?.text || '';
	let lastColorIdentity = card.colorIdentity ? JSON.stringify(card.colorIdentity) : '[]';
	
	// Throttle the watcher to reduce overhead - only check every 250ms instead of 100ms
	setInterval(() => {
		if (card.version === 'Minimalist') {
			const currentManaText = card.text?.mana?.text || '';
			const currentColorIdentity = card.colorIdentity ? JSON.stringify(card.colorIdentity) : '[]';
			
			// Check if either mana cost or color identity changed
			if (currentManaText !== lastManaText || currentColorIdentity !== lastColorIdentity) {
				lastManaText = currentManaText;
				lastColorIdentity = currentColorIdentity;
				
				// Only update colors/gradients that depend on these values
				// Don't update text positions - those are handled by setupTextHandling
				updateMinimalistVisuals({ 
					includeBackground: false,  // Don't trigger text position recalc
					includeDivider: true, 
					includeText: false  // Don't redraw text, just colors
				});
			}
		}
	}, 250); // Reduced frequency to 250ms for better Firefox performance

	// Make functions globally accessible
	window.updateMinimalistGradient = updateMinimalistGradient;
	window.updateMinimalistVisuals = updateMinimalistVisuals;
	window.updateDividerColors = updateDividerColors;
	window.updatePTSymbols = updatePTSymbols;
	window.updateTypeLineColor = updateTypeLineColor;
	window.updateColorIdentityFromManaCost = updateColorIdentityFromManaCost;
	window.toggleColorVisibility = toggleColorVisibility;
	window.updateTextPositions = updateTextPositions;
	window.drawDividerGradient = drawDividerGradient;
	window.resetMinimalistGradient = resetMinimalistGradient;
	window.measureTextHeight = measureTextHeight;
	window.preserveMinimalistBottomInfo = preserveMinimalistBottomInfo;
	window.restoreMinimalistBottomInfo = restoreMinimalistBottomInfo;
	window.clearMinimalistTextCache = () => { 
		card.minimalist.textCache = {};
		COLOR_CACHE.clear();
	};
	window.debounce = debounce;
	window.initializeMinimalistVersion = initializeMinimalistVersion;
	
	// Create debounced versions for better Firefox performance
	// These reduce the number of redraws when users drag sliders or type quickly
	window.debouncedUpdateGradient = debounce(updateMinimalistGradient, 50);
	window.debouncedUpdateDivider = debounce(updateDividerColors, 50);
	window.debouncedUpdatePT = debounce(updatePTSymbols, 50);
	window.debouncedUpdateTypeLine = debounce(updateTypeLineColor, 50);
}