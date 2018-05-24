Core.Components.Consumable = {
	name: 'Consumable',
	
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
	name: 'Equipment',
	
	getEquipmentSlot: function() {
		return this._equipmentSlot;
	},
	
	getAttackValue: function() {
		return this._attackValue;
	},
	
	getDefenseValue: function() {
		return this._defenseValue;
	},
	
	listeners: {
		getInventoryActions: function() {
			if (Core.getGame().getPlayer().getBodyPart(this.getEquipmentSlot()).getEquipped() === this) {
				return [
					{ text: 'unequip', action: this.unequip }
				];
			}
			else {
				return [
					{ text: 'equip', action: this.equip }
				];
			}
		}
	},
	
	init: function(properties) {
		this._equipmentSlot = properties.equipmentSlot || null;
		
		this._attackValue = properties.attackValue || 0;
		this._defenseValue = properties.defenseValue || 0;
	},
	
	equip: function(entity) {	
		if (entity.hasComponent('Body')) {
			return entity.equip(this);
		}
		
		return false;
	},
	
	unequip: function(entity) {
		if (entity.hasComponent('Body')) {
			return entity.unequip(this.getEquipmentSlot());
		}
		
		return false;
	}
};