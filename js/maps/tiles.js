Core.Tiles.floorTile = new Core.Tile({
	name: 'Cave Floor',
	description: 'A rocky floor.',
	
	glyph: '.',
	colour: '#9BADB7',
	backColour: '#663931',
	
	walkable: true,
	transparent: true
});

Core.Tiles.grassTile = new Core.Tile({
	name: 'Grass',
	description: 'Grass.',
	
	glyph: '"',
	colour: '#6ABE30',
	backColour: '#4B692F',
	
	walkable: true,
	transparent: true
});

Core.Tiles.wallTile = new Core.Tile({
	name: 'Cave Wall',
	description: 'A rocky wall.',
	
	glyph: '#',
	colour: '#663931',
	backColour: '#45283C',
	
	walkable: false,
	transparent: false
});

Core.Tiles.mossyWallTile = new Core.Tile({
	name: 'Mossy Cave Wall',
	description: 'A rocky wall covered in moss.',
	
	glyph: '#',
	colour: '#6ABE30',
	backColour: '#323C39',
	
	walkable: false,
	transparent: false
});

Core.Tiles.stairs = new Core.Tile({
	name: 'Stairs',
	description: 'A sets of stairs leading deeper into the dungeon.',
	
	glyph: '<',
	colour: '#9BADB7',
	backColour: '#663931',
	
	walkable: true,
	transparent: true
});