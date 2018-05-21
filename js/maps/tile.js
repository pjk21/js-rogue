Core.Tile = function(properties) {
	properties = properties || {};
	
	Core.Object.call(this, properties);
	
	this._walkable = properties.walkable || false;
	this._transparent = properties.transparent || false;
	
	this._description = properties.description || '';
};

Core.Tile.extend(Core.Object);

Object.assign(Core.Tile.prototype, {
	isWalkable: function() {
		return this._walkable;
	},
	
	isTransparent: function() {
		return this._transparent;
	},
	
	getDescription: function() {
		return this._description;
	}
});

Core.Tiles.nullTile = new Core.Tile();