Core.Effect = function(properties) {
	properties = properties || {};
	
	this.name = properties.name || '';
	
	if (properties.duration) {
		if (typeof properties.duration === 'number') {
			this.duration = properties.duration;
		}
		else if (typeof properties.duration === 'object') {
			this.duration = Core.getRandomNumber(properties.duration.min, properties.duration.max);
		}
	}
	
	this._onApply = properties.onApply || undefined;
	this._onRemove = properties.onRemove || undefined;

	this._onTurnEnd = properties.onTurnEnd || undefined;
};

Core.Effect.prototype = {
	getName: function() {
		return this.name;
	},
	
	apply: function(entity) {
		Core.MessageLog.add('%s has been afflicted with %s!'.format(entity.getName(), this.name), 'warning');
		
		if (this._onApply) {
			this._onApply.call(this, entity);
		}
	},
	
	remove: function(entity) {
		if (this._onRemove) {
			this._onRemove.call(this, entity);
		}
	},
	
	endTurn: function(entity) {
		if (this.duration) {
			this.duration--;
			
			if (this.duration === 0) {
				entity.removeEffect(this.name);
				Core.MessageLog.add('%s is no longer afflicted with %s.'.format(entity.getName(), this.name), 'info');
			}
		}
		
		if (this._onTurnEnd) {
			this._onTurnEnd.call(this, entity);
		}
	}
};