Core.Factory = function(ctor) {
	this._templates = [];
	this._ctor = ctor;
	
	this._spawnTable = {};
};

Core.Factory.prototype = {
	getSpawnTable: function() {
		return this._spawnTable;
	},
	
	define: function(name, weight, template) {
		this._templates[name] = template;
		this._spawnTable[name] = weight;
	},
	
	create: function(name) {
		var template = this._templates[name];
		
		if (!template) {
			throw new Error('Could not find template: %s'.format(name));
		}
		
		var templateCopy = Object.create(template);
		
		return new this._ctor(templateCopy);
	}
};