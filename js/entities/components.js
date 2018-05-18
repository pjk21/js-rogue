Core.Components.PlayerController = {
	name: 'PlayerController',
	group: 'Controller',
	
	act: function() {
		if (this._acting) {
			return;
		}
		
		this._acting = true;
		Core.refresh();		
		Core.getGame().getEngine().lock();
		this._acting = false;
	}
}

Core.Components.Sight = {
	name: 'Sight',
	group: 'Sight',
	
	getSightRadius: function() {
		return this._sightRadius;
	},
	
	init: function(properties) {
		this._sightRadius = properties['sightRadius'] || 5;
	}
}