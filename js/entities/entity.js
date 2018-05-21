Core.Entity = function(properties) {
	properties = properties || {};
	
	Core.GameObject.call(this, properties);
	
	this._map = null;
	
	this._x = properties.x || 0;
	this._y = properties.y || 0;
};

Core.Entity.extend(Core.GameObject);

Object.assign(Core.Entity.prototype, {	
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
	}
});