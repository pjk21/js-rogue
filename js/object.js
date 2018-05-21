Core.Object = function(properties) {
	properties = properties || {};

	this._name = properties.name || '';
	
	this._glyph = properties.glyph || '';
	this._colour = properties.colour || 'white';
	this._backColour = properties.backColour || undefined;
};

Core.Object.prototype = {
	getName: function() {
		return this._name;
	},
	
	getGlyph: function() {
		return this._glyph;
	},
	
	getColour: function() {
		return this._colour;
	},
	
	getBackColour: function() {
		return this._backColour;
	}
};