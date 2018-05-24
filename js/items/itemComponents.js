Core.Components.Consumable = {
	listeners: {
		getInventoryActions: function() {
			return [
				{ text: 'consume', action: this.consume }
			];
		}
	},
	
	init: function(properties) {
		this._onConsume = properties.onConsume || null;
		this._canConsume = properties.canConsume || null;
		
		this._maximumConsumptions = properties.maximumConsumptions || 1;
		this._consumptionsRemaining = this._maximumConsumptions;
	},
	
	consume: function(entity) {		
		if (this.canConsume(entity)) {		
			if (this._onConsume(entity)) {
				this._consumptionsRemaining--;

				if (this._consumptionsRemaining === 0) {
					entity.removeItem(this);
				}
				
				return true;
			}
		}
		
		return false;
	},
	
	canConsume: function(entity) {
		if (!this._onConsume) {			
			return false;
		}
		
		if (this._consumptionsRemaining === 0) {
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