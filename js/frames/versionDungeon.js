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
		
		<h5 class='padding margin-bottom input-description' style='color: white; font-style: normal; text-align: center;'>
			<strong style='font-size: 1.2em;'>Dungeon Presets:</strong>
		</h5>
		<div style='margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;'>
			<button class='input' onclick='dungeonLoadPreset("tomb");' style='width: auto;'>Tomb of Annihilation</button>
			<button class='input' onclick='dungeonLoadPreset("mad");' style='width: auto;'>Dungeon of Mad Mage</button>
			<button class='input' onclick='dungeonLoadPreset("phandelver");' style='width: auto;'>Lost Mine of Phandelver</button>
			<button class='input' onclick='dungeonLoadPreset("undercity");' style='width: auto;'>Undercity</button>
			<button class='input' onclick='dungeonLoadPreset("baldursgatewilderness");' style='width: auto;'>Baldur's Gate Wilderness</button>
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
	
	// Load all images dynamically
	const imgPaths = {
		walls: {
			fx: ['top', 'left', 'bottom', 'right', 'topright', 'topleft', 'bottomright', 'bottomleft', 'outer'],
			shape: ['top', 'left', 'bottom', 'right', 'topright', 'topleft', 'bottomright', 'bottomleft', 'outer', 'doorway'],
			textures: ['w', 'u', 'b', 'r', 'g', 'c']
		},
		arrow: 'arrow',
		doorway: 'doorway'
	};
	
	// Load wall images
	['fx', 'shape'].forEach(type => {
		imgPaths.walls[type].forEach(pos => {
			const img = new Image();
			const varName = type === 'fx' ? `dungeonFX${pos}` : `dungeonShape${pos}`;
			setImageUrl(img, `/img/frames/dungeon/walls/${type}/${pos}.png`);
			window[varName] = img;
		});
	});
	
	// Load texture images
	imgPaths.walls.textures.forEach(color => {
		const img = new Image();
		setImageUrl(img, `/img/frames/dungeon/walls/textures/${color}.png`);
		window[`dungeonTexture${color.toUpperCase()}`] = img;
	});
	
	// Load special images
	[['dungeonDoorwayFX', 'fx/doorway'], ['dungeonDoorwayArrow', 'arrow'], ['dungeonDoorwayCutout', 'doorway']].forEach(([varName, path]) => {
		const img = new Image();
		setImageUrl(img, `/img/frames/dungeon/walls/${path}.png`);
		window[varName] = img;
	});
	
	// Load outer border images
	['dungeonOuterShape', 'dungeonOuterFX'].forEach((varName, i) => {
		const img = new Image();
		setImageUrl(img, `/img/frames/dungeon/walls/${i ? 'fx' : 'shape'}/outer.png`);
		window[varName] = img;
	});
	
	dungeonTextureC.onload = dungeonEditedBuffer;
}

// Constants - expanded with grid offsets
const DUNGEON_CONST = {
	CELL_SIZE: 40,
	GRID_WIDTH: 16,
	GRID_HEIGHT: 19,
	GRID_OFFSET: 40, // Unified offset for both X and Y
	DOOR_TOLERANCE: 0.3,
	DOOR_DRAG_TOLERANCE_1: 0.75,
	DOOR_DRAG_TOLERANCE_2: { min: -0.5, max: 1.5 },
	HISTORY_LIMIT: 50,
	DOUBLE_CLICK_MS: 300,
	HANDLE_SIZE: 10,
	CENTER_HANDLE_RADIUS: 0.2
};

// Door utilities - consolidated
const DoorUtils = {
	parse: (doorValue) => {
		if (typeof doorValue === 'string' && doorValue.includes('/')) {
			const [width, position] = doorValue.split('/');
			return { width: parseInt(width), position: parseFloat(position) };
		}
		return { width: 2, position: parseFloat(doorValue) };
	},
	format: (width, position) => `${width}/${position}`,
	isHit: (doorValue, clickPos, useDragTolerance = false) => {
		const door = DoorUtils.parse(doorValue);
		const tol = useDragTolerance ? 
			(door.width === 1 ? DUNGEON_CONST.DOOR_DRAG_TOLERANCE_1 : DUNGEON_CONST.DOOR_DRAG_TOLERANCE_2) :
			DUNGEON_CONST.DOOR_TOLERANCE;
		
		if (door.width === 1) {
			return useDragTolerance ? Math.abs(door.position - clickPos) < tol : Math.abs(door.position - clickPos) < tol;
		}
		return useDragTolerance ?
			clickPos >= door.position + tol.min && clickPos <= door.position + tol.max :
			clickPos >= door.position - tol && clickPos <= door.position + 1 + tol;
	}
};

var drawingDungeon;
function dungeonEditedBuffer() {
	clearTimeout(drawingDungeon);
	drawingDungeon = setTimeout(dungeonEdited, 500);
}

function dungeonEdited() {
	const input = document.querySelector('#dungeon-input');
	const entranceEnabled = document.querySelector('#dungeon-entrance-enabled').checked;
	let data = input.value.startsWith('NOENTRANCE\n') ? input.value.substring(11) : input.value;
	
	// Parse rooms
	const rooms = data.replace(/ /g, '').split('\n').map(room => {
		const parts = room.split(',');
		return [
			parseInt(parts[0]), parseInt(parts[1]),
			parseInt(parts[2]) - 1, parseInt(parts[3]) - 1,
			...parts.slice(4).map(DoorUtils.parse)
		];
	}).filter(room => room.length >= 4 && !isNaN(room[0]));
	
	// Initialize canvas
	const cellSize = scaleHeight(0.0381);
	const origX = scaleX(0.0734);
	const origY = scaleY(0.1377);
	
	dungeonContext.clearRect(0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonFXContext.clearRect(0, 0, dungeonFXCanvas.width, dungeonFXCanvas.height);
	
	// Draw rooms
	rooms.forEach(room => dungeonDrawRoomWalls(room, cellSize, origX, origY));
	
	// Outer border
	const borderAdj = [-2, -5];
	[dungeonOuterShape, dungeonOuterFX].forEach((img, i) => {
		const ctx = i ? dungeonFXContext : dungeonContext;
		ctx.drawImage(img, 0, 0, dungeonCanvas.width + borderAdj[0], dungeonCanvas.height + borderAdj[1]);
	});
	
	// Text
	const textObjects = {
		title: {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'white', align:'center'}
	};
	
	rooms.forEach((room, i) => {
		const roomNumber = i + 1;
		let text = `Room ${roomNumber}{lns}{fontmplantin}{fontsize-8}Effect.`;
		if (room[3] < 3) text = text.replace('{lns}', '   ');
		
		textObjects[`dungeonRoom${roomNumber}`] = {
			name: `Dungeon Room ${roomNumber}`, text,
			x: (origX + cellSize * (room[0] + 0.5)) / card.width,
			y: (origY + cellSize * (room[1] + 0.5)) / card.height,
			width: (cellSize * room[2]) / card.width,
			height: (cellSize * room[3]) / card.height,
			font: 'belerenb', size: 0.0324, align: 'center'
		};
	});
	
	// Add entrance if enabled
	if (entranceEnabled && rooms.length > 0) {
		rooms.push([0, -2, 16, 1, {width: 2, position: 7}]);
	}
	
	// Draw doorways
	rooms.forEach(room => room.slice(4).forEach(doorway => 
		dungeonDrawDoorway(room, doorway, cellSize, origX, origY)
	));
	
	// Apply textures and FX
	dungeonContext.globalCompositeOperation = 'source-in';
	dungeonContext.drawImage(window[`dungeonTexture${document.querySelector('#dungeon-color').value}`], 
		0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonContext.globalCompositeOperation = 'source-over';
	dungeonContext.drawImage(dungeonFXCanvas, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	
	loadTextOptions(textObjects);
	drawTextBuffer();
}

// Consolidated drawing functions
function dungeonDrawRoomWalls(room, cellSize, origX, origY) {
	const [x, y, w, h] = room;
	const drawPiece = (type, px, py) => {
		[dungeonContext, dungeonFXContext].forEach((ctx, i) => {
			ctx.drawImage(window[`dungeon${i ? 'FX' : 'Shape'}${type}`], 
				origX + cellSize * px, origY + cellSize * py, cellSize, cellSize);
		});
	};
	
	// Corners
	[['topleft', x, y], ['topright', x+w, y], ['bottomleft', x, y+h], ['bottomright', x+w, y+h]]
		.forEach(([type, cx, cy]) => drawPiece(type, cx, cy));
	
	// Walls
	for (let i = 1; i < w; i++) { drawPiece('top', x+i, y); drawPiece('bottom', x+i, y+h); }
	for (let i = 1; i < h; i++) { drawPiece('left', x, y+i); drawPiece('right', x+w, y+i); }
}

function dungeonDrawDoorway(room, doorway, cellSize, origX, origY) {
	const is1Wide = doorway.width === 1;
	const isFinalExit = room[1] + room[3] === 18;
	const doorWidth = cellSize * (is1Wide ? 1.5 : 3);
	const heightMult = (is1Wide && !isFinalExit) ? 2 : 1;
	const doorHeight = dungeonDoorwayCutout.height * (doorWidth / dungeonDoorwayCutout.width) * heightMult;
	const doorX = origX + cellSize * (room[0] + doorway.position - 0.5) + (is1Wide ? 30 : 3);
	const doorY = origY + cellSize * (room[1] + room[3]);
	
	// Cutout
	[dungeonContext, dungeonFXContext].forEach(ctx => {
		ctx.globalCompositeOperation = 'destination-out';
		ctx.drawImage(dungeonDoorwayCutout, doorX, doorY, doorWidth, doorHeight);
		ctx.globalCompositeOperation = 'source-over';
	});
	
	// Shape and FX
	dungeonContext.drawImage(dungeonShapedoorway, doorX, doorY, doorWidth, doorHeight);
	dungeonFXContext.drawImage(dungeonDoorwayFX, doorX, doorY, doorWidth, doorHeight);
	
	// Arrow
	if (room[1] !== -2 && !isFinalExit) {
		dungeonFXContext.drawImage(dungeonDoorwayArrow, 
			origX + cellSize * (room[0] + doorway.position + 0.5) + (is1Wide ? -37 : 15),
			origY + cellSize * (room[1] + room[3] + 0.5) + 10);
	}
}

// Visual editor state
var dungeonEditorState = {
	mode: 'visual', gridCanvas: null, gridCtx: null,
	isDrawing: false, startCell: null, currentRoom: null, hoveredCell: null,
	rooms: [], isDraggingDoor: false, draggedDoor: null, dragStartX: null,
	lastClickTime: 0, lastClickDoor: null, hasDragged: false,
	lastRightClickTime: 0, lastRightClickRoom: null,
	selectedRoom: null, history: [], historyIndex: -1,
	zoom: 1, panX: 0, panY: 0,
	isPanning: false, panStartX: 0, panStartY: 0,
	isResizing: false, resizeHandle: null, resizeStartRoom: null
};

// Initialize visual editor
function dungeonInitVisualEditor() {
	setTimeout(() => {
		dungeonEditorState.gridCanvas = document.getElementById('dungeon-grid-canvas');
		if (!dungeonEditorState.gridCanvas) return;
		
		dungeonEditorState.gridCtx = dungeonEditorState.gridCanvas.getContext('2d');
		dungeonParseRoomsFromText();
		dungeonSaveHistory();
		dungeonDrawGrid();
		
		// Register event listeners
		const events = {
			mousedown: dungeonGridMouseDown, mousemove: dungeonGridMouseMove,
			mouseup: dungeonGridMouseUp, mouseleave: dungeonGridMouseUp,
			wheel: dungeonGridWheel
		};
		Object.entries(events).forEach(([event, handler]) => 
			dungeonEditorState.gridCanvas.addEventListener(event, handler)
		);
		document.addEventListener('keydown', dungeonHandleKeyboard);
	}, 100);
}

// Parse rooms from text
function dungeonParseRoomsFromText() {
	const input = document.querySelector('#dungeon-input');
	if (!input) return;
	
	dungeonEditorState.rooms = input.value.split('\n')
		.filter(line => line.trim())
		.map(line => {
			const parts = line.replace(/ /g, '').split(',');
			return parts.length >= 4 ? {
				x: Number(parts[0]), y: Number(parts[1]),
				width: Number(parts[2]), height: Number(parts[3]),
				doors: parts.slice(4).map(d => d.includes('/') ? d : Number(d))
			} : null;
		})
		.filter(Boolean);
}

// Convert rooms to text
function dungeonRoomsToText() {
	const input = document.querySelector('#dungeon-input');
	if (!input) return;
	
	input.value = dungeonEditorState.rooms
		.map(room => [room.x, room.y, room.width, room.height, ...room.doors].join(','))
		.join('\n');
	dungeonEditedBuffer();
}

// Draw grid - significantly simplified
function dungeonDrawGrid() {
	if (!dungeonEditorState.gridCtx) return;
	
	const { gridCanvas: canvas, gridCtx: ctx, rooms, selectedRoom, currentRoom, hoveredCell, isDraggingDoor, draggedDoor } = dungeonEditorState;
	const { CELL_SIZE: cellSize, GRID_WIDTH: gridWidth, GRID_HEIGHT: gridHeight, GRID_OFFSET: offset } = DUNGEON_CONST;
	const showCoords = document.getElementById('dungeon-show-coords')?.checked ?? true;
	
	// Clear
	ctx.fillStyle = '#1a1a1a';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw coordinates
	if (showCoords) {
		ctx.fillStyle = '#666';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		for (let i = 0; i < gridWidth; i++) {
			const x = offset + (i + 0.5) * cellSize;
			ctx.fillText(i, x, offset / 2);
			ctx.fillText(i, x, offset + gridHeight * cellSize + offset / 2);
		}
		for (let i = 0; i < gridHeight; i++) {
			const y = offset + (i + 0.5) * cellSize;
			ctx.fillText(i, offset / 2, y);
			ctx.fillText(i, offset + gridWidth * cellSize + offset / 2, y);
		}
	}
	
	// Draw grid lines
	['horizontal', 'vertical'].forEach(dir => {
		const max = dir === 'horizontal' ? gridHeight : gridWidth;
		for (let i = 0; i <= max; i++) {
			ctx.strokeStyle = i % 4 === 0 ? '#444' : '#333';
			ctx.lineWidth = i % 4 === 0 ? 1.5 : 1;
			ctx.beginPath();
			if (dir === 'horizontal') {
				ctx.moveTo(offset, offset + i * cellSize);
				ctx.lineTo(offset + gridWidth * cellSize, offset + i * cellSize);
			} else {
				ctx.moveTo(offset + i * cellSize, offset);
				ctx.lineTo(offset + i * cellSize, offset + gridHeight * cellSize);
			}
			ctx.stroke();
		}
	});
	
	// Draw rooms
	rooms.forEach((room, index) => {
		const isSelected = selectedRoom === index;
		const rx = offset + room.x * cellSize;
		const ry = offset + room.y * cellSize;
		const rw = room.width * cellSize;
		const rh = room.height * cellSize;
		
		// Fill
		if (isSelected) {
			const gradient = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
			gradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
			gradient.addColorStop(1, 'rgba(255, 150, 50, 0.3)');
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
		}
		ctx.fillRect(rx, ry, rw, rh);
		
		// Border
		ctx.strokeStyle = isSelected ? '#ffa500' : '#6496c8';
		ctx.lineWidth = isSelected ? 3 : 2;
		ctx.strokeRect(rx, ry, rw, rh);
		
		// Room number
		const textX = rx + rw / 2;
		const textY = ry + rh / 2;
		ctx.fillStyle = isSelected ? 'rgba(255, 165, 0, 0.8)' : 'rgba(100, 150, 200, 0.8)';
		ctx.beginPath();
		ctx.arc(textX, textY, 14, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 16px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${index + 1}`, textX, textY);
		
		// Handles for selected room
		if (isSelected) {
			const handleSize = DUNGEON_CONST.HANDLE_SIZE;
			[[room.x, room.y], [room.x + room.width, room.y], [room.x, room.y + room.height], [room.x + room.width, room.y + room.height]]
				.forEach(([x, y]) => {
					ctx.fillStyle = '#ffa500';
					ctx.strokeStyle = '#fff';
					ctx.lineWidth = 2;
					ctx.fillRect(offset + x * cellSize - handleSize/2, offset + y * cellSize - handleSize/2, handleSize, handleSize);
					ctx.strokeRect(offset + x * cellSize - handleSize/2, offset + y * cellSize - handleSize/2, handleSize, handleSize);
				});
			
			// Center handle
			ctx.fillStyle = '#00aaff';
			ctx.beginPath();
			ctx.arc(textX, textY, 8, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
		
		// Doors
		room.doors.forEach((doorPos, doorIndex) => {
			const door = DoorUtils.parse(doorPos);
			const doorWidth = cellSize * door.width;
			const doorX = offset + (room.x + door.position) * cellSize;
			const doorY = offset + (room.y + room.height) * cellSize;
			const isDragging = isDraggingDoor && draggedDoor?.room === room && draggedDoor?.doorIndex === doorIndex;
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.fillRect(doorX, doorY - 4, doorWidth, 8);
			ctx.fillStyle = door.width === 1 ? '#ffcc00' : '#4CAF50';
			ctx.fillRect(doorX, doorY - 5, doorWidth, 10);
			ctx.strokeStyle = isDragging ? '#00aaff' : '#fff';
			ctx.lineWidth = isDragging ? 3 : 1;
			ctx.strokeRect(doorX, doorY - 5, doorWidth, 10);
		});
	});
	
	// Current drawing room
	if (dungeonEditorState.isDrawing && currentRoom) {
		ctx.fillStyle = 'rgba(150, 200, 100, 0.3)';
		ctx.fillRect(offset + currentRoom.x * cellSize, offset + currentRoom.y * cellSize, currentRoom.width * cellSize, currentRoom.height * cellSize);
		ctx.strokeStyle = '#96c864';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(offset + currentRoom.x * cellSize, offset + currentRoom.y * cellSize, currentRoom.width * cellSize, currentRoom.height * cellSize);
		ctx.setLineDash([]);
	}
	
	// Hovered cell
	if (hoveredCell) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.fillRect(offset + hoveredCell.x * cellSize, offset + hoveredCell.y * cellSize, cellSize, cellSize);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		ctx.fillRect(offset + hoveredCell.x * cellSize + 2, offset + hoveredCell.y * cellSize + 2, 32, 18);
		ctx.fillStyle = '#fff';
		ctx.font = '10px Arial';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(`${hoveredCell.x},${hoveredCell.y}`, offset + hoveredCell.x * cellSize + 5, offset + hoveredCell.y * cellSize + 5);
	}
	
	dungeonUpdateButtons();
}

// Get cell from mouse event
function dungeonGetCellFromEvent(event) {
	const canvas = dungeonEditorState.gridCanvas;
	const rect = canvas.getBoundingClientRect();
	const x = (event.clientX - rect.left) * (canvas.width / rect.width) - DUNGEON_CONST.GRID_OFFSET;
	const y = (event.clientY - rect.top) * (canvas.height / rect.height) - DUNGEON_CONST.GRID_OFFSET;
	const cellSize = DUNGEON_CONST.CELL_SIZE;
	
	return {
		x: Math.floor(x / cellSize), y: Math.floor(y / cellSize),
		subX: (x % cellSize) / cellSize, subY: (y % cellSize) / cellSize,
		pixelX: x, pixelY: y
	};
}

// Check resize handle or center handle
function dungeonGetResizeHandle(cell, room) {
	const handleSize = DUNGEON_CONST.HANDLE_SIZE / DUNGEON_CONST.CELL_SIZE;
	const corners = { tl: [room.x, room.y], tr: [room.x + room.width, room.y], 
		bl: [room.x, room.y + room.height], br: [room.x + room.width, room.y + room.height] };
	
	for (let [handle, [x, y]] of Object.entries(corners)) {
		if (Math.abs(cell.x + cell.subX - x) < handleSize && Math.abs(cell.y + cell.subY - y) < handleSize) return handle;
	}
	return null;
}

function dungeonIsClickingCenterHandle(cell, room) {
	const dx = (cell.x + cell.subX) - (room.x + room.width / 2);
	const dy = (cell.y + cell.subY) - (room.y + room.height / 2);
	return Math.sqrt(dx * dx + dy * dy) < DUNGEON_CONST.CENTER_HANDLE_RADIUS;
}

// Unified mouse handler
function dungeonGridMouseDown(event) {
	if (event.button !== 0) return;
	
	const cell = dungeonGetCellFromEvent(event);
	const currentTime = Date.now();
	const state = dungeonEditorState;
	
	// Selected room operations
	if (state.selectedRoom !== null) {
		const room = state.rooms[state.selectedRoom];
		
		if (dungeonIsClickingCenterHandle(cell, room)) {
			state.isPanning = true;
			state.panStartX = cell.x + cell.subX;
			state.panStartY = cell.y + cell.subY;
			state.resizeStartRoom = JSON.parse(JSON.stringify(room));
			event.preventDefault();
			return;
		}
		
		const handle = dungeonGetResizeHandle(cell, room);
		if (handle) {
			state.isResizing = true;
			state.resizeHandle = handle;
			state.resizeStartRoom = JSON.parse(JSON.stringify(room));
			event.preventDefault();
			return;
		}
	}
	
	// Door operations (if no room selected)
	if (state.selectedRoom === null) {
		for (let room of state.rooms) {
			const bottomY = room.y + room.height;
			const clickY = cell.y + cell.subY;
			
			if (clickY >= bottomY - DUNGEON_CONST.DOOR_TOLERANCE && clickY <= bottomY + DUNGEON_CONST.DOOR_TOLERANCE && 
				cell.x >= room.x - 0.5 && cell.x <= room.x + room.width + 0.5) {
				
				const doorPos = cell.x + cell.subX - room.x;
				const doorIndex = room.doors.findIndex(d => DoorUtils.isHit(d, doorPos, true));
				
				if (doorIndex >= 0) {
					const isDoubleClick = currentTime - state.lastClickTime < DUNGEON_CONST.DOUBLE_CLICK_MS &&
						state.lastClickDoor?.room === room && state.lastClickDoor?.doorIndex === doorIndex;
					
					if (isDoubleClick) {
						room.doors.splice(doorIndex, 1);
						dungeonRoomsToText();
						dungeonDrawGrid();
						state.lastClickTime = 0;
						state.lastClickDoor = null;
						return;
					} else {
						const door = DoorUtils.parse(room.doors[doorIndex]);
						state.isDraggingDoor = true;
						state.draggedDoor = { room, doorIndex, originalPos: door.position };
						state.dragStartX = doorPos;
						state.hasDragged = false;
						state.lastClickTime = currentTime;
						state.lastClickDoor = { room, doorIndex };
						return;
					}
				} else {
					dungeonToggleDoor(room, doorPos);
					dungeonRoomsToText();
					state.lastClickTime = 0;
					state.lastClickDoor = null;
					return;
				}
			}
		}
	}
	
	// Room selection
	for (let i = state.rooms.length - 1; i >= 0; i--) {
		const room = state.rooms[i];
		if (cell.x >= room.x && cell.x < room.x + room.width && cell.y >= room.y && cell.y < room.y + room.height) {
			state.selectedRoom = i;
			dungeonDrawGrid();
			return;
		}
	}
	
	// Start new room
	state.selectedRoom = null;
	if (cell.x >= 0 && cell.x < DUNGEON_CONST.GRID_WIDTH && cell.y >= 0 && cell.y < DUNGEON_CONST.GRID_HEIGHT) {
		state.isDrawing = true;
		state.startCell = cell;
		state.currentRoom = { x: cell.x, y: cell.y, width: 1, height: 1, doors: [] };
		dungeonDrawGrid();
	}
}

function dungeonGridMouseMove(event) {
	const cell = dungeonGetCellFromEvent(event);
	const state = dungeonEditorState;
	state.hoveredCell = cell;
	
	// Panning
	if (state.isPanning && state.selectedRoom !== null) {
		const room = state.rooms[state.selectedRoom];
		const origRoom = state.resizeStartRoom;
		const deltaX = Math.round(cell.x + cell.subX - state.panStartX);
		const deltaY = Math.round(cell.y + cell.subY - state.panStartY);
		room.x = Math.max(0, Math.min(DUNGEON_CONST.GRID_WIDTH - room.width, origRoom.x + deltaX));
		room.y = Math.max(0, Math.min(DUNGEON_CONST.GRID_HEIGHT - room.height, origRoom.y + deltaY));
		dungeonDrawGrid();
		return;
	}
	
	// Resizing
	if (state.isResizing && state.selectedRoom !== null) {
		const room = state.rooms[state.selectedRoom];
		const origRoom = state.resizeStartRoom;
		const handle = state.resizeHandle;
		const mouseX = cell.x + cell.subX;
		const mouseY = cell.y + cell.subY;
		
		let newX = origRoom.x, newY = origRoom.y, newWidth = origRoom.width, newHeight = origRoom.height;
		
		if (handle.includes('l')) { const deltaX = Math.round(mouseX - origRoom.x); newX = origRoom.x + deltaX; newWidth = origRoom.width - deltaX; }
		if (handle.includes('r')) newWidth = Math.round(mouseX - origRoom.x);
		if (handle.includes('t')) { const deltaY = Math.round(mouseY - origRoom.y); newY = origRoom.y + deltaY; newHeight = origRoom.height - deltaY; }
		if (handle.includes('b')) newHeight = Math.round(mouseY - origRoom.y);
		
		if (newWidth >= 1 && newX >= 0 && newX + newWidth <= DUNGEON_CONST.GRID_WIDTH) { room.x = newX; room.width = newWidth; }
		if (newHeight >= 1 && newY >= 0 && newY + newHeight <= DUNGEON_CONST.GRID_HEIGHT) { room.y = newY; room.height = newHeight; }
		
		dungeonDrawGrid();
		return;
	}
	
	// Door dragging
	if (state.isDraggingDoor && state.draggedDoor) {
		const { room, doorIndex, originalPos } = state.draggedDoor;
		const doorPos = Math.round((cell.x + cell.subX - room.x) * 2) / 2;
		if (Math.abs(doorPos - originalPos) > 0.1) state.hasDragged = true;
		if (doorPos >= 0 && doorPos <= room.width) {
			const door = DoorUtils.parse(room.doors[doorIndex]);
			room.doors[doorIndex] = DoorUtils.format(door.width, doorPos);
		}
		dungeonDrawGrid();
		return;
	}
	
	// Room drawing
	if (state.isDrawing && state.startCell) {
		const clampedX = Math.max(0, Math.min(15, cell.x));
		const clampedY = Math.max(0, Math.min(18, cell.y));
		const startX = Math.min(state.startCell.x, clampedX);
		const startY = Math.min(state.startCell.y, clampedY);
		state.currentRoom = {
			x: startX, y: startY,
			width: Math.max(state.startCell.x, clampedX) - startX + 1,
			height: Math.max(state.startCell.y, clampedY) - startY + 1,
			doors: []
		};
	}
	
	dungeonDrawGrid();
}

function dungeonGridMouseUp(event) {
	const state = dungeonEditorState;
	
	if (state.isPanning || state.isResizing) {
		state.isPanning = state.isResizing = false;
		state.panStartX = state.panStartY = 0;
		state.resizeHandle = state.resizeStartRoom = null;
		dungeonSaveHistory();
		dungeonRoomsToText();
		dungeonDrawGrid();
		return;
	}
	
	if (state.isDraggingDoor) {
		if (state.hasDragged) { dungeonSaveHistory(); dungeonRoomsToText(); }
		state.isDraggingDoor = false;
		state.draggedDoor = state.dragStartX = null;
		state.hasDragged = false;
	} else if (state.isDrawing && state.currentRoom?.width > 0 && state.currentRoom?.height > 0) {
		state.rooms.push(state.currentRoom);
		dungeonSaveHistory();
		dungeonRoomsToText();
	}
	
	state.isDrawing = false;
	state.startCell = state.currentRoom = null;
	dungeonDrawGrid();
}

// Toggle door
function dungeonToggleDoor(room, doorPos) {
	doorPos = Math.round(doorPos * 2) / 2;
	if (room.doors.some(d => DoorUtils.isHit(d, doorPos, false))) return;
	
	const adjacentIndex = room.doors.findIndex(d => {
		const door = DoorUtils.parse(d);
		return door.width === 1 && Math.abs(door.position - doorPos) === 1;
	});
	
	if (adjacentIndex >= 0) {
		const adjacentDoor = DoorUtils.parse(room.doors[adjacentIndex]);
		room.doors.splice(adjacentIndex, 1);
		room.doors.push(DoorUtils.format(2, Math.min(doorPos, adjacentDoor.position)));
	} else if (doorPos >= 0 && doorPos <= room.width) {
		room.doors.push(DoorUtils.format(1, doorPos));
	}
	
	room.doors.sort((a, b) => DoorUtils.parse(a).position - DoorUtils.parse(b).position);
	dungeonSaveHistory();
	dungeonDrawGrid();
}

// Placeholder functions
function dungeonGridClick(event) {}
function dungeonGridHover(event) {}

// Right click
function dungeonGridRightClick(event) {
	event.preventDefault();
	const cell = dungeonGetCellFromEvent(event);
	const currentTime = Date.now();
	const state = dungeonEditorState;
	
	for (let i = state.rooms.length - 1; i >= 0; i--) {
		const room = state.rooms[i];
		if (cell.x >= room.x && cell.x < room.x + room.width && cell.y >= room.y && cell.y < room.y + room.height) {
			const isDoubleClick = currentTime - state.lastRightClickTime < DUNGEON_CONST.DOUBLE_CLICK_MS && state.lastRightClickRoom === i;
			
			if (isDoubleClick) {
				state.rooms.splice(i, 1);
				if (state.selectedRoom === i) state.selectedRoom = null;
				else if (state.selectedRoom > i) state.selectedRoom--;
				dungeonSaveHistory();
				dungeonRoomsToText();
				state.lastRightClickTime = 0;
				state.lastRightClickRoom = null;
			} else {
				state.selectedRoom = null;
				dungeonDrawGrid();
				state.lastRightClickTime = currentTime;
				state.lastRightClickRoom = i;
			}
			return;
		}
	}
	
	state.selectedRoom = null;
	dungeonDrawGrid();
}

// Mode toggle
function dungeonToggleMode() {
	const state = dungeonEditorState;
	const button = document.getElementById('dungeon-mode-button');
	const visualEditor = document.getElementById('dungeon-visual-editor');
	const textEditor = document.getElementById('dungeon-text-editor');
	const visualControls = document.getElementById('dungeon-visual-controls');
	
	if (state.mode === 'visual') {
		state.mode = 'text';
		button.textContent = 'Current Mode: Text Editor (Press to Switch To Visual Editor)';
		visualEditor.style.display = 'none';
		visualControls.style.display = 'none';
		textEditor.style.display = 'block';
	} else {
		state.mode = 'visual';
		button.textContent = 'Current Mode: Visual Editor (Press to Switch To Text Editor)';
		visualEditor.style.display = 'block';
		visualControls.style.display = 'block';
		textEditor.style.display = 'none';
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
	}
}

// Clear all
function dungeonClearAll() {
	if (confirm('Are you sure you want to clear all rooms?')) {
		dungeonEditorState.rooms = [];
		dungeonEditorState.selectedRoom = null;
		dungeonSaveHistory();
		const input = document.querySelector('#dungeon-input');
		if (input) input.value = '';
		dungeonDrawGrid();
		dungeonEdited();
	}
}

// Load presets
function dungeonLoadPreset(preset) {
	const presets = {
		tomb: { data: `0,0,16,4,2/3,2/11\n0,4,8,5,2/3\n0,9,8,5,2/3\n8,4,8,10,2/3\n0,14,16,5,2/7`, entrance: true },
		mad: { data: `0,0,16,2,2/7\n0,2,16,2,2/2,2/11\n0,4,8,4,2/5\n8,4,8,4,2/3\n0,8,16,2,2/2,2/12\n0,10,8,4,2/5\n8,10,8,4,2/2\n0,14,16,2,2/7\n0,16,16,3,2/7`, entrance: true },
		phandelver: { data: `0,0,16,4,2/3,2/11\n0,4,8,5,1/1.5,1/5.5,1/8.5,1/12.5\n8,4,8,5,\n0,9,5,6,1/1.5,2/7,1/12.5\n5,9,6,6\n11,9,5,6\n0,15,16,4,2/7`, entrance: true },
		undercity: { data: `0,0,16,3,2/3,2/11\n0,3,8,3,2/2,1/6.5\n8,3,8,3,1/0.5,2/4\n0,6,6,4,2/2\n6,6,4,4,1/0.5,1/2.5\n10,6,6,4,2/2\n0,10,8,4,2/3\n8,10,8,4,2/3\n0,14,16,5,2/7`, entrance: true },
		baldursgatewilderness: { data: `0,0,16,2,1/2,1/7.5,1/13\n0,2,5,2,1/2\n5,2,6,2,1/1,1/4\n11,2,5,2,1/2\n0,4,8,2,1/2,1/6\n8,4,8,2,1/1,1/5\n0,6,5,3,1/2\n5,6,6,3,1/1,1/4\n11,6,5,3,1/2\n0,9,8,2,1/2\n8,9,8,2,1/5\n0,11,5,2\n5,11,6,2,1/1,1/4.5\n11,11,5,2,1/2\n0,13,8,2,1/2.5,1/6\n8,13,8,2,1/1.5,1/5\n0,15,5,4\n5,15,6,4\n11,15,5,4`, entrance: false }
	};
	
	const config = presets[preset];
	if (!config) return;
	
	const input = document.querySelector('#dungeon-input');
	const entranceCheckbox = document.querySelector('#dungeon-entrance-enabled');
	if (input) {
		input.value = config.data;
		if (entranceCheckbox) entranceCheckbox.checked = config.entrance;
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
		dungeonEditedBuffer();
	}
}

// History
function dungeonSaveHistory() {
	const state = dungeonEditorState;
	state.history = state.history.slice(0, state.historyIndex + 1);
	state.history.push(JSON.stringify(state.rooms));
	if (state.history.length > DUNGEON_CONST.HISTORY_LIMIT) {
		state.history.shift();
		state.historyIndex--;
	}
	state.historyIndex++;
	dungeonUpdateButtons();
}

function dungeonUndo() {
	const state = dungeonEditorState;
	if (state.historyIndex > 0) {
		state.historyIndex--;
		state.rooms = JSON.parse(state.history[state.historyIndex]);
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

function dungeonRedo() {
	const state = dungeonEditorState;
	if (state.historyIndex < state.history.length - 1) {
		state.historyIndex++;
		state.rooms = JSON.parse(state.history[state.historyIndex]);
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

// Zoom
function dungeonZoomIn() { dungeonEditorState.zoom = Math.min(dungeonEditorState.zoom * 1.2, dungeonGetMaxZoom()); dungeonApplyZoom(); }
function dungeonZoomOut() { dungeonEditorState.zoom = Math.max(dungeonEditorState.zoom / 1.2, 0.5); dungeonApplyZoom(); }
function dungeonZoomReset() { dungeonEditorState.zoom = 1; dungeonApplyZoom(); }

function dungeonGetMaxZoom() {
	const visualEditor = document.getElementById('dungeon-visual-editor');
	if (!visualEditor) return 3;
	const containerWidth = visualEditor.parentElement.offsetWidth;
	const canvas = dungeonEditorState.gridCanvas;
	if (!containerWidth || !canvas) return 3;
	return Math.min(Math.max(0.5, (containerWidth - 324) / canvas.width), 2);
}

function dungeonApplyZoom() {
	const canvas = dungeonEditorState.gridCanvas;
	const container = document.getElementById('dungeon-canvas-container');
	if (canvas && container) {
		canvas.style.transform = `scale(${dungeonEditorState.zoom})`;
		container.style.width = `${(canvas.width + 4) * dungeonEditorState.zoom}px`;
		container.style.height = `${(canvas.height + 4) * dungeonEditorState.zoom}px`;
	}
}

function dungeonGridWheel(event) {
	event.preventDefault();
	event.deltaY < 0 ? dungeonZoomIn() : dungeonZoomOut();
}

// Keyboard
function dungeonHandleKeyboard(event) {
	const visualEditor = document.getElementById('dungeon-visual-editor');
	if (!visualEditor || visualEditor.style.display === 'none') return;
	if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
	
	const state = dungeonEditorState;
	const selected = state.selectedRoom;
	const room = selected !== null ? state.rooms[selected] : null;
	
	const handlers = {
		'Delete': () => selected !== null && (state.rooms.splice(selected, 1), state.selectedRoom = null, true),
		'Backspace': () => handlers['Delete'](),
		'Escape': () => (state.selectedRoom = null, dungeonDrawGrid(), false),
		'z': () => event.ctrlKey && !event.shiftKey && (dungeonUndo(), true),
		'y': () => event.ctrlKey && (dungeonRedo(), true),
		'ArrowUp': () => event.ctrlKey && room && room.y > 0 && (room.y--, true),
		'ArrowDown': () => event.ctrlKey && room && room.y + room.height < DUNGEON_CONST.GRID_HEIGHT && (room.y++, true),
		'ArrowLeft': () => event.ctrlKey && room && room.x > 0 && (room.x--, true),
		'ArrowRight': () => event.ctrlKey && room && room.x + room.width < DUNGEON_CONST.GRID_WIDTH && (room.x++, true)
	};
	
	if (event.key === 'z' && event.ctrlKey && event.shiftKey) { event.preventDefault(); dungeonRedo(); return; }
	
	const handler = handlers[event.key];
	if (handler && handler()) {
		event.preventDefault();
		dungeonSaveHistory();
		dungeonRoomsToText();
		dungeonDrawGrid();
	}
}

// Update buttons
function dungeonUpdateButtons() {
	const state = dungeonEditorState;
	['undo', 'redo'].forEach(action => {
		const button = document.getElementById(`dungeon-${action}-button`);
		if (button) {
			button.disabled = action === 'undo' ? state.historyIndex <= 0 : state.historyIndex >= state.history.length - 1;
		}
	});
}

setTimeout(dungeonInitVisualEditor, 200);