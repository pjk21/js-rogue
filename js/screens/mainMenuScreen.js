Core.Screens.mainMenuScreen = {
	_menuIndex: 0,
	_menuItems: [ 
		{ 
			text: 'New Game',
			onSelect: function() {
				Core.Screens.playScreen.init();
				Core.setScreen(Core.Screens.playScreen);
			}
		}, 
		{ 
			text: 'Load Game',
			onSelect: function() {
				Core.Screens.playScreen.init();
				Core.setScreen(Core.Screens.playScreen);
			}
		}
	],
	
	enter: function() {
		this._menuIndex = 0;
		Core.MessageLog.hide();
	},
	
	render: function(display) {
		var lineOne = 'Roguelike: The Movie: The Game';
		
		display.drawText(Core.getWidth() / 2 - lineOne.length / 2, 1, '%c{yellow}' + lineOne);
		
		var y = 3;
		var longest = 0;
		
		for (var i = 0; i < this._menuItems.length; i++) {
			var colour = 'white';
			
			if (i === this._menuIndex) {
				colour = 'yellow';
			}
			
			if (this._menuItems[i].text.length > longest) {
				longest = this._menuItems[i].text.length;
			}
			
			display.drawText(Core.getWidth() / 2 - this._menuItems[i].text.length / 2, y++, '%c{' + colour + '}' + this._menuItems[i].text);
		}
		
		display.draw(Core.getWidth() / 2 - longest / 2 - 2, 3 + this._menuIndex, '>', 'yellow');
		display.draw(Core.getWidth() / 2 + longest / 2 + 1, 3 + this._menuIndex, '<', 'yellow');
	},
	
	handleInput: function(inputType, inputData) {
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_UP) {
				this._menuIndex = Math.max(this._menuIndex - 1, 0);
				return true;
			}
			else if (inputData.keyCode === ROT.VK_DOWN) {
				this._menuIndex = Math.min(this._menuIndex + 1, this._menuItems.length - 1);
				return true;
			}
			else if (inputData.keyCode === ROT.VK_RETURN) {
				if (this._menuItems[this._menuIndex].onSelect) {
					this._menuItems[this._menuIndex].onSelect();
				}
			}
		}
	}
}