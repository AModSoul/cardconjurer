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
		<h5 class='padding margin-bottom input-description'>Dungeon Designer</h5>
		
		<div style='margin-bottom: 10px;'>
			<button class='input' onclick='dungeonLoadPreset("tomb");' style='margin-right: 5px;'>Load: Tomb of Annihilation</button>
			<button class='input' onclick='dungeonLoadPreset("mad");' style='margin-right: 5px;'>Load: Dungeon of Mad Mage</button>
			<button class='input' onclick='dungeonLoadPreset("phandelver");'>Load: Lost Mine of Phandelver</button>
			<button class='input' onclick='dungeonLoadPreset("undercity");'>Load: Undercity</button>
			<button class='input' onclick='dungeonLoadPreset("baldursgatewilderness");'>Load: Baldur's Gate Wilderness</button>
		</div>
		
		<div style='margin-bottom: 10px;'>
			<button class='input' onclick='dungeonClearAll();' style='margin-right: 5px;'>Clear All Rooms</button>
			<button class='input' onclick='dungeonToggleMode();' id='dungeon-mode-button'>Mode: Visual Editor</button>
		</div>
		
		<div id='dungeon-visual-editor' style='margin-bottom: 10px;'>
			<canvas id='dungeon-grid-canvas' width='640' height='760' 
				style='border: 2px solid #666; background: #1a1a1a; cursor: crosshair; display: block; max-width: 100%;'
				onclick='dungeonGridClick(event);'
				onmousemove='dungeonGridHover(event);'
				oncontextmenu='event.preventDefault(); dungeonGridRightClick(event);'>
			</canvas>
			<h5 class='padding margin-bottom input-description' style='color: white; font-style: normal;'>
				<strong>Visual Editor:</strong><br>
				• Left-click and drag to create a room<br>
				• Right-click a room to delete it<br>
				• Click on room edges to add doors (1 cells wide)<br>
				• Click right side of a single door to make a double door (2 cells wide)<br>
				• Click & Drag doors to reposition them<br>
				• Doors snap to 0.5 cell increments<br>
				• Double click a door to remove it<br>
			</h5>
		</div>
		
		<div id='dungeon-text-editor' style='display: none;'>
			<h5 class='padding margin-bottom input-description' style='font-size: 0.9em;'>
				Advanced: Edit room data directly<br>
				Format: X,Y,Width,Height,Door-1,Door-2,...<br>
				Each room on a new line. Coordinates are in grid cells (0-15 horizontal, 0-18 vertical).
			</h5>
			<textarea id='dungeon-input' class='input margin-bottom' oninput='dungeonEditedBuffer();' style='font-family: monospace; min-height: 200px;'>0,0,16,2,3,11
0,2,8,4,1.5,5.5
8,2,8,4,0.5,4.5
0,6,5,5,1.5
5,6,6,5,0.5,3.5
11,6,5,5,1.5
0,11,8,4,3
8,11,8,4,3
0,15,16,4,7</textarea>
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

var drawingDungeon;
function dungeonEditedBuffer() {
	clearTimeout(drawingDungeon);
	drawingDungeon = setTimeout(dungeonEdited, 500);
}

function dungeonEdited() {
	//gather data
	data = document.querySelector('#dungeon-input').value;
	rooms = [];
	var skipEntrance = false; // Flag to skip entrance for certain dungeons
	
	// Check if data starts with special marker to skip entrance
	if (data.startsWith('NOENTRANCE\n')) {
		skipEntrance = true;
		data = data.substring(11); // Remove the marker
	}
	
	data.replace(/ /g, '').split('\n').forEach(room => {
		newRoom = room.split(',');
		for (i = 0; i < newRoom.length; i++) {
			if (i >= 4) {
				// Parse door data - format can be "1/3.5" or "2/3.5" or just "3.5"
				let doorValue = newRoom[i];
				if (typeof doorValue === 'string' && doorValue.includes('/')) {
					// Store as object with width and position
					let parts = doorValue.split('/');
					newRoom[i] = {
						width: parseInt(parts[0]), // 1 or 2
						position: parseFloat(parts[1])
					};
				} else {
					// Default: plain numbers are 2-wide (backward compatible)
					newRoom[i] = {
						width: 2,
						position: parseFloat(doorValue)
					};
				}
			} else {
				newRoom[i] = parseInt(newRoom[i]);
			}
			if (1 < i && i < 4) {
				newRoom[i] -= 1;
			}
		}
		while (room.length < 4) {
			try {
				room.push(1);
			} catch {
				room = [0, 0, 1, 1];
			}
		}
		rooms.push(newRoom);
	});
	console.log(rooms);
	// init variables
	const cellSize = scaleHeight(0.0381);
	const origX = scaleX(0.0734);
	const origY = scaleY(0.1377);
	// walls
	dungeonContext.clearRect(0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonFXContext.clearRect(0, 0, dungeonFXCanvas.width, dungeonFXCanvas.height);
	rooms.forEach(room => {
		//top left corner
		dungeonContext.drawImage(dungeonShapetopleft, origX + cellSize * room[0], origY + cellSize * room[1], cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXtopleft, origX + cellSize * room[0], origY + cellSize * room[1], cellSize, cellSize);
		//top right corner
		dungeonContext.drawImage(dungeonShapetopright, origX + cellSize * (room[0] + room[2]), origY + cellSize * room[1], cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXtopright, origX + cellSize * (room[0] + room[2]), origY + cellSize * room[1], cellSize, cellSize);
		//bottom left corner
		dungeonContext.drawImage(dungeonShapebottomleft, origX + cellSize * room[0], origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXbottomleft, origX + cellSize * room[0], origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		//bottom right corner
		dungeonContext.drawImage(dungeonShapebottomright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		dungeonFXContext.drawImage(dungeonFXbottomright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		// horizontal walls
		for (var i = 1; i < room[2]; i++) {
			//top walls
			dungeonContext.drawImage(dungeonShapetop, origX + cellSize * (room[0] + i), origY + cellSize * room[1], cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXtop, origX + cellSize * (room[0] + i), origY + cellSize * room[1], cellSize, cellSize);
			//bottom walls
			dungeonContext.drawImage(dungeonShapebottom, origX + cellSize * (room[0] + i), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXbottom, origX + cellSize * (room[0] + i), origY + cellSize * (room[1] + room[3]), cellSize, cellSize);
		}
		// vertical walls
		for (var i = 1; i < room[3]; i++) {
			// left walls
			dungeonContext.drawImage(dungeonShapeleft, origX + cellSize * room[0], origY + cellSize * (room[1] + i), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXleft, origX + cellSize * room[0], origY + cellSize * (room[1] + i), cellSize, cellSize);
			// right walls
			dungeonContext.drawImage(dungeonShaperight, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + i), cellSize, cellSize);
			dungeonFXContext.drawImage(dungeonFXright, origX + cellSize * (room[0] + room[2]), origY + cellSize * (room[1] + i), cellSize, cellSize);
		} 
	});
	// outer border adjustment
	const outerBorderWidthAdjust = -2; // negative to make narrower, positive to make wider
	const outerBorderHeightAdjust = -5; // negative to make shorter, positive to make taller
	dungeonContext.drawImage(dungeonOuterShape, 0, 0, dungeonCanvas.width + outerBorderWidthAdjust, dungeonCanvas.height + outerBorderHeightAdjust);
	dungeonFXContext.drawImage(dungeonOuterFX, 0, 0, dungeonFXCanvas.width + outerBorderWidthAdjust, dungeonFXCanvas.height + outerBorderHeightAdjust);
	// text
	var textObjects = {};
	textObjects.title = {name:'Title', text:'', x:0.0854, y:0.0522, width:0.8292, height:0.0543, oneLine:true, font:'belerenbsc', size:0.0381, color:'white', align:'center'};
	roomNumber = 1;
	rooms.forEach(room => {
		var textbox = {name:`Dungeon Room ${roomNumber}`, text:`Room ${roomNumber}{lns}{fontmplantin}{fontsize-8}Effect.`, x:(origX + cellSize * (room[0] + 0.5)) / card.width, y:(origY + cellSize * (room[1] + 0.5)) / card.height, width:(cellSize * room[2]) / card.width, height:(cellSize * room[3]) / card.height, font:'belerenb', size:0.0324, align:'center'};
		if (room[3] < 3) {
			textbox.text = textbox.text.replace('{lns}', '   ');
		}
		textObjects[`dungeonRoom${roomNumber}`] = textbox;
		roomNumber ++;
	})
	// doorways
	// Add entrance doorway unless skipEntrance flag is set
	if (!skipEntrance) {
		rooms.push([0,-2,16,1,{width: 2, position: 7}]);
	}
	rooms.forEach(room => {
		doorways = room.slice(4);
		doorways.forEach(doorway => {
			// Check if doorway is an object (new format) or number (legacy)
			const is1Wide = doorway.width === 1;
			const doorPosition = doorway.position;
			
			// 1-wide door settings
			const doorWidth1 = cellSize * 1.5;
			const xAdjust1 = 30;
			const yOffset1 = 0;
			const heightMultiplier1 = 2;
			const arrowXOffset1 = -37; // arrow X offset for 1-wide doors
			const arrowYOffset1 = 10; // arrow Y offset for 1-wide doors
			
			// 2-wide door settings
			const doorWidth2 = cellSize * 3;
			const xAdjust2 = 3;
			const yOffset2 = 0;
			const heightMultiplier2 = 1;
			const arrowXOffset2 = 15; // arrow X offset for 2-wide doors
			const arrowYOffset2 = 10; // arrow Y offset for 2-wide doors
			
			// Apply settings based on door width
			const doorWidth = is1Wide ? doorWidth1 : doorWidth2;
			const xAdjust = is1Wide ? xAdjust1 : xAdjust2;
			const baseYOffset = is1Wide ? yOffset1 : yOffset2;
			const heightMultiplier = is1Wide ? heightMultiplier1 : heightMultiplier2;
			const arrowXOffset = is1Wide ? arrowXOffset1 : arrowXOffset2;
			const arrowYOffset = is1Wide ? arrowYOffset1 : arrowYOffset2;
			
			// Check if this is the final exit doorway
			const isFinalExit = (room[1] + room[3] === 18);
			const doorHeight = dungeonDoorwayCutout.height * (doorWidth / dungeonDoorwayCutout.width) * (isFinalExit ? 1 : heightMultiplier);
			const yOffset = isFinalExit ? 0 : baseYOffset;
			
			dungeonContext.globalCompositeOperation = 'destination-out';
			dungeonFXContext.globalCompositeOperation = 'destination-out';
			dungeonContext.drawImage(dungeonDoorwayCutout, origX + cellSize * (room[0] + doorPosition - 0.5) + xAdjust, origY + cellSize * (room[1] + room[3]) + yOffset, doorWidth, doorHeight);
			dungeonFXContext.drawImage(dungeonDoorwayCutout, origX + cellSize * (room[0] + doorPosition - 0.5) + xAdjust, origY + cellSize * (room[1] + room[3]) + yOffset, doorWidth, doorHeight);
			dungeonContext.globalCompositeOperation = 'source-over';
			dungeonFXContext.globalCompositeOperation = 'source-over';
			dungeonContext.drawImage(dungeonDoorwayShape, origX + cellSize * (room[0] + doorPosition - 0.5) + xAdjust, origY + cellSize * (room[1] + room[3]) + yOffset, doorWidth, doorHeight);
			dungeonFXContext.drawImage(dungeonDoorwayFX, origX + cellSize * (room[0] + doorPosition - 0.5) + xAdjust, origY + cellSize * (room[1] + room[3]) + yOffset, doorWidth, doorHeight);
			if (room[1] != -2 && room[1] + room[3] != 18) {
				dungeonFXContext.drawImage(dungeonDoorwayArrow, origX + cellSize * (room[0] + doorPosition + 0.5) + arrowXOffset, origY + cellSize * (room[1] + room[3] + 0.5) + arrowYOffset);
			}
		});
	});
	// apply textures and FX
	dungeonContext.globalCompositeOperation = 'source-in';
	texture = window[`dungeonTexture${document.querySelector('#dungeon-color').value}`];
	dungeonContext.drawImage(texture, 0, 0, dungeonCanvas.width, dungeonCanvas.height);
	dungeonContext.globalCompositeOperation = 'source-over';
	dungeonContext.drawImage(dungeonFXCanvas, 0, 0, dungeonCanvas.width, dungeonCanvas.height)
	// finish
	loadTextOptions(textObjects);
	drawTextBuffer();
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
	hasDragged: false // Track if mouse has actually moved during drag
};

// Initialize the visual editor
function dungeonInitVisualEditor() {
	setTimeout(() => {
		dungeonEditorState.gridCanvas = document.getElementById('dungeon-grid-canvas');
		if (dungeonEditorState.gridCanvas) {
			dungeonEditorState.gridCtx = dungeonEditorState.gridCanvas.getContext('2d');
			dungeonParseRoomsFromText();
			dungeonDrawGrid();
			
			// Add mouse event listeners
			dungeonEditorState.gridCanvas.addEventListener('mousedown', dungeonGridMouseDown);
			dungeonEditorState.gridCanvas.addEventListener('mousemove', dungeonGridMouseMove);
			dungeonEditorState.gridCanvas.addEventListener('mouseup', dungeonGridMouseUp);
			dungeonEditorState.gridCanvas.addEventListener('mouseleave', dungeonGridMouseUp);
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
	
	const canvas = dungeonEditorState.gridCanvas;
	const ctx = dungeonEditorState.gridCtx;
	const cellSize = 40;
	const gridWidth = 16;
	const gridHeight = 19;
	
	// Clear canvas
	ctx.fillStyle = '#1a1a1a';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draw grid lines
	ctx.strokeStyle = '#333';
	ctx.lineWidth = 1;
	
	for (let x = 0; x <= gridWidth; x++) {
		ctx.beginPath();
		ctx.moveTo(x * cellSize, 0);
		ctx.lineTo(x * cellSize, gridHeight * cellSize);
		ctx.stroke();
	}
	
	for (let y = 0; y <= gridHeight; y++) {
		ctx.beginPath();
		ctx.moveTo(0, y * cellSize);
		ctx.lineTo(gridWidth * cellSize, y * cellSize);
		ctx.stroke();
	}
	
	// Draw rooms
	dungeonEditorState.rooms.forEach((room, index) => {
		// Room fill
		ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
		ctx.fillRect(room.x * cellSize, room.y * cellSize, room.width * cellSize, room.height * cellSize);
		
		// Room border
		ctx.strokeStyle = '#6496c8';
		ctx.lineWidth = 2;
		ctx.strokeRect(room.x * cellSize, room.y * cellSize, room.width * cellSize, room.height * cellSize);
		
		// Room number
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 16px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${index + 1}`, (room.x + room.width / 2) * cellSize, (room.y + room.height / 2) * cellSize);
		
		// Draw doors
		ctx.fillStyle = '#4CAF50';
		room.doors.forEach(doorPos => {
			// Check if it's a string with "/" (e.g., "1/4" for 1-wide, "2/4" for 2-wide)
			let is1Wide = false;
			let absoluteDoorPos = doorPos;
			
			if (typeof doorPos === 'string' && doorPos.includes('/')) {
				const parts = doorPos.split('/');
				const width = parseInt(parts[0]);
				absoluteDoorPos = parseFloat(parts[1]);
				is1Wide = (width === 1);
			} else {
				// Plain number defaults to 2-wide
				absoluteDoorPos = Number(doorPos);
				is1Wide = false;
			}
			
			const doorWidth = is1Wide ? cellSize * 1 : cellSize * 2;
			const doorX = (room.x + absoluteDoorPos) * cellSize;
			const doorY = (room.y + room.height) * cellSize;
			// Draw door, positioned to match actual rendering
			ctx.fillRect(doorX - cellSize * 0, doorY - 5, doorWidth, 10);
		});
	});
	
	// Draw current drawing room
	if (dungeonEditorState.isDrawing && dungeonEditorState.currentRoom) {
		const room = dungeonEditorState.currentRoom;
		ctx.fillStyle = 'rgba(150, 200, 100, 0.3)';
		ctx.fillRect(room.x * cellSize, room.y * cellSize, room.width * cellSize, room.height * cellSize);
		ctx.strokeStyle = '#96c864';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(room.x * cellSize, room.y * cellSize, room.width * cellSize, room.height * cellSize);
		ctx.setLineDash([]);
	}
	
	// Highlight hovered cell
	if (dungeonEditorState.hoveredCell) {
		const cell = dungeonEditorState.hoveredCell;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
	}
}

// Get cell from mouse event
function dungeonGetCellFromEvent(event) {
	const canvas = dungeonEditorState.gridCanvas;
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	const x = (event.clientX - rect.left) * scaleX;
	const y = (event.clientY - rect.top) * scaleY;
	const cellSize = 40;
	
	return {
		x: Math.floor(x / cellSize),
		y: Math.floor(y / cellSize),
		subX: (x % cellSize) / cellSize,
		subY: (y % cellSize) / cellSize
	};
}

// Mouse down event
function dungeonGridMouseDown(event) {
	if (event.button !== 0) return; // Only left click
	
	const cell = dungeonGetCellFromEvent(event);
	const currentTime = Date.now();
	
	// Check if clicking near the bottom wall of a room (expanded area for doors)
	for (let room of dungeonEditorState.rooms) {
		const bottomY = room.y + room.height;
		const clickY = cell.y + cell.subY;
		// Accept clicks within 1.5 cells above or 0.5 below the bottom wall (larger area above for door grabbing)
		if (clickY >= bottomY - 1 && clickY <= bottomY + 1 && cell.x >= room.x - 1 && cell.x <= room.x + room.width) {
			const doorPos = cell.x + cell.subX - room.x;
			
			// Check if clicking on an existing door (use wider tolerance for dragging)
			const doorIndex = room.doors.findIndex(d => {
				let dPos = d;
				let dWidth = 2;
				if (typeof d === 'string' && d.includes('/')) {
					const parts = d.split('/');
					dWidth = parseInt(parts[0]);
					dPos = parseFloat(parts[1]);
				}
				
				// Check if click is within the door's width
				if (dWidth === 1) {
					return Math.abs(dPos - doorPos) < 0.75; // 1-wide: within 0.75 cells
				} else {
					// 2-wide: check if click is between dPos and dPos+1
					return doorPos >= dPos - 0.5 && doorPos <= dPos + 1.5;
				}
			});
			
			if (doorIndex >= 0) {
				// Check for double-click (within 300ms)
				const isDoubleClick = 
					currentTime - dungeonEditorState.lastClickTime < 300 &&
					dungeonEditorState.lastClickDoor &&
					dungeonEditorState.lastClickDoor.room === room &&
					dungeonEditorState.lastClickDoor.doorIndex === doorIndex;
				
				if (isDoubleClick) {
					// Double-click: remove the door
					room.doors.splice(doorIndex, 1);
					dungeonRoomsToText();
					dungeonDrawGrid();
					dungeonEditorState.lastClickTime = 0;
					dungeonEditorState.lastClickDoor = null;
					return;
				} else {
					// Single click: start dragging the door
					let dPos = room.doors[doorIndex];
					if (typeof dPos === 'string' && dPos.includes('/')) {
						dPos = parseFloat(dPos.split('/')[1]);
					}
					dungeonEditorState.isDraggingDoor = true;
					dungeonEditorState.draggedDoor = { room, doorIndex, originalPos: dPos };
					dungeonEditorState.dragStartX = doorPos;
					dungeonEditorState.hasDragged = false; // Reset drag flag
					dungeonEditorState.lastClickTime = currentTime;
					dungeonEditorState.lastClickDoor = { room, doorIndex };
					return;
				}
			} else {
				// Toggle door (add)
				dungeonToggleDoor(room, doorPos);
				dungeonRoomsToText();
				dungeonEditorState.lastClickTime = 0;
				dungeonEditorState.lastClickDoor = null;
				return;
			}
		}
	}
	
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
	
	if (dungeonEditorState.isDraggingDoor && dungeonEditorState.draggedDoor) {
		// Update door position while dragging
		const dragInfo = dungeonEditorState.draggedDoor;
		const room = dragInfo.room;
		const doorPos = cell.x + cell.subX - room.x;
		
		// Snap to nearest 0.5
		const snappedPos = Math.round(doorPos * 2) / 2;
		
		// Check if position has actually changed
		if (Math.abs(snappedPos - dragInfo.originalPos) > 0.1) {
			dungeonEditorState.hasDragged = true;
		}
		
		// Clamp to room bounds
		if (snappedPos >= 0 && snappedPos <= room.width) {
			// Get the door's width
			let doorWidth = 2;
			const currentDoor = room.doors[dragInfo.doorIndex];
			if (typeof currentDoor === 'string' && currentDoor.includes('/')) {
				doorWidth = parseInt(currentDoor.split('/')[0]);
			}
			
			// Update the door position
			if (doorWidth === 1) {
				room.doors[dragInfo.doorIndex] = `1/${snappedPos}`;
			} else {
				room.doors[dragInfo.doorIndex] = `2/${snappedPos}`;
			}
		}
		
		dungeonDrawGrid();
	} else if (dungeonEditorState.isDrawing && dungeonEditorState.startCell) {
		const startX = Math.min(dungeonEditorState.startCell.x, cell.x);
		const startY = Math.min(dungeonEditorState.startCell.y, cell.y);
		const endX = Math.max(dungeonEditorState.startCell.x, cell.x);
		const endY = Math.max(dungeonEditorState.startCell.y, cell.y);
		
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
	if (dungeonEditorState.isDraggingDoor) {
		// Only save if the door was actually dragged
		if (dungeonEditorState.hasDragged) {
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
	// Snap to nearest 0.5
	doorPos = Math.round(doorPos * 2) / 2;
	
	// Check if this space is already covered by any door
	const overlappingDoorIndex = room.doors.findIndex(d => {
		let dPos = d;
		let dWidth = 2;
		if (typeof d === 'string' && d.includes('/')) {
			const parts = d.split('/');
			dWidth = parseInt(parts[0]);
			dPos = parseFloat(parts[1]);
		}
		
		// Check if doorPos falls within this door's coverage
		// 1-wide door covers position dPos
		// 2-wide door covers positions dPos and dPos+1
		if (dWidth === 1) {
			return Math.abs(dPos - doorPos) < 0.1;
		} else {
			// 2-wide door covers dPos to dPos+1
			return doorPos >= dPos - 0.1 && doorPos <= dPos + 1.1;
		}
	});
	
	// If this space is already covered by a door, do nothing
	if (overlappingDoorIndex >= 0) {
		return;
	}
	
	// Add door as 1-wide by default
	if (doorPos >= 0 && doorPos <= room.width) {
		// Check if there's an adjacent 1-wide door to merge with
		const adjacentIndex = room.doors.findIndex(d => {
			let dPos = d;
			let dWidth = 2;
			// If it's a string with "/", extract the position and width
			if (typeof d === 'string' && d.includes('/')) {
				const parts = d.split('/');
				dWidth = parseInt(parts[0]);
				dPos = parseFloat(parts[1]);
			}
			// Check if it's a 1-wide door at position +1 or -1
			return dWidth === 1 && (Math.abs(dPos - doorPos) === 1);
		});
		
		if (adjacentIndex >= 0) {
			// Merge into a 2-wide door
			const adjacentDoor = room.doors[adjacentIndex];
			let adjacentPos = adjacentDoor;
			if (typeof adjacentDoor === 'string' && adjacentDoor.includes('/')) {
				adjacentPos = parseFloat(adjacentDoor.split('/')[1]);
			}
			
			// Remove the adjacent 1-wide door
			room.doors.splice(adjacentIndex, 1);
			
			// Add a 2-wide door at the lower position
			const mergedPos = Math.min(doorPos, adjacentPos);
			room.doors.push(`2/${mergedPos}`);
		} else {
			// Add as 1-wide door
			room.doors.push(`1/${doorPos}`);
		}
		
		room.doors.sort((a, b) => {
			// Sort by position, handling both number and string formats
			let aPos = typeof a === 'string' && a.includes('/') ? parseFloat(a.split('/')[1]) : a;
			let bPos = typeof b === 'string' && b.includes('/') ? parseFloat(b.split('/')[1]) : b;
			return aPos - bPos;
		});
	}
	
	dungeonDrawGrid();
}// Grid click handler (for old onclick)
function dungeonGridClick(event) {
	// Handled by mouse events now
}

// Grid hover handler
function dungeonGridHover(event) {
	// Handled by mousemove now
}

// Grid right click handler
function dungeonGridRightClick(event) {
	event.preventDefault();
	const cell = dungeonGetCellFromEvent(event);
	
	// Find and remove room at this position
	for (let i = dungeonEditorState.rooms.length - 1; i >= 0; i--) {
		const room = dungeonEditorState.rooms[i];
		if (cell.x >= room.x && cell.x < room.x + room.width &&
			cell.y >= room.y && cell.y < room.y + room.height) {
			dungeonEditorState.rooms.splice(i, 1);
			dungeonRoomsToText();
			break;
		}
	}
}

// Toggle between visual and text mode
function dungeonToggleMode() {
	const button = document.getElementById('dungeon-mode-button');
	const visualEditor = document.getElementById('dungeon-visual-editor');
	const textEditor = document.getElementById('dungeon-text-editor');
	
	if (dungeonEditorState.mode === 'visual') {
		dungeonEditorState.mode = 'text';
		button.textContent = 'Mode: Text Editor';
		visualEditor.style.display = 'none';
		textEditor.style.display = 'block';
	} else {
		dungeonEditorState.mode = 'visual';
		button.textContent = 'Mode: Visual Editor';
		visualEditor.style.display = 'block';
		textEditor.style.display = 'none';
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
	}
}

// Clear all rooms
function dungeonClearAll() {
	if (confirm('Are you sure you want to clear all rooms?')) {
		dungeonEditorState.rooms = [];
		dungeonRoomsToText();
	}
}

// Load preset dungeons
function dungeonLoadPreset(preset) {
	let presetData = '';
	
	switch(preset) {
		case 'tomb':
			// Tomb of Annihilation layout
			presetData =`0,0,16,4,3,11
0,4,8,5,3
0,9,8,5,3
8,4,8,10,3
0,14,16,5,7`;
			break;
		case 'mad':
			// Dungeon of Mad Mage layout
			presetData =`0,0,16,2,7
0,2,16,2,2,11
0,4,8,4,5
8,4,8,4,3
0,8,16,2,2,12
0,10,8,4,5
8,10,8,4,2
0,14,16,2,7
0,16,16,3,7`;
			break;
		case 'phandelver':
			// Lost Mine of Phandelver layout
			presetData =`0,0,16,4,3,11
0,4,8,5,1.5,5.5,8.5,12.5
8,4,8,5,
0,9,5,6,1.5,7,12.5
5,9,6,6
11,9,5,6
0,15,16,4,7`;
			break;
		case 'undercity':
			// Undercity layout
			presetData =`0,0,16,3,3,11
0,3,8,3,2,1/6.5
8,3,8,3,1/0.5,4
0,6,6,4,2
6,6,4,4,1/0.5,1/2.5
10,6,6,4,2
0,10,8,4,3
8,10,8,4,3
0,14,16,5,7`;
			break;
					case 'baldursgatewilderness':
			// Baldur's Gate Wilderness layout
			presetData =`NOENTRANCE
0,0,16,2,1/2,1/7.5,1/13
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
	if (input) {
		input.value = presetData;
		dungeonParseRoomsFromText();
		dungeonDrawGrid();
		dungeonEditedBuffer();
	}
}

// Initialize visual editor when tab is loaded
setTimeout(dungeonInitVisualEditor, 200);
