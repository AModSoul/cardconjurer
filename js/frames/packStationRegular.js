//Create objects for common properties across available frames
var masks = [{src:'/img/frames/m15/regular/m15MaskPinline.png', name:'Pinline'}, {src:'/img/frames/m15/regular/m15MaskTitle.png', name:'Title'}, {src:'/img/frames/m15/regular/m15MaskType.png', name:'Type'}, {src:'/img/frames/m15/regular/m15MaskRules.png', name:'Rules'}, {src:'/img/frames/m15/regular/m15MaskBorder.png', name:'Border'}];
//defines available frames
availableFrames = [
    {name:'White Frame', src:'/img/frames/station/w.png', masks:masks},
    {name:'Blue Frame', src:'/img/frames/station/u.png', masks:masks},
    {name:'Black Frame', src:'/img/frames/station/b.png', masks:masks},
    {name:'Red Frame', src:'/img/frames/station/r.png', masks:masks},
    {name:'Green Frame', src:'/img/frames/station/g.png', masks:masks},
    {name:'Multicolored Frame', src:'/img/frames/station/m.png', masks:masks},
    {name:'Artifact Frame', src:'/img/frames/station/a.png', masks:masks}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
    //resets things so that every frame doesn't have to
    await resetCardIrregularities();
    //sets card version
    card.version = 'stationRegular';
    card.onload = '/js/frames/versionStation.js';

    // Preserve existing station data if it exists
    const existingStation = card.station || {};
    
    // Initialize station data with preservation of existing values
    card.station = {
        abilityCount: 3,
        x: 0.1167,
        width: 0.8094,
        badgeX: existingStation.badgeX || 0.066,
        badgeValues: existingStation.badgeValues || ['', '', ''],
        disableFirstAbility: existingStation.disableFirstAbility || false,
        colorModes: existingStation.colorModes || {
            1: 'auto',
            2: 'auto'
        },
        badgeSettings: existingStation.badgeSettings || {
            fontSize: 0.0240,
            width: 162,
            height: 162
        },
        colorSettings: existingStation.colorSettings || {
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
        },
        squares: {
            1: { 
                width: existingStation.squares?.[1]?.width || 1713, 
                height: existingStation.squares?.[1]?.height || 300, 
                x: existingStation.squares?.[1]?.x || -214, 
                y: existingStation.squares?.[1]?.y || 2050, 
                enabled: true, 
                color: existingStation.squares?.[1]?.color || '#4a4a4a', 
                opacity: existingStation.squares?.[1]?.opacity || 0.4 
            },
            2: { 
                width: existingStation.squares?.[2]?.width || 1713, 
                height: existingStation.squares?.[2]?.height || 246, 
                x: existingStation.squares?.[2]?.x || -214, 
                y: existingStation.squares?.[2]?.y || 2350, 
                enabled: true, 
                color: existingStation.squares?.[2]?.color || '#4a4a4a', 
                opacity: existingStation.squares?.[2]?.opacity || 0.6 
            }
        },
        baseTextPositions: existingStation.baseTextPositions || {
            ability1: {x: 0.18, y: 0.7},
            ability2: {x: 0.18, y: 0.83}
        }
    };
    
    loadScript('/js/frames/versionStation.js');
    //art bounds
    card.artBounds = {x:0.068, y:0.101, width:0.864, height:0.8143};
    autoFitArt();
    //set symbol bounds
    card.setSymbolBounds = {x:0.9227, y:0.5891, width:0.12, height:0.0381, vertical:'center', horizontal: 'right'};
    resetSetSymbol();
    //watermark bounds
    card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
    resetWatermark();
    //text
    loadTextOptions({
        mana: {name:'Mana Cost', text:'', y:0.0481, width:0.9292, height:71/2100, oneLine:true, size:71/1638, align:'right', shadowX:-0.001, shadowY:0.0029, manaCost:true, manaSpacing:0},
        title: {name:'Title', text:'', x:0.0867, y:0.0372, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0381},
        type: {name:'Type', text:'', x:0.0867, y:0.5625, width:0.8267, height:0.0548, oneLine:true, font:'belerenb', size:0.0324},
        ability0: {name:'Ability 1', text:'', x:175/2010, y:1775/2814, width:1660/2010, height:280/2814, size:0.0353},
        ability1: {name:'Ability 2', text:'', x:175/2010, y:0.7, width:0.7467, height:0.0972, size:0.0353},
        ability2: {name:'Ability 3', text:'', x:0.18, y:0.83, width:0.7467, height:0.0972, size:0.0353},
        pt: {name:'Power/Toughness', text:'', x:0.7928, y:0.902, width:0.1367, height:0.0372, size:0.0372, font:'belerenbsc', oneLine:true, align:'center'}
    });
}
//loads available frames
loadFramePack();