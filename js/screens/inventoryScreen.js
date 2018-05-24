Core.Screens.inventoryScreen = {
	init: function(properties) {
		properties = properties || {};
		
		this._player = Core.getGame().getPlayer();
		
		this._items = this._player.getItems();
		this._equipment = [];
		
		for (var key in this._player.getBody()) {
			this._equipment.push(this._player.getBodyPart(key));
		}
		
		this._selectedItemIndex = 0;
		this._selectedEquipmentIndex = 0;
		
		this._mode = 'Items';
		
		return this;
	},
	
	render: function(display) {		
		this.renderItems(display);
		this.renderEquipment(display);
	},
	
	renderItems: function(display) {
		var titleColour = this._mode === 'Items' ? 'gold' : 'gray';
		display.drawText(1, 1, '%c{%s}Inventory'.format(titleColour));
		
		var y = 2;
				
		for (var i = 0; i < this._items.length; i++) {
			var colour = 'dimGray';
			
			if (this._mode === 'Items' && this._selectedItemIndex === i) {
				colour = 'white';
				display.drawText(2, y, '%c{white}>');
			}
			
			display.drawText(4, y++, '%c{%s}%s'.format(colour, this._items[i].getName()))
		}		
	},
	
	renderEquipment: function(display) {
		var titleColour = this._mode === 'Equipment' ? 'gold' : 'gray';
		display.drawText(Core.getWidth() / 2, 1, '%c{%s}Equipment'.format(titleColour));
		
		var y = 2;
		
		for (var i = 0; i < this._equipment.length; i++) {
			var bodyPart = this._equipment[i];
			
			display.drawText(Core.getWidth() / 2 + 3, y, '%c{%s}%s'.format(titleColour, bodyPart.getName()));
			
			if (bodyPart.getEquipped()) {
				var colour = 'dimGray';
				
				if (this._mode === 'Equipment' && this._selectedEquipmentIndex === i) {
					colour = 'white';
					display.drawText(Core.getWidth() - 25, y, '> ');
				}
				
				display.drawText(Core.getWidth() - 23, y++, '%c{%s}%s'.format(colour, bodyPart.getEquipped().getName()));
			}
			else {
				display.drawText(Core.getWidth() - 23, y++, '%c{dimGray}none');
			}
		}
	},
	
	handleInput: function(inputType, inputData) {	
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_ESCAPE) {
				Core.Screens.playScreen.setSubScreen(null);
			}
		}
	
		if (this._mode === 'Items') {
			this.handleItemsInput(inputType, inputData);
		}
		else if (this._mode === 'Equipment') {
			this.handleEquipmentInput(inputType, inputData);
		}
	},
	
	handleItemsInput: function(inputType, inputData) {
		if (inputData.keyCode === ROT.VK_UP) {
			this.moveCursor(-1);
		}
		else if (inputData.keyCode === ROT.VK_DOWN) {
			this.moveCursor(1);
		}
		else if (inputData.keyCode === ROT.VK_RIGHT) {
			this.changeMode('Equipment');
		}
		else if (inputData.keyCode === ROT.VK_RETURN) {
			this.select();
		}
	},
	
	handleEquipmentInput: function(inputType, inputData) {
		if (inputData.keyCode === ROT.VK_UP) {
			this.moveCursor(-1);
		}
		else if (inputData.keyCode === ROT.VK_DOWN) {
			this.moveCursor(1);
		}
		else if (inputData.keyCode === ROT.VK_LEFT) {
			this.changeMode('Items');
		}
		else if (inputData.keyCode === ROT.VK_RETURN) {
			this.select();
		}
	},
	
	changeMode: function(mode) {
		this._mode = mode;
		Core.refresh();
	},
	
	moveCursor: function(direction) {
		if (this._mode === 'Items') {
			if (direction > 0) {
				this._selectedItemIndex = Math.min(this._selectedItemIndex + 1, this._items.length - 1);
			}
			else if (direction < 0) {
				this._selectedItemIndex = Math.max(this._selectedItemIndex - 1, 0);
			}
		}
		else if (this._mode === 'Equipment') {
			if (direction > 0) {
				for (this._selectedEquipmentIndex + 1; this._selectedEquipmentIndex < this._equipment.length; this._selectedEquipmentIndex++) {
					if (this._equipment[this._selectedEquipmentIndex].getEquipped()) {
						break;
					}
				}
			}
			else if (direction < 0) {
				for (this._selectedEquipmentIndex - 1; this._selectedEquipmentIndex > 0; this._selectedEquipmentIndex--) {
					if (this._equipment[this._selectedEquipmentIndex].getEquipped()) {
						break;
					}
				}	
			}
		}
		
		if (Math.abs(direction) > 0) {
			Core.refresh();
		}
	},
	
	select: function() {
		if (this._mode === 'Items') {
			if (!this._items || this._items.length === 0) {
				return;
			}
			
			var item = this._items[this._selectedItemIndex];
			
			if (item) {
				Core.Screens.playScreen.setSubScreen(Core.Screens.itemDetailsScreen.init({item: item}));
			}
		}
		else if (this._mode === 'Equipment') {
			if (!this._equipment || this._equipment.length === 0) {
				return;
			}
			
			var item = this._equipment[this._selectedEquipmentIndex].getEquipped();
			
			if (item) {
				Core.Screens.playScreen.setSubScreen(Core.Screens.itemDetailsScreen.init({item: item}));
			}
		}
	}
};