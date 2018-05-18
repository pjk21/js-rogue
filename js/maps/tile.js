Core.Tile = function(properties) {
	properties = properties || {};
	
	this._name = properties['name'] || '';
	
	this._glyph = properties['glyph'] || '';
	this._colour = properties['colour'] || 'white';
	this._backColour = properties['backColour'] || 'black';
	
	this._walkable = properties['walkable'] || false;
	this._transparent = properties['transparent'] || false;
	
	this._description = properties['description'] || '';
}

Core.Tile.prototype = {
	getGlyph: function() {
		return this._glyph;
	},
	
	getColour: function() {
		return this._colour;
	},
	
	getBackColour: function() {
		return this._backColour;
	},
	
	isWalkable: function() {
		return this._walkable;
	},
	
	isTransparent: function() {
		return this._transparent;
	},
	
	getDescription: function() {
		return this._description;
	}
}

Core.Tiles.nullTile = new Core.Tile();