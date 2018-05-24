Core.Screens.inventoryScreen = {
	_selectedIndex: 0,
	
	init: function(properties) {
		properties = properties || {};
		
		this._player = Core.getGame().getPlayer();
		this._items = this._player.getItems();
		
		return this;
	},
	
	render: function(display) {		
		display.drawText(1, 1, '%c{gold}Inventory');
		
		var y = 2;
				
		for (var i = 0; i < this._items.length; i++) {
			var colour = this._selectedIndex === i ? 'white' : 'dimGray';
			display.drawText(2, y++, '• %c{%s}%s'.format(colour, this._items[i].getName()))
		}
	},
	
	handleInput: function(inputType, inputData) {
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_ESCAPE) {
				Core.Screens.playScreen.setSubScreen(null);
			}
			
			if (this._items.length > 0) {
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
		
		var item = this._items[this._selectedIndex];
		
		if (item) {
			Core.Screens.playScreen.setSubScreen(Core.Screens.itemDetailsScreen.init({item: item}));
		}
	}
};