//Create objects for common properties across available frames
var bounds = {x:0.0307, y:52/2814, width:0.9387, height:0.1024};
var bounds2 = {x:0.0307, y:2349/2814, width:0.9387, height:0.1024};
//defines available frames
availableFrames = [
	{name:'Top White Legend Crown', src:'/img/frames/m15/crowns/m15CrownWFloating.png', bounds:bounds, complementary:10},
	{name:'Top Blue Legend Crown', src:'/img/frames/m15/crowns/m15CrownUFloating.png', bounds:bounds, complementary:10},
	{name:'Top Black Legend Crown', src:'/img/frames/m15/crowns/m15CrownBFloating.png', bounds:bounds, complementary:10},
	{name:'Top Red Legend Crown', src:'/img/frames/m15/crowns/m15CrownRFloating.png', bounds:bounds, complementary:10},
	{name:'Top Green Legend Crown', src:'/img/frames/m15/crowns/m15CrownGFloating.png', bounds:bounds, complementary:10},
	{name:'Top Multicolored Legend Crown', src:'/img/frames/m15/crowns/m15CrownMFloating.png', bounds:bounds, complementary:10},
	{name:'Top Artifact Legend Crown', src:'/img/frames/m15/crowns/m15CrownAFloating.png', bounds:bounds, complementary:10},
	{name:'Top Artifact Legend Crown (Alt)', src:'/img/frames/m15/crowns/m15CrownAFloatingAlt.png', bounds:bounds, complementary:10},
	{name:'Top Land Legend Crown', src:'/img/frames/m15/crowns/m15CrownLFloating.png', bounds:bounds, complementary:10},
	{name:'Top Colorless Legend Crown', src:'/img/frames/m15/crowns/m15CrownCFloating.png', bounds:bounds, complementary:10},
	{name:'Legend Crown Border Cover', src:'/img/black.png', bounds:{x:0.0394, y:76/2814, width:0.9214, height:0.0177}},
	{name:'Top Legend Crown Outline (Place this under crown layer)', src:'/img/frames/m15/crowns/m15CrownFloatingOutline.png', bounds:{x:0.028, y:47/2814, width:0.944, height:0.1062}},

	{name:'Bottom White Legend Crown', src:'/img/frames/m15/crowns/m15CrownWFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Blue Legend Crown', src:'/img/frames/m15/crowns/m15CrownUFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Black Legend Crown', src:'/img/frames/m15/crowns/m15CrownBFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Red Legend Crown', src:'/img/frames/m15/crowns/m15CrownRFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Green Legend Crown', src:'/img/frames/m15/crowns/m15CrownGFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Multicolored Legend Crown', src:'/img/frames/m15/crowns/m15CrownMFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Artifact Legend Crown', src:'/img/frames/m15/crowns/m15CrownAFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Artifact Legend Crown (Alt)', src:'/img/frames/m15/crowns/m15CrownAFloatingAlt.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Land Legend Crown', src:'/img/frames/m15/crowns/m15CrownLFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Colorless Legend Crown', src:'/img/frames/m15/crowns/m15CrownCFloating.png', bounds:bounds2, complementary:22, rotate:180},
	{name:'Bottom Legend Crown Title Cover', src:'/img/black.png', bounds:{x:420/2010, y:2565/2814, width:1154/2010, height:20/2814}, erase:true},
	{name:'Bottom Legend Crown Outline (Place this under crown layer)', src:'/img/frames/m15/crowns/m15CrownFloatingOutline.png', bounds:{x:0.028, y:2344/2814, width:0.944, height:0.1062}, rotate:180}
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = true;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = null;
//loads available frames
loadFramePack();