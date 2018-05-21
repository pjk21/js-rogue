Core.GameObject = function(properties) {
	properties = properties || {};
	
	Core.Object.call(this, properties);
	
	this._components = {};
	this._componentGroups = {};
	this._listeners = {};
	
	var components = properties.components || {};
	
	for (var i = 0; i < components.length; i++) {
		for (var key in components[i]) {
			if (key !== 'init' && key !== 'name' && !this.hasOwnProperty(key)) {
				this[key] = components[i][key];
			}
		}
		
		this._components[components[i].name] = true;
		
		if (components[i].group) {
			this._componentGroups[components[i].group] = true;
		}
		
		if (components[i].listeners) {
			for (var listenerKey in components[i].listeners) {
				if (!this._listeners[listenerKey]) {
					this._listeners[listenerKey] = [];
				}
				
				this._listeners[listenerKey].push(components[i].listeners[listenerKey]);
			}
		}
		
		if (components[i].init) {
			components[i].init.call(this, properties);
		}
	}
};

Core.GameObject.extend(Core.Object);

Object.assign(Core.GameObject.prototype, {
	hasComponent: function(componentType) {
		if (typeof componentType === 'object') {
			return this._components[componentType.name];
		}
		else {
			return this._components[componentType] || this._componentGroups[componentType];
		}
	},
	
	raiseEvent: function(event) {
		if (!this._listeners[event]) {
			return;
		}
		
		var args = Array.prototype.slice.call(arguments, 1);
		var results = [];
		
		for (var i = 0; i < this._listeners[event].length; i++) {
			var result = this._listeners[event][i].apply(this, args);
			results.push(result);
		}
		
		return results;
	}
});