Core.Entity = function(properties) {
	properties = properties || {};
	
	Core.GameObject.call(this, properties);
	
	this._map = null;
	this.effects = {};
};

Core.Entity.extend(Core.GameObject);

Object.assign(Core.Entity.prototype, {	
	getMap: function() {
		return this._map;
	},
	
	setMap: function(map) {
		this._map = map;
	},
	
	addEffect: function(name) {		
		if (!this.effects[name]) {
			var effect = Core.EffectFactory.create(name);
			
			if (effect) {
				this.effects[effect.name] = effect;
				effect.apply(this);
		
				if (Core.getGame().getPlayer() === this) {
					Core.refresh();
				}
		
				return true;
			}
		}
		
		return false;
	},
	
	removeEffect: function(name) {
		var effect = this.effects[name];
		
		if (effect) {
			delete this.effects[name];
			effect.remove(this);
			
			return true;
		}
		
		return false;
	},
	
	move: function(x, y) {
		var map = this.getMap();
		var target = map.getEntityAt(this.getX() + x, this.getY() + y);
		
		if (x === 0 && y === 0) {
			return false;
		}
		
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
	
	endTurn: function() {
		this.raiseEvent('endTurn');
		
		for (var key in this.effects) {
			var effect = this.effects[key];
			effect.endTurn(this);			
		}
	}
});