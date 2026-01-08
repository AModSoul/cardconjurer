//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionDungeon.js')) {
	loadedVersions.push('/js/frames/versionDungeon.js');
	sizeCanvas('dungeon');
	sizeCanvas('dungeonFX');
	document.querySelector('#creator-menu-tabs').innerHTML += '<h3 class="selectable readable-background" onclick="toggleCreatorTabs(event, `dungeon`)">Dungeon</h3>';
	var newHTML = document.createElement('div');
	newHTML.id = 'creator-menu-dungeon';
	newHTML.classList.add('hidden');
	newHTML.innerHTML = `
	<div class='readable-background padding margin-bottom'>
		<h5 class='padding margin-bottom input-description' style='font-size: 2em'>Dungeon Designer</h5>
		
		<strong style='font-size: 1.5em;'>Dungeon Presets:</strong>
		<div style='margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 10px;'>
			<button class='input' onclick='dungeonLoadPreset("tomb");' style='width: auto;'>Load: Tomb of Annihilation</button>
			<button class='input' onclick='dungeonLoadPreset("mad");' style='width: auto;'>Load: Dungeon of Mad Mage</button>
			<button class='input' onclick='dungeonLoadPreset("phandelver");' style='width: auto;'>Load: Lost Mine of Phandelver</button>
			<button class='input' onclick='dungeonLoadPreset("undercity");' style='width: auto;'>Load: Undercity</button>
			<button class='input' onclick='dungeonLoadPreset("baldursgatewilderness");' style='width: auto;'>Load: Baldur's Gate Wilderness</button>
		</div>
		
		<div style='margin-bottom: 10px;'>
			<button class='input' onclick='dungeonClearAll();' style='margin-right: 5px;'>Clear All Rooms</button>
			<button class='input' onclick='dungeonToggleMode();' id='dungeon-mode-button'>Current Mode: Visual Editor (Press to Switch To Text Editor)</button>
		</div>
		
		<div id='dungeon-visual-controls' style='margin-bottom: 10px;'>
			<div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-bottom: 10px;'>
				<button class='input' onclick='dungeonUndo();' id='dungeon-undo-button' disabled>↶ Undo</button>
				<button class='input' onclick='dungeonRedo();' id='dungeon-redo-button' disabled>↷ Redo</button>
			</div>
			<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 10px;'>
				<button class='input' onclick='dungeonZoomIn();'>🔍+ Zoom In</button>
				<button class='input' onclick='dungeonZoomReset();'>🔍 Reset</button>
				<button class='input' onclick='dungeonZoomOut();'>🔍- Zoom Out</button>
			</div>
			<label class='checkbox-container input' style='margin-bottom: 10px;'>
				Show grid coordinates
				<input type='checkbox' id='dungeon-show-coords' onchange='dungeonDrawGrid();' checked>
				<span class='checkmark'></span>
			</label>
		</div>
		
		<div id='dungeon-visual-editor' style='margin-bottom: 10px;'>
			<div style='display: flex; gap: 20px; align-items: flex-start;'>
				<div id='dungeon-canvas-container' style='overflow: hidden; width: fit-content; flex-shrink: 0;'>
					<canvas id='dungeon-grid-canvas' width='720' height='840' 
						style='border: 2px solid #666; background: #1a1a1a; cursor: crosshair; display: block; transform-origin: top left;'
						onclick='dungeonGridClick(event);'
						onmousemove='dungeonGridHover(event);'
						oncontextmenu='event.preventDefault(); dungeonGridRightClick(event);'>
					</canvas>
				</div>
				<div style='flex: 1; min-width: 300px;'>
					<h5 class='padding margin-bottom input-description' style='color: white; font-style: normal; margin-top: 0;'>
						<strong style='font-size: 1.5em;'>Visual Editor Tips:</strong><br>
						<strong style='font-size: 1.1em;'>Mouse Controls:</strong><br>
						<span style='padding-left: 20px;'>• Left-click and drag an empty cell to create a room</span><br>
						<span style='padding-left: 20px;'>• Click a room to select it (highlights orange)</span><br>
						<span style='padding-left: 20px;'>• Right-click a room to unselect it</span><br>
						<span style='padding-left: 20px;'>• Double right-click a room to delete it</span><br>
						<span style='padding-left: 20px;'>• Click on room edges to add a single door (disabled when a room is selected)</span><br>
						<span style='padding-left: 20px;'>• Click right side of a single door to make a double door</span><br>
						<span style='padding-left: 20px;'>• Click & Drag doors to reposition them (hightlight blue while dragging)</span><br>
						<span style='padding-left: 20px;'>• Doors snap to 0.5 cell increments</span><br>
						<span style='padding-left: 20px;'>• Double Left-click a door to remove it</span><br>
						<span style='padding-left: 20px;'>• Scroll wheel to zoom in/out</span><br>
						<strong style='font-size: 1.1em;'>Selected Room Controls:</strong><br>
						<span style='padding-left: 20px;'>• Drag center (blue circle) to move room</span><br>
						<span style='padding-left: 20px;'>• Drag corners (orange squares) to resize room</span><br>
						<span style='padding-left: 20px;'>• Door operations are disabled while a room is selected</span><br>
						<strong style='font-size: 1.1em;'>Keyboard Shortcuts:</strong><br>
						<span style='padding-left: 20px;'>• Ctrl+Z: Undo, Ctrl+Shift+Z or Ctrl+Y: Redo</span><br>
						<span style='padding-left: 20px;'>• Delete/Backspace: Delete selected room</span><br>
						<span style='padding-left: 20px;'>• Ctrl+Arrow Keys: Move selected room</span><br>
						<span style='padding-left: 20px;'>• Escape: Deselect room</span><br>
					</h5>
				</div>
			</div>
		</div>
		
		<div id='dungeon-text-editor' style='display: none;'>
			<h5 class='padding margin-bottom input-description' style='color: white; font-style: normal;'>
				<strong style='font-size: 1.5em;'>Text Editor Tips:</strong><br>
				<strong style='font-size: 1.1em;'>Advanced Mode - Edit Room Data Directly</strong><br>
				<span style='padding-left: 20px;'>• Format: X,Y,Width,Height,Door-1,Door-2,...</span><br>
				<span style='padding-left: 20px;'>• Each room on a new line</span><br>
				<span style='padding-left: 20px;'>• Coordinates are in grid cells (0-15 horizontal, 0-18 vertical)</span><br>
				<strong style='font-size: 1.1em;'>Doorway Format:</strong><br>
				<span style='padding-left: 20px;'>• Single Door: 1/position (e.g., 1/3.5)</span><br>
				<span style='padding-left: 20px;'>• Double Door: 2/position (e.g., 2/7)</span><br>
				<span style='padding-left: 20px;'>• Position is the left edge of the door relative to room's left edge</span><br>
			</h5>
			<textarea id='dungeon-input' class='input margin-bottom' oninput='dungeonEditedBuffer();' style='font-family: monospace; min-height: 200px;'>0,0,16,2,2/3,2/11
0,2,8,4,1/1.5,1/5.5
8,2,8,4,1/0.5,1/4.5
0,6,5,5,1/1.5
5,6,6,5,1/0.5,1/3.5
11,6,5,5,1/1.5
0,11,8,4,2/3
8,11,8,4,2/3
0,15,16,4,2/7</textarea>
		</div>
	</div>
	<div class='readable-background padding'>
		<h5 class='padding margin-bottom input-description'>Dungeon wall color:</h5>
		<select id='dungeon-color' class='input' onchange='dungeonEditedBuffer();'>
			<option value="W">White</option>
			<option value="U">Blue</option>
			<option value="B" selected="selected">Black</option>
			<option value="R">Red</option>
			<option value="G">Green</option>
			<option value="C">Colorless</option>
		</select>
		<div style='margin-top: 10px;'>
			<label class='checkbox-container input'>Show entrance
				<input type='checkbox' id='dungeon-entrance-enabled' onchange='dungeonEditedBuffer();' checked>
				<span class='checkmark'></span>
			</label>
		</div>
	</div>`;
	if (!card.dungeon) {
		card.dungeon = {abilities:[1, 1, 1, 0], count:3, x:0.1, width:0.3947};
	}
	document.querySelector('#creator-menu-sections').appendChild(newHTML);
	var dungeonFXtop = new Image(); setImageUrl(dungeonFXtop, '/img/frames/dungeon/walls/fx/top.png');
	var dungeonFXleft = new Image(); setImageUrl(dungeonFXleft, '/img/frames/dungeon/walls/fx/left.png');
	var dungeonFXbottom = new Image(); setImageUrl(dungeonFXbottom, '/img/frames/dungeon/walls/fx/bottom.png');
	var dungeonFXright = new Image(); setImageUrl(dungeonFXright, '/img/frames/dungeon/walls/fx/right.png');
	var dungeonFXtopright = new Image(); setImageUrl(dungeonFXtopright, '/img/frames/dungeon/walls/fx/topright.png');
	var dungeonFXtopleft = new Image(); setImageUrl(dungeonFXtopleft, '/img/frames/dungeon/walls/fx/topleft.png');
	var dungeonFXbottomright = new Image(); setImageUrl(dungeonFXbottomright, '/img/frames/dungeon/walls/fx/bottomright.png');
	var dungeonFXbottomleft = new Image(); setImageUrl(dungeonFXbottomleft, '/img/frames/dungeon/walls/fx/bottomleft.png');
	var dungeonShapetop = new Image(); setImageUrl(dungeonShapetop, '/img/frames/dungeon/walls/shape/top.png');
	var dungeonShapeleft = new Image(); setImageUrl(dungeonShapeleft, '/img/frames/dungeon/walls/shape/left.png');
	var dungeonShapebottom = new Image(); setImageUrl(dungeonShapebottom, '/img/frames/dungeon/walls/shape/bottom.png');
	var dungeonShaperight = new Image(); setImageUrl(dungeonShaperight, '/img/frames/dungeon/walls/shape/right.png');
	var dungeonShapetopright = new Image(); setImageUrl(dungeonShapetopright, '/img/frames/dungeon/walls/shape/topright.png');
	var dungeonShapetopleft = new Image(); setImageUrl(dungeonShapetopleft, '/img/frames/dungeon/walls/shape/topleft.png');
	var dungeonShapebottomright = new Image(); setImageUrl(dungeonShapebottomright, '/img/frames/dungeon/walls/shape/bottomright.png');
	var dungeonShapebottomleft = new Image(); setImageUrl(dungeonShapebottomleft, '/img/frames/dungeon/walls/shape/bottomleft.png');
	var dungeonDoorwayShape = new Image(); setImageUrl(dungeonDoorwayShape, '/img/frames/dungeon/walls/shape/doorway.png');
	var dungeonDoorwayFX = new Image(); setImageUrl(dungeonDoorwayFX, '/img/frames/dungeon/walls/fx/doorway.png');
	var dungeonDoorwayArrow = new Image(); setImageUrl(dungeonDoorwayArrow, '/img/frames/dungeon/walls/arrow.png');
	var dungeonDoorwayCutout = new Image(); setImageUrl(dungeonDoorwayCutout, '/img/frames/dungeon/walls/doorway.png');
	var dungeonOuterShape = new Image(); setImageUrl(dungeonOuterShape, '/img/frames/dungeon/walls/shape/outer.png');
	var dungeonOuterFX = new Image(); setImageUrl(dungeonOuterFX, '/img/frames/dungeon/walls/fx/outer.png');
	var dungeonTextureW = new Image(); setImageUrl(dungeonTextureW, '/img/frames/dungeon/walls/textures/w.png');
	var dungeonTextureU = new Image(); setImageUrl(dungeonTextureU, '/img/frames/dungeon/walls/textures/u.png');
	var dungeonTextureB = new Image(); setImageUrl(dungeonTextureB, '/img/frames/dungeon/walls/textures/b.png');
	var dungeonTextureR = new Image(); setImageUrl(dungeonTextureR, '/img/frames/dungeon/walls/textures/r.png');
	var dungeonTextureG = new Image(); setImageUrl(dungeonTextureG, '/img/frames/dungeon/walls/textures/g.png');
	var dungeonTextureC = new Image(); setImageUrl(dungeonTextureC, '/img/frames/dungeon/walls/textures/c.png');
	dungeonTextureC.onload = dungeonEditedBuffer;
}

// Constants
const DUNGEON_CONST = {
	CELL_SIZE: 40,
	GRID_WIDTH: 16,
	GRID_HEIGHT: 19,
	DOOR_TOLERANCE: 0.3,
	DOOR_DRAG_TOLERANCE_1: 0.75,
	DOOR_DRAG_TOLERANCE_2: { min: -0.5, max: 1.5 },
	HISTORY_LIMIT: 50,
	DOUBLE_CLICK_MS: 300
};

// Helper: Parse door data (handles both string "1/3.5" and number formats)
function parseDoor(doorValue) {
	if (typeof doorValue === 'string' && doorValue.includes('/')) {
		const [width, position] = doorValue.split('/');
		return { width: parseInt(width), position: parseFloat(position) };
	}
	return { width: 2, position: parseFloat(doorValue) };
}

// Helper: Format door for storage
function formatDoor(width, position) {
	return `${width}/${position}`;
}

var drawingDungeon;
function dungeonEditedBuffer() {
	clearTimeout(drawingDungeon);
	drawingDungeon = setTimeout(dungeonEdited, 500);
}

function dungeonEdited() {
	const input = document.querySelector('#dungeon-input');
	const entranceEnabled = document.querySelector('#dungeon-entrance-enabled').checked;
	let data = input.value;
	
	// Remove NOENTRANCE marker if it exists (backward compatibility)
	if (data.startsWith('NOENTRANCE\n')) {
		data = data.substring(11);
	}
	
	// Parse rooms
	const rooms = data.replace(/ /g, '').split('\n').map(room => {
		const parts = room.split(',');
		return [
			parseInt(parts[0]),
			parseInt(parts[1]),
			parseInt(parts[2]) - 1,
			parseInt(parts[3]) - 1,
			...parts.slice(4).map(parseDoor)
		];
	}).filter(room => room.length >= 4 && room[0] !== undefined && !isNaN(room[0]));
	
	console.log(rooms);
	
	// Initialize canvas
	const cellSize = scaleHeight(0.0381);
	const origX = scaleX(0.0734);
	const origY = scaleY(0.1377);
	
	dungeonContext.clearRect(0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonFXContext.clearRect(0, 0, dungeonFXCanvas.width, dungeonFXCanvas.height);
	
	// Draw rooms
	rooms.forEach(room => dungeonDrawRoomWalls(room, cellSize, origX, origY));
	
	// Outer border
	const outerBorderWidthAdjust = -2;
	const outerBorderHeightAdjust = -5;
	dungeonContext.drawImage(dungeonOuterShape, 0, 0, dungeonCanvas.width + outerBorderWidthAdjust, dungeonCanvas.height + outerBorderHeightAdjust);
	dungeonFXContext.drawImage(dungeonOuterFX, 0, 0, dungeonFXCanvas.width + outerBorderWidthAdjust, dungeonFXCanvas.height + outerBorderHeightAdjust);
	
	// Text
	const textObjects = {
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'white', align:'center'}
	};
	
	rooms.forEach((room, i) => {
		const roomNumber = i + 1;
		let text = `Room ${roomNumber}{lns}{fontmplantin}{fontsize-8}Effect.`;
		if (room[3] < 3) text = text.replace('{lns}', '   ');
		
		textObjects[`dungeonRoom${roomNumber}`] = {
			name: `Dungeon Room ${roomNumber}`,
			text,
			x: (origX + cellSize * (room[0] + 0.5)) / card.width,
			y: (origY + cellSize * (room[1] + 0.5)) / card.height,
			width: (cellSize * room[2]) / card.width,
			height: (cellSize * room[3]) / card.height,
			font: 'belerenb',
			size: 0.0324,
			align: 'center'
		};
	});
	
	// Add entrance doorway if enabled and there are rooms
	if (entranceEnabled && rooms.length > 0) {
		rooms.push([0, -2, 16, 1, {width: 2, position: 7}]);
	}
	
	// Draw doorways
	rooms.forEach(room => {
		room.slice(4).forEach(doorway => {
			dungeonDrawDoorway(room, doorway, cellSize, origX, origY);
		});
	});
	
	// Apply textures and FX
	dungeonContext.globalCompositeOperation = 'source-in';
	const texture = window[`dungeonTexture${document.querySelector('#dungeon-color').value}`];
	dungeonContext.drawImage(texture, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonContext.globalCompositeOperation = 'source-over';
	dungeonContext.drawImage(dungeonFXCanvas, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	
	loadTextOptions(textObjects);
	drawTextBuffer();
}

// Helper: Draw room walls
function dungeonDrawRoomWalls(room, cellSize, origX, origY) {
	const [x, y, w, h] = room;
	const drawCorner = (shapeImg, fxImg, cx, cy) => {
		dungeonContext.drawImage(shapeImg, origX + cellSize * cx, origY + cellSize * cy, cellSize, cellSize);
		dungeonFXContext.drawImage(fxImg, origX + cellSize * cx, origY + cellSize * cy, cellSize, cellSize);
	};
	
	// Corners
	drawCorner(dungeonShapetopleft, dungeonFXtopleft, x, y);
	drawCorner(dungeonShapetopright, dungeonFXtopright, x + w, y);
	drawCorner(dungeonShapebottomleft, dungeonFXbottomleft, x, y + h);
	drawCorner(dungeonShapebottomright, dungeonFXbottomright, x + w, y + h);
	
	// Horizontal walls
	for (let i = 1; i < w; i++) {
		dungeonContext.drawImage(dungeonShapetop, origX + cellSize * (x + i), origY + cellSize * y, cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXtop, origX + cellSize * (x + i), origY + cellSize * y, cellSize, cellSize);
		dungeonContext.drawImage(dungeonShapebottom, origX + cellSize * (x + i), origY + cellSize * (y + h), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXbottom, origX + cellSize * (x + i), origY + cellSize * (y + h), cellSize, cellSize);
	}
	
	// Vertical walls
	for (let i = 1; i < h; i++) {
		dungeonContext.drawImage(dungeonShapeleft, origX + cellSize * x, origY + cellSize * (y + i), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXleft, origX + cellSize * x, origY + cellSize * (y + i), cellSize, cellSize);
		dungeonContext.drawImage(dungeonShaperight, origX + cellSize * (x + w), origY + cellSize * (y + i), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXright, origX + cellSize * (x + w), origY + cellSize * (y + i), cellSize, cellSize);
	}
}

// Helper: Draw doorway
function dungeonDrawDoorway(room, doorway, cellSize, origX, origY) {
	const is1Wide = doorway.width === 1;
	const doorPosition = doorway.position;
	const isFinalExit = (room[1] + room[3] === 18);
	
	// Door dimensions based on width
	const doorWidth = cellSize * (is1Wide ? 1.5 : 3);
	const xAdjust = is1Wide ? 30 : 3;
	const yOffset = is1Wide ? 0 : 0;
	const heightMultiplier = (is1Wide && !isFinalExit) ? 2 : (isFinalExit ? 1 : 1);
	const doorHeight = dungeonDoorwayCutout.height * (doorWidth / dungeonDoorwayCutout.width) * heightMultiplier;
	
	const doorX = origX + cellSize * (room[0] + doorPosition - 0.5) + xAdjust;
	const doorY = origY + cellSize * (room[1] + room[3]) + yOffset;
	
	// Cutout
	dungeonContext.globalCompositeOperation = 'destination-out';
	dungeonFXContext.globalCompositeOperation = 'destination-out';
	dungeonContext.drawImage(dungeonDoorwayCutout, doorX, doorY, doorWidth, doorHeight);
	dungeonFXContext.drawImage(dungeonDoorwayCutout, doorX, doorY, doorWidth, doorHeight);
	
	// Shape and FX
	dungeonContext.globalCompositeOperation = 'source-over';
	dungeonFXContext.globalCompositeOperation = 'source-over';
	dungeonContext.drawImage(dungeonDoorwayShape, doorX, doorY, doorWidth, doorHeight);
	dungeonFXContext.drawImage(dungeonDoorwayFX, doorX, doorY, doorWidth, doorHeight);
	
	// Arrow (not for entrance or exit)
	if (room[1] !== -2 && !isFinalExit) {
		const arrowXOffset = is1Wide ? -37 : 15;
		const arrowYOffset = 10;
		dungeonFXContext.drawImage(dungeonDoorwayArrow, 
			origX + cellSize * (room[0] + doorPosition + 0.5) + arrowXOffset,
			origY + cellSize * (room[1] + room[3] + 0.5) + arrowYOffset);
	}
}

// Visual editor state
var dungeonEditorState = {
	mode: 'visual', // 'visual' or 'text'
	gridCanvas: null,
	gridCtx: null,
	isDrawing: false,
	startCell: null,
	currentRoom: null,
	hoveredCell: null,
	rooms: [],
	isDraggingDoor: false,
	draggedDoor: null, // { room, doorIndex, originalPos }
	dragStartX: null,
	lastClickTime: 0,
	lastClickDoor: null,
	hasDragged: false, // Track if mouse has actually moved during drag
	// Right-click tracking
	lastRightClickTime: 0,
	lastRightClickRoom: null,
	// New features
	selectedRoom: null, // Currently selected room index
	history: [], // Undo history
	historyIndex: -1, // Current position in history
	zoom: 1, // Zoom level
	panX: 0, // Pan offset X
	panY: 0, // Pan offset Y
	// Panning/resizing
	isPanning: false,
	panStartX: 0,
	panStartY: 0,
	isResizing: false,
	resizeHandle: null, // 'tl', 'tr', 'bl', 'br' for corners
	resizeStartRoom: null
};

// Initialize the visual editor
function dungeonInitVisualEditor() {
	setTimeout(() => {
		dungeonEditorState.gridCanvas = document.getElementById('dungeon-grid-canvas');
		if (dungeonEditorState.gridCanvas) {
			dungeonEditorState.gridCtx = dungeonEditorState.gridCanvas.getContext('2d');
			dungeonParseRoomsFromText();
			dungeonSaveHistory(); // Save initial state
			dungeonDrawGrid();
			
			// Add mouse event listeners
			dungeonEditorState.gridCanvas.addEventListener('mousedown', dungeonGridMouseDown);
			dungeonEditorState.gridCanvas.addEventListener('mousemove', dungeonGridMouseMove);
			dungeonEditorState.gridCanvas.addEventListener('mouseup', dungeonGridMouseUp);
			dungeonEditorState.gridCanvas.addEventListener('mouseleave', dungeonGridMouseUp);
			dungeonEditorState.gridCanvas.addEventListener('wheel', dungeonGridWheel);
			
			// Add keyboard event listeners
			document.addEventListener('keydown', dungeonHandleKeyboard);
		}
	}, 100);
}

// Parse rooms from text input
function dungeonParseRoomsFromText() {
	const input = document.querySelector('#dungeon-input');
	if (!input) return;
	
	dungeonEditorState.rooms = [];
	const lines = input.value.split('\n');
	
	lines.forEach(line => {
		if (line.trim()) {
			const parts = line.replace(/ /g, '').split(',');
			if (parts.length >= 4) {
				dungeonEditorState.rooms.push({
					x: Number(parts[0]),
					y: Number(parts[1]),
					width: Number(parts[2]),
					height: Number(parts[3]),
					doors: parts.slice(4).map(door => {
						// Keep door as string if it contains "/" otherwise convert to number
						return door.includes('/') ? door : Number(door);
					})
				});
			}
		}
	});
}

// Convert rooms to text format
function dungeonRoomsToText() {
	const lines = dungeonEditorState.rooms.map(room => {
		const parts = [room.x, room.y, room.width, room.height, ...room.doors];
		return parts.join(',');
	});
	
	const input = document.querySelector('#dungeon-input');
	if (input) {
		input.value = lines.join('\n');
		dungeonEditedBuffer();
	}
}

// Draw the grid
function dungeonDrawGrid() {
	if (!dungeonEditorState.gridCtx) return;
	
	const { gridCanvas: canvas, gridCtx: ctx } = dungeonEditorState;
	const { CELL_SIZE: cellSize, GRID_WIDTH: gridWidth, GRID_HEIGHT: gridHeight } = DUNGEON_CONST;
	const showCoords = document.getElementById('dungeon-show-coords')?.checked ?? true;
	const gridOffsetX = cellSize; // Offset by 1 cell for coordinates
	const gridOffsetY = cellSize; // Offset by 1 cell for coordinates
	
	// Clear canvas
	ctx.fillStyle = '#1a1a1a';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw coordinate labels
	if (showCoords) {
		ctx.fillStyle = '#666';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		// Top coordinates
		for (let x = 0; x < gridWidth; x++) {
			ctx.fillText(x, gridOffsetX + (x + 0.5) * cellSize, gridOffsetY / 2);
		}
		
		// Bottom coordinates
		for (let x = 0; x < gridWidth; x++) {
			ctx.fillText(x, gridOffsetX + (x + 0.5) * cellSize, gridOffsetY + gridHeight * cellSize + gridOffsetY / 2);
		}
		
		// Left coordinates
		for (let y = 0; y < gridHeight; y++) {
			ctx.fillText(y, gridOffsetX / 2, gridOffsetY + (y + 0.5) * cellSize);
		}
		
		// Right coordinates
		for (let y = 0; y < gridHeight; y++) {
			ctx.fillText(y, gridOffsetX + gridWidth * cellSize + gridOffsetX / 2, gridOffsetY + (y + 0.5) * cellSize);
		}
	}
	
	// Draw grid lines
	const drawGridLines = (max, isHorizontal) => {
		for (let i = 0; i <= max; i++) {
			ctx.strokeStyle = i % 4 === 0 ? '#444' : '#333';
			ctx.lineWidth = i % 4 === 0 ? 1.5 : 1;
			ctx.beginPath();
			if (isHorizontal) {
				ctx.moveTo(gridOffsetX, gridOffsetY + i * cellSize);
				ctx.lineTo(gridOffsetX + gridWidth * cellSize, gridOffsetY + i * cellSize);
			} else {
				ctx.moveTo(gridOffsetX + i * cellSize, gridOffsetY);
				ctx.lineTo(gridOffsetX + i * cellSize, gridOffsetY + gridHeight * cellSize);
			}
			ctx.stroke();
		}
	};
	
	drawGridLines(gridWidth, false);
	drawGridLines(gridHeight, true);
	
	// Draw rooms
	dungeonEditorState.rooms.forEach((room, index) => {
		const isSelected = dungeonEditorState.selectedRoom === index;
		
		// Room fill
		if (isSelected) {
			const gradient = ctx.createLinearGradient(
				gridOffsetX + room.x * cellSize, gridOffsetY + room.y * cellSize,
				gridOffsetX + (room.x + room.width) * cellSize, gridOffsetY + (room.y + room.height) * cellSize
			);
			gradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
			gradient.addColorStop(1, 'rgba(255, 150, 50, 0.3)');
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
		}
		ctx.fillRect(gridOffsetX + room.x * cellSize, gridOffsetY + room.y * cellSize, room.width * cellSize, room.height * cellSize);
		
		// Room border
		ctx.strokeStyle = isSelected ? '#ffa500' : '#6496c8';
		ctx.lineWidth = isSelected ? 3 : 2;
		ctx.strokeRect(gridOffsetX + room.x * cellSize, gridOffsetY + room.y * cellSize, room.width * cellSize, room.height * cellSize);
		
		// Room number
		const textX = gridOffsetX + (room.x + room.width / 2) * cellSize;
		const textY = gridOffsetY + (room.y + room.height / 2) * cellSize;
		ctx.fillStyle = isSelected ? 'rgba(255, 165, 0, 0.8)' : 'rgba(100, 150, 200, 0.8)';
		ctx.beginPath();
		ctx.arc(textX, textY, 14, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 16px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${index + 1}`, textX, textY);
		
		// Draw handles for selected room
		if (isSelected) {
			const handleSize = 10;
			const corners = [
				[room.x, room.y],
				[room.x + room.width, room.y],
				[room.x, room.y + room.height],
				[room.x + room.width, room.y + room.height]
			];
			
			ctx.fillStyle = '#ffa500';
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 2;
			
			corners.forEach(([x, y]) => {
				ctx.fillRect(gridOffsetX + x * cellSize - handleSize/2, gridOffsetY + y * cellSize - handleSize/2, handleSize, handleSize);
				ctx.strokeRect(gridOffsetX + x * cellSize - handleSize/2, gridOffsetY + y * cellSize - handleSize/2, handleSize, handleSize);
			});
			
			// Center drag handle
			ctx.fillStyle = '#00aaff';
			ctx.beginPath();
			ctx.arc(textX, textY, 8, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
		
		// Draw doors
		room.doors.forEach((doorPos, doorIndex) => {
			const door = typeof doorPos === 'string' && doorPos.includes('/') 
				? parseDoor(doorPos)
				: { width: 2, position: Number(doorPos) };
			
			const doorWidth = cellSize * door.width;
			const doorX = gridOffsetX + (room.x + door.position) * cellSize;
			const doorY = gridOffsetY + (room.y + room.height) * cellSize;
			
			// Check if this door is being dragged
			const isDragging = dungeonEditorState.isDraggingDoor && 
			                   dungeonEditorState.draggedDoor && 
			                   dungeonEditorState.draggedDoor.room === room && 
			                   dungeonEditorState.draggedDoor.doorIndex === doorIndex;
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.fillRect(doorX, doorY - 4, doorWidth, 8);
			
			ctx.fillStyle = door.width === 1 ? '#ffcc00' : '#4CAF50';
			ctx.fillRect(doorX, doorY - 5, doorWidth, 10);
			
			// Draw border - blue if dragging, white otherwise
			ctx.strokeStyle = isDragging ? '#00aaff' : '#fff';
			ctx.lineWidth = isDragging ? 3 : 1;
			ctx.strokeRect(doorX, doorY - 5, doorWidth, 10);
		});
	});
	
	// Draw current drawing room
	if (dungeonEditorState.isDrawing && dungeonEditorState.currentRoom) {
		const room = dungeonEditorState.currentRoom;
		ctx.fillStyle = 'rgba(150, 200, 100, 0.3)';
		ctx.fillRect(gridOffsetX + room.x * cellSize, gridOffsetY + room.y * cellSize, room.width * cellSize, room.height * cellSize);
		ctx.strokeStyle = '#96c864';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(gridOffsetX + room.x * cellSize, gridOffsetY + room.y * cellSize, room.width * cellSize, room.height * cellSize);
		ctx.setLineDash([]);
	}
	
	// Highlight hovered cell
	if (dungeonEditorState.hoveredCell) {
		const cell = dungeonEditorState.hoveredCell;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.fillRect(gridOffsetX + cell.x * cellSize, gridOffsetY + cell.y * cellSize, cellSize, cellSize);
		
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		ctx.fillRect(gridOffsetX + cell.x * cellSize + 2, gridOffsetY + cell.y * cellSize + 2, 32, 18);
		ctx.fillStyle = '#fff';
		ctx.font = '10px Arial';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(`${cell.x},${cell.y}`, gridOffsetX + cell.x * cellSize + 5, gridOffsetY + cell.y * cellSize + 5);
	}
	
	dungeonUpdateButtons();
}

// Get cell from mouse event
function dungeonGetCellFromEvent(event) {
	const canvas = dungeonEditorState.gridCanvas;
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	const x = (event.clientX - rect.left) * scaleX;
	const y = (event.clientY - rect.top) * scaleY;
	const cellSize = DUNGEON_CONST.CELL_SIZE;
	const gridOffsetX = cellSize;
	const gridOffsetY = cellSize;
	
	// Adjust for grid offset
	const adjustedX = x - gridOffsetX;
	const adjustedY = y - gridOffsetY;
	
	return {
		x: Math.floor(adjustedX / cellSize),
		y: Math.floor(adjustedY / cellSize),
		subX: (adjustedX % cellSize) / cellSize,
		subY: (adjustedY % cellSize) / cellSize,
		pixelX: adjustedX,
		pixelY: adjustedY
	};
}

// Check if clicking on a resize handle
function dungeonGetResizeHandle(cell, room) {
	const handleSize = 10 / DUNGEON_CONST.CELL_SIZE;
	const corners = {
		'tl': { x: room.x, y: room.y },
		'tr': { x: room.x + room.width, y: room.y },
		'bl': { x: room.x, y: room.y + room.height },
		'br': { x: room.x + room.width, y: room.y + room.height }
	};
	
	for (let [handle, pos] of Object.entries(corners)) {
		if (Math.abs(cell.x + cell.subX - pos.x) < handleSize && 
		    Math.abs(cell.y + cell.subY - pos.y) < handleSize) {
			return handle;
		}
	}
	return null;
}

// Check if clicking on center drag handle
function dungeonIsClickingCenterHandle(cell, room) {
	const centerX = room.x + room.width / 2;
	const centerY = room.y + room.height / 2;
	const radius = 0.2;
	const dx = (cell.x + cell.subX) - centerX;
	const dy = (cell.y + cell.subY) - centerY;
	return Math.sqrt(dx * dx + dy * dy) < radius;
}

// Helper: Check if click is within door bounds
function dungeonIsDoorHit(doorPos, clickPos, useDragTolerance = false) {
	const door = parseDoor(doorPos);
	
	if (useDragTolerance) {
		// Wider tolerance for dragging existing doors
		if (door.width === 1) {
			return Math.abs(door.position - clickPos) < DUNGEON_CONST.DOOR_DRAG_TOLERANCE_1;
		}
		return clickPos >= door.position + DUNGEON_CONST.DOOR_DRAG_TOLERANCE_2.min && 
		       clickPos <= door.position + DUNGEON_CONST.DOOR_DRAG_TOLERANCE_2.max;
	} else {
		// Tight tolerance for placing new doors
		const tolerance = DUNGEON_CONST.DOOR_TOLERANCE;
		if (door.width === 1) {
			return Math.abs(door.position - clickPos) < tolerance;
		}
		return clickPos >= door.position - tolerance && clickPos <= door.position + 1 + tolerance;
	}
}

// Mouse down event
function dungeonGridMouseDown(event) {
	if (event.button !== 0) return; // Only left click
	
	const cell = dungeonGetCellFromEvent(event);
	const currentTime = Date.now();
	
	// Check if a room is selected
	if (dungeonEditorState.selectedRoom !== null) {
		const room = dungeonEditorState.rooms[dungeonEditorState.selectedRoom];
		
		// Check if clicking center handle (for dragging)
		if (dungeonIsClickingCenterHandle(cell, room)) {
			dungeonEditorState.isPanning = true;
			dungeonEditorState.panStartX = cell.x + cell.subX;
			dungeonEditorState.panStartY = cell.y + cell.subY;
			dungeonEditorState.resizeStartRoom = JSON.parse(JSON.stringify(room));
			event.preventDefault();
			return;
		}
		
		// Check if clicking a corner handle (for resizing)
		const handle = dungeonGetResizeHandle(cell, room);
		if (handle) {
			dungeonEditorState.isResizing = true;
			dungeonEditorState.resizeHandle = handle;
			dungeonEditorState.resizeStartRoom = JSON.parse(JSON.stringify(room));
			event.preventDefault();
			return;
		}
	}
	
	// Skip door operations if a room is selected (to avoid conflicts with drag/resize)
	if (dungeonEditorState.selectedRoom === null) {
		// Check if clicking near the bottom wall of a room
		for (let room of dungeonEditorState.rooms) {
			const bottomY = room.y + room.height;
			const clickY = cell.y + cell.subY;
			
			if (clickY >= bottomY - DUNGEON_CONST.DOOR_TOLERANCE && 
			    clickY <= bottomY + DUNGEON_CONST.DOOR_TOLERANCE && 
			    cell.x >= room.x - 0.5 && cell.x <= room.x + room.width + 0.5) {
				
				const doorPos = cell.x + cell.subX - room.x;
				
				// Check if clicking on an existing door
				const doorIndex = room.doors.findIndex(d => dungeonIsDoorHit(d, doorPos, true));
				
				if (doorIndex >= 0) {
					// Check for double-click
					const isDoubleClick = 
						currentTime - dungeonEditorState.lastClickTime < DUNGEON_CONST.DOUBLE_CLICK_MS &&
						dungeonEditorState.lastClickDoor &&
						dungeonEditorState.lastClickDoor.room === room &&
						dungeonEditorState.lastClickDoor.doorIndex === doorIndex;
					
					if (isDoubleClick) {
						room.doors.splice(doorIndex, 1);
						dungeonRoomsToText();
						dungeonDrawGrid();
						dungeonEditorState.lastClickTime = 0;
						dungeonEditorState.lastClickDoor = null;
						return;
					} else {
						// Start dragging the door
						const door = parseDoor(room.doors[doorIndex]);
						dungeonEditorState.isDraggingDoor = true;
						dungeonEditorState.draggedDoor = { room, doorIndex, originalPos: door.position };
						dungeonEditorState.dragStartX = doorPos;
						dungeonEditorState.hasDragged = false;
						dungeonEditorState.lastClickTime = currentTime;
						dungeonEditorState.lastClickDoor = { room, doorIndex };
						return;
					}
				} else {
					// Add new door
					dungeonToggleDoor(room, doorPos);
					dungeonRoomsToText();
					dungeonEditorState.lastClickTime = 0;
					dungeonEditorState.lastClickDoor = null;
					return;
				}
			}
		}
	}
	
	// Check if clicking on an existing room (for selection)
	for (let i = dungeonEditorState.rooms.length - 1; i >= 0; i--) {
		const room = dungeonEditorState.rooms[i];
		if (cell.x >= room.x && cell.x < room.x + room.width &&
			cell.y >= room.y && cell.y < room.y + room.height) {
			// Select this room
			dungeonEditorState.selectedRoom = i;
			dungeonDrawGrid();
			return;
		}
	}
	
	// Deselect if clicking on empty space
	dungeonEditorState.selectedRoom = null;
	
	// Start drawing new room
	if (cell.x >= 0 && cell.x < 16 && cell.y >= 0 && cell.y < 19) {
		dungeonEditorState.isDrawing = true;
		dungeonEditorState.startCell = cell;
		dungeonEditorState.currentRoom = {
			x: cell.x,
			y: cell.y,
			width: 1,
			height: 1,
			doors: []
		};
		dungeonDrawGrid();
	}
}

// Mouse move event
function dungeonGridMouseMove(event) {
	const cell = dungeonGetCellFromEvent(event);
	dungeonEditorState.hoveredCell = cell;
	
	// Handle room dragging (Ctrl + center handle)
	if (dungeonEditorState.isPanning && dungeonEditorState.selectedRoom !== null) {
		const room = dungeonEditorState.rooms[dungeonEditorState.selectedRoom];
		const origRoom = dungeonEditorState.resizeStartRoom;
		const deltaX = Math.round(cell.x + cell.subX - dungeonEditorState.panStartX);
		const deltaY = Math.round(cell.y + cell.subY - dungeonEditorState.panStartY);
		
		room.x = Math.max(0, Math.min(DUNGEON_CONST.GRID_WIDTH - room.width, origRoom.x + deltaX));
		room.y = Math.max(0, Math.min(DUNGEON_CONST.GRID_HEIGHT - room.height, origRoom.y + deltaY));
		
		dungeonDrawGrid();
		return;
	}
	
	// Handle room resizing (Ctrl + corner handle)
	if (dungeonEditorState.isResizing && dungeonEditorState.selectedRoom !== null) {
		const room = dungeonEditorState.rooms[dungeonEditorState.selectedRoom];
		const origRoom = dungeonEditorState.resizeStartRoom;
		const handle = dungeonEditorState.resizeHandle;
		const mouseX = cell.x + cell.subX;
		const mouseY = cell.y + cell.subY;
		
		let newX = origRoom.x, newY = origRoom.y;
		let newWidth = origRoom.width, newHeight = origRoom.height;
		
		if (handle.includes('l')) {
			const deltaX = Math.round(mouseX - origRoom.x);
			newX = origRoom.x + deltaX;
			newWidth = origRoom.width - deltaX;
		}
		if (handle.includes('r')) {
			newWidth = Math.round(mouseX - origRoom.x);
		}
		if (handle.includes('t')) {
			const deltaY = Math.round(mouseY - origRoom.y);
			newY = origRoom.y + deltaY;
			newHeight = origRoom.height - deltaY;
		}
		if (handle.includes('b')) {
			newHeight = Math.round(mouseY - origRoom.y);
		}
		
		// Apply constraints
		if (newWidth >= 1 && newX >= 0 && newX + newWidth <= DUNGEON_CONST.GRID_WIDTH) {
			room.x = newX;
			room.width = newWidth;
		}
		if (newHeight >= 1 && newY >= 0 && newY + newHeight <= DUNGEON_CONST.GRID_HEIGHT) {
			room.y = newY;
			room.height = newHeight;
		}
		
		dungeonDrawGrid();
		return;
	}
	
	// Handle door dragging
	if (dungeonEditorState.isDraggingDoor && dungeonEditorState.draggedDoor) {
		const { room, doorIndex, originalPos } = dungeonEditorState.draggedDoor;
		const doorPos = Math.round((cell.x + cell.subX - room.x) * 2) / 2; // Snap to 0.5
		
		if (Math.abs(doorPos - originalPos) > 0.1) {
			dungeonEditorState.hasDragged = true;
		}
		
		if (doorPos >= 0 && doorPos <= room.width) {
			const door = parseDoor(room.doors[doorIndex]);
			room.doors[doorIndex] = formatDoor(door.width, doorPos);
		}
		
		dungeonDrawGrid();
		return;
	}
	
	// Handle new room drawing
	if (dungeonEditorState.isDrawing && dungeonEditorState.startCell) {
		// Clamp cell coordinates to valid grid bounds
		const clampedCellX = Math.max(0, Math.min(15, cell.x));
		const clampedCellY = Math.max(0, Math.min(18, cell.y));
		
		const startX = Math.min(dungeonEditorState.startCell.x, clampedCellX);
		const startY = Math.min(dungeonEditorState.startCell.y, clampedCellY);
		const endX = Math.max(dungeonEditorState.startCell.x, clampedCellX);
		const endY = Math.max(dungeonEditorState.startCell.y, clampedCellY);
		
		dungeonEditorState.currentRoom = {
			x: startX,
			y: startY,
			width: endX - startX + 1,
			height: endY - startY + 1,
			doors: []
		};
	}
	
	dungeonDrawGrid();
}

// Mouse up event
function dungeonGridMouseUp(event) {
	// Handle end of panning
	if (dungeonEditorState.isPanning) {
		dungeonEditorState.isPanning = false;
		dungeonEditorState.panStartX = 0;
		dungeonEditorState.panStartY = 0;
		dungeonEditorState.resizeStartRoom = null;
		dungeonSaveHistory();
		dungeonRoomsToText();
		dungeonDrawGrid();
		return;
	}
	
	// Handle end of resizing
	if (dungeonEditorState.isResizing) {
		dungeonEditorState.isResizing = false;
		dungeonEditorState.resizeHandle = null;
		dungeonEditorState.resizeStartRoom = null;
		dungeonSaveHistory();
		dungeonRoomsToText();
		dungeonDrawGrid();
		return;
	}
	
	if (dungeonEditorState.isDraggingDoor) {
		// Only save if the door was actually dragged
		if (dungeonEditorState.hasDragged) {
			dungeonSaveHistory();
			dungeonRoomsToText();
		}
		dungeonEditorState.isDraggingDoor = false;
		dungeonEditorState.draggedDoor = null;
		dungeonEditorState.dragStartX = null;
		dungeonEditorState.hasDragged = false;
	} else if (dungeonEditorState.isDrawing && dungeonEditorState.currentRoom) {
		// Add the room
		if (dungeonEditorState.currentRoom.width > 0 && dungeonEditorState.currentRoom.height > 0) {
			dungeonEditorState.rooms.push(dungeonEditorState.currentRoom);
			dungeonSaveHistory();
			dungeonRoomsToText();
		}
	}
	
	dungeonEditorState.isDrawing = false;
	dungeonEditorState.startCell = null;
	dungeonEditorState.currentRoom = null;
	dungeonDrawGrid();
}

// Toggle door on room
function dungeonToggleDoor(room, doorPos) {
	doorPos = Math.round(doorPos * 2) / 2; // Snap to 0.5
	
	// Check if space is already covered by a door
	const overlappingIndex = room.doors.findIndex(d => dungeonIsDoorHit(d, doorPos, false));
	if (overlappingIndex >= 0) return;
	
	// Check for adjacent 1-wide door to merge
	const adjacentIndex = room.doors.findIndex(d => {
		const door = parseDoor(d);
		return door.width === 1 && Math.abs(door.position - doorPos) === 1;
	});
	
	if (adjacentIndex >= 0) {
		// Merge into 2-wide door
		const adjacentDoor = parseDoor(room.doors[adjacentIndex]);
		room.doors.splice(adjacentIndex, 1);
		room.doors.push(formatDoor(2, Math.min(doorPos, adjacentDoor.position)));
	} else {
		// Add 1-wide door
		if (doorPos >= 0 && doorPos <= room.width) {
			room.doors.push(formatDoor(1, doorPos));
		}
	}
	
	room.doors.sort((a, b) => parseDoor(a).position - parseDoor(b).position);
	dungeonSaveHistory();
	dungeonDrawGrid();
}

// Empty placeholder functions (kept for compatibility)
function dungeonGridClick(event) {}
function dungeonGridHover(event) {}

// Grid right click handler
function dungeonGridRightClick(event) {
	event.preventDefault();
	const cell = dungeonGetCellFromEvent(event);
	const currentTime = Date.now();
	
	// Find room at this position
	for (let i = dungeonEditorState.rooms.length - 1; i >= 0; i--) {
		const room = dungeonEditorState.rooms[i];
		if (cell.x >= room.x && cell.x < room.x + room.width &&
			cell.y >= room.y && cell.y < room.y + room.height) {
			
			// Check for double right-click
			const isDoubleClick = 
				currentTime - dungeonEditorState.lastRightClickTime < DUNGEON_CONST.DOUBLE_CLICK_MS &&
				dungeonEditorState.lastRightClickRoom === i;
			
			if (isDoubleClick) {
				// Double right-click: delete room
				dungeonEditorState.rooms.splice(i, 1);
				if (dungeonEditorState.selectedRoom === i) {
					dungeonEditorState.selectedRoom = null;
				} else if (dungeonEditorState.selectedRoom > i) {
					dungeonEditorState.selectedRoom--;
				}
				dungeonSaveHistory();
				dungeonRoomsToText();
				dungeonEditorState.lastRightClickTime = 0;
				dungeonEditorState.lastRightClickRoom = null;
			} else {
				// Single right-click: unselect room
				dungeonEditorState.selectedRoom = null;
				dungeonDrawGrid();
				dungeonEditorState.lastRightClickTime = currentTime;
				dungeonEditorState.lastRightClickRoom = i;
			}
			return;
		}
	}
	
	// Right-click on empty space: also unselect
	dungeonEditorState.selectedRoom = null;
	dungeonDrawGrid();
}

// Toggle between visual and text mode
function dungeonToggleMode() {
	const button = document.getElementById('dungeon-mode-button');
	const visualEditor = document.getElementById('dungeon-visual-editor');
	const textEditor = document.getElementById('dungeon-text-editor');
	const visualControls = document.getElementById('dungeon-visual-controls');
	
	if (dungeonEditorState.mode === 'visual') {
		dungeonEditorState.mode = 'text';
		button.textContent = 'Current Mode: Text Editor (Press to Switch To Visual Editor)';
		visualEditor.style.display = 'none';
		visualControls.style.display = 'none';
		textEditor.style.display = 'block';
	} else {
		dungeonEditorState.mode = 'visual';
		button.textContent = 'Current Mode: Visual Editor (Press to Switch To Text Editor)';
		visualEditor.style.display = 'block';
		visualControls.style.display = 'block';
		textEditor.style.display = 'none';
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
	}
}

// Clear all rooms
function dungeonClearAll() {
	if (confirm('Are you sure you want to clear all rooms?')) {
		dungeonEditorState.rooms = [];
		dungeonEditorState.selectedRoom = null;
		dungeonSaveHistory();
		const input = document.querySelector('#dungeon-input');
		if (input) {
			input.value = '';
		}
		dungeonDrawGrid();
		dungeonEdited(); // Direct call without delay
	}
}

// Load preset dungeons
function dungeonLoadPreset(preset) {
	let presetData = '';
	let hasEntrance = true; // Default: show entrance
	
	switch(preset) {
		case 'tomb':
			// Tomb of Annihilation layout
			presetData =`0,0,16,4,2/3,2/11
0,4,8,5,2/3
0,9,8,5,2/3
8,4,8,10,2/3
0,14,16,5,2/7`;
			break;
		case 'mad':
			// Dungeon of Mad Mage layout
			presetData =`0,0,16,2,2/7
0,2,16,2,2/2,2/11
0,4,8,4,2/5
8,4,8,4,2/3
0,8,16,2,2/2,2/12
0,10,8,4,2/5
8,10,8,4,2/2
0,14,16,2,2/7
0,16,16,3,2/7`;
			break;
		case 'phandelver':
			// Lost Mine of Phandelver layout
			presetData =`0,0,16,4,2/3,2/11
0,4,8,5,1/1.5,1/5.5,1/8.5,1/12.5
8,4,8,5,
0,9,5,6,1/1.5,2/7,1/12.5
5,9,6,6
11,9,5,6
0,15,16,4,2/7`;
			break;
		case 'undercity':
			// Undercity layout
			presetData =`0,0,16,3,2/3,2/11
0,3,8,3,2/2,1/6.5
8,3,8,3,1/0.5,2/4
0,6,6,4,2/2
6,6,4,4,1/0.5,1/2.5
10,6,6,4,2/2
0,10,8,4,2/3
8,10,8,4,2/3
0,14,16,5,2/7`;
			break;
					case 'baldursgatewilderness':
			// Baldur's Gate Wilderness layout
			hasEntrance = false; // No entrance for this preset
			presetData =`0,0,16,2,1/2,1/7.5,1/13
0,2,5,2,1/2
5,2,6,2,1/1,1/4
11,2,5,2,1/2
0,4,8,2,1/2,1/6
8,4,8,2,1/1,1/5
0,6,5,3,1/2
5,6,6,3,1/1,1/4
11,6,5,3,1/2
0,9,8,2,1/2
8,9,8,2,1/5
0,11,5,2
5,11,6,2,1/1,1/4.5
11,11,5,2,1/2
0,13,8,2,1/2.5,1/6
8,13,8,2,1/1.5,1/5
0,15,5,4
5,15,6,4
11,15,5,4`;
			break;
	}
	
	const input = document.querySelector('#dungeon-input');
	const entranceCheckbox = document.querySelector('#dungeon-entrance-enabled');
	if (input) {
		input.value = presetData;
		if (entranceCheckbox) {
			entranceCheckbox.checked = hasEntrance;
		}
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
		dungeonEditedBuffer();
	}
}

// Undo/Redo functionality
function dungeonSaveHistory() {
	dungeonEditorState.history = dungeonEditorState.history.slice(0, dungeonEditorState.historyIndex + 1);
	dungeonEditorState.history.push(JSON.stringify(dungeonEditorState.rooms));
	dungeonEditorState.historyIndex++;
	
	if (dungeonEditorState.history.length > DUNGEON_CONST.HISTORY_LIMIT) {
		dungeonEditorState.history.shift();
		dungeonEditorState.historyIndex--;
	}
	
	dungeonUpdateButtons();
}

function dungeonUndo() {
	if (dungeonEditorState.historyIndex > 0) {
		dungeonEditorState.historyIndex--;
		dungeonEditorState.rooms = JSON.parse(dungeonEditorState.history[dungeonEditorState.historyIndex]);
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

function dungeonRedo() {
	if (dungeonEditorState.historyIndex < dungeonEditorState.history.length - 1) {
		dungeonEditorState.historyIndex++;
		dungeonEditorState.rooms = JSON.parse(dungeonEditorState.history[dungeonEditorState.historyIndex]);
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

// Zoom functionality
function dungeonZoomIn() {
	const maxZoom = dungeonGetMaxZoom();
	dungeonEditorState.zoom = Math.min(dungeonEditorState.zoom * 1.2, maxZoom);
	dungeonApplyZoom();
}

function dungeonZoomOut() {
	dungeonEditorState.zoom = Math.max(dungeonEditorState.zoom / 1.2, 0.5);
	dungeonApplyZoom();
}

function dungeonZoomReset() {
	dungeonEditorState.zoom = 1;
	dungeonApplyZoom();
}

function dungeonGetMaxZoom() {
	const visualEditor = document.getElementById('dungeon-visual-editor');
	if (!visualEditor) return 3;
	
	// Get the parent container width
	const containerWidth = visualEditor.parentElement.offsetWidth;
	if (!containerWidth) return 3;
	
	// Canvas width (720) + border (4) + gap (20) + min tips width (300)
	const canvas = dungeonEditorState.gridCanvas;
	if (!canvas) return 3;
	
	const borderWidth = 4;
	const gap = 20;
	const minTipsWidth = 300;
	const requiredSpace = borderWidth + gap + minTipsWidth;
	
	// Calculate max zoom that keeps tips visible
	const maxZoom = Math.max(0.5, (containerWidth - requiredSpace) / canvas.width);
	
	return Math.min(maxZoom, 2); // Cap at 2x even if there's more space
}

function dungeonApplyZoom() {
	const canvas = dungeonEditorState.gridCanvas;
	const container = document.getElementById('dungeon-canvas-container');
	if (canvas && container) {
		canvas.style.transform = `scale(${dungeonEditorState.zoom})`;
		canvas.style.transformOrigin = 'top left';
		// Set exact dimensions to prevent scrolling, accounting for 2px border on each side
		const borderWidth = 4; // 2px on each side
		container.style.width = `${(canvas.width + borderWidth) * dungeonEditorState.zoom}px`;
		container.style.height = `${(canvas.height + borderWidth) * dungeonEditorState.zoom}px`;
	}
}

function dungeonGridWheel(event) {
	event.preventDefault();
	event.deltaY < 0 ? dungeonZoomIn() : dungeonZoomOut();
}

// Keyboard handling
function dungeonHandleKeyboard(event) {
	const visualEditor = document.getElementById('dungeon-visual-editor');
	if (!visualEditor || visualEditor.style.display === 'none') return;
	if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
	
	const selected = dungeonEditorState.selectedRoom;
	const room = selected !== null ? dungeonEditorState.rooms[selected] : null;
	
	const handlers = {
		'Delete': () => selected !== null && (dungeonEditorState.rooms.splice(selected, 1), dungeonEditorState.selectedRoom = null, true),
		'Backspace': () => handlers['Delete'](),
		'Escape': () => (dungeonEditorState.selectedRoom = null, dungeonDrawGrid(), false),
		'z': () => event.ctrlKey && !event.shiftKey && (dungeonUndo(), true),
		'y': () => event.ctrlKey && (dungeonRedo(), true),
		'ArrowUp': () => event.ctrlKey && room && room.y > 0 && (room.y--, true),
		'ArrowDown': () => event.ctrlKey && room && room.y + room.height < DUNGEON_CONST.GRID_HEIGHT && (room.y++, true),
		'ArrowLeft': () => event.ctrlKey && room && room.x > 0 && (room.x--, true),
		'ArrowRight': () => event.ctrlKey && room && room.x + room.width < DUNGEON_CONST.GRID_WIDTH && (room.x++, true)
	};
	
	// Handle Ctrl+Shift+Z for redo
	if (event.key === 'z' && event.ctrlKey && event.shiftKey) {
		event.preventDefault();
		dungeonRedo();
		return;
	}
	
	const handler = handlers[event.key];
	if (handler && handler()) {
		event.preventDefault();
		dungeonSaveHistory();
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

// Update button states
function dungeonUpdateButtons() {
	const buttons = {
		'dungeon-undo-button': dungeonEditorState.historyIndex > 0,
		'dungeon-redo-button': dungeonEditorState.historyIndex < dungeonEditorState.history.length - 1
	};
	
	Object.entries(buttons).forEach(([id, enabled]) => {
		const button = document.getElementById(id);
		if (button) button.disabled = !enabled;
	});
}

// Initialize visual editor when tab is loaded
setTimeout(dungeonInitVisualEditor, 200);

