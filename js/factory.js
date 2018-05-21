Core.Factory = function(ctor) {
	this._templates = [];
	this._ctor = ctor;
};

Core.Factory.prototype = {
	define: function(name, template) {
		this._templates[name] = template;
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