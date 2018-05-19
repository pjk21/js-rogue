Core.Entity = function(properties) {
	properties = properties || {};
	
	this._name = properties['name'] || '';
	
	this._x = properties['x'] || 0;
	this._y = properties['y'] || 0;
	
	this._glyph = properties['glyph'] || '@';
	this._colour = properties['colour'] || 'white';
	this._backColour = properties['backColour'] || undefined;
	
	this._components = {};
	this._componentGroups = {};
	this._listeners = {};
	
	var components = properties['components'] || {};
	
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
			for (var key in components[i].listeners) {
				if (!this._listeners[key]) {
					this._listeners[key] = [];
				}
				
				this._listeners[key].push(components[i].listeners[key]);
			}
		}
		
		if (components[i].init) {
			components[i].init.call(this, properties);
		}
	}
}

Core.Entity.prototype = {
	getName: function() {
		return this._name;
	},
	
	getMap: function() {
		return this._map;
	},
	
	setMap: function(map) {
		this._map = map;
	},
	
	getX: function() {
		return this._x;
	},
	
	setX: function(x) {
		this._x = x;
	},

	getY: function() {
		return this._y;
	},
	
	setY: function(y) {
		this._y = y;
	},
	
	getPosition: function() {
		return { x: this.getX(), y: this.getY() };
	},
	
	setPosition: function(x, y) {
		if (typeof x === 'number') {
			this.setX(x);
			this.setY(y);
		}
		else {
			this.setX(x.x);
			this.setY(x.y);
		}
	},
	
	getGlyph: function() {
		return this._glyph;
	},
	
	getColour: function() {
		return this._colour;
	},
	
	getBackColour: function() {
		return this._backColour;
	},
	
	render: function(display) {
		var backColour = this.getBackColour() ? this.getBackColour() : this.getMap().getTile(this.getX(), this.getY()).getBackColour();		
		display.draw(this.getX(), this.getY(), this.getGlyph(), this.getColour(), backColour);
	},
	
	move: function(x, y) {
		var map = this.getMap();
		var target = map.getEntityAt(this.getX() + x, this.getY() + y);
		
		if (target) {
			if (target.hasComponent(Core.Components.Combat) && (this.hasComponent(Core.Components.PlayerController) || target.hasComponent(Core.Components.PlayerController))) {
				this.attack(target);
				return true;
			}
		}
		else if (map.isOpenCell(this.getX() + x, this.getY() + y)) {
			var oldPosition = this.getPosition();
			
			this.setPosition(this.getX() + x, this.getY() + y);
			
			if (this.getMap()) {
				this.getMap().updateEntityPosition(this, oldPosition.x, oldPosition.y);
			}
			
			return true;
		}
		
		return false;
	},
	
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
}