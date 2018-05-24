Core.Screens.itemDetailsScreen = {
	init: function(properties) {
		properties = properties || {};
		
		this._item = properties.item || null;
		
		if (!this._item) {
			return Core.Screens.inventoryScreen.init();
		}
		
		var actions = this._item.raiseEvent('getInventoryActions');
		this._items = [];
		
		for (var i = 0; i < actions.length; i++) {
			for (var j = 0; j < actions[i].length; j++) {
				this._items.push(actions[i][j]);
			}
		}
		
		this._items.push({ text: 'drop', action: this.drop })
		this._selectedIndex = 0;
		
		return this;
	},
	
	render: function(display) {
		display.drawText(1, 1, '%c{gold}%s'.format(this._item.getName()));
		
		var y = 2;
		
		for (var i = 0; i < this._items.length; i++) {
			var colour = this._selectedIndex === i ? 'white' : 'dimGray';
			display.drawText(2, y++, '%c{%s}%s'.format(colour, this._items[i].text));
		}
	},
	
	handleInput: function(inputType, inputData) {
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_ESCAPE) {
				Core.Screens.playScreen.setSubScreen(null);
			}
			
			if (inputData.keyCode === ROT.VK_UP) {
				this.moveCursor(-1);
			}
			else if (inputData.keyCode === ROT.VK_DOWN) {
				this.moveCursor(1);
			}
			else if (inputData.keyCode === ROT.VK_RETURN) {
				this.select();
			}
		}
	},
	
	moveCursor: function(direction) {
		if (direction > 0) {
			this._selectedIndex = Math.min(this._selectedIndex + 1, this._items.length - 1);
		}
		else if (direction < 0) {
			this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
		}
		
		if (Math.abs(direction) > 0) {
			Core.refresh();
		}
	},
	
	select: function() {
		if (!this._items || this._items.length === 0) {
			return;
		}
		
		var selectedAction = this._items[this._selectedIndex];
		
		if (selectedAction) {			
			if (selectedAction.action) {				
				if (selectedAction.action.call(this._item, Core.getGame().getPlayer()))
				{
					Core.Screens.playScreen.setSubScreen(null);
					return;
				}
			}
		}
	},
	
	drop: function(entity) {
		if (this.hasComponent('Equipment')) {
			if (entity.getBodyPart(this.getEquipmentSlot()).getEquipped() === this) {
				entity.unequip(this.getEquipmentSlot());
			}
		}
		
		return entity.dropItem(this);
	}
};