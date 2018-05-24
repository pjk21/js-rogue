Core.Components.Consumable = {
	isFinished: function() {
		return this._consumptionsRemaining > 0;
	},
	
	init: function(properties) {
		this._onConsume = properties.onConsume || null;
		this._canConsume = properties.canConsume || null;
		
		this._maximumConsumptions = properties.maximumConsumptions || 1;
		this._consumptionsRemaining = this._maximumConsumptions;
	},
	
	consume: function(entity) {
		if (!this.isFinished() && this.canConsume(entity)) {
			if (this._onConsume(entity)) {
				this._consumptions--;
				return true;
			}
		}
		
		return false;
	},
	
	canConsume: function(entity) {
		if (!this._onConsume) {
			return false;
		}
		
		if (this._canConsume) {
			return this._canConsume(entity);
		}
		
		return true;
	}
};

Core.Components.Equipment = {
	getEquipmentSlot: function() {
		return this._equipmentSlot;
	},
	
	init: function(properties) {
		this._equipmentSlot = properties.equipmentSlot || null;
	}
};