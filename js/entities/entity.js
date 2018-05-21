Core.Entity = function(properties) {
	properties = properties || {};
	
	Core.GameObject.call(this, properties);
	
	this._map = null;
};

Core.Entity.extend(Core.GameObject);

Object.assign(Core.Entity.prototype, {	
	getMap: function() {
		return this._map;
	},
	
	setMap: function(map) {
		this._map = map;
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