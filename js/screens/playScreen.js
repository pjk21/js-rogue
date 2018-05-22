Core.Screens.playScreen = {	
	init: function(data) {
		data = data || {};
		
		Core.setGame(data.game || new Core.Game());
		
		Core.getGame().init();
		Core.getGame().getEngine().start();
	},
	
	render: function(display) {
		var map = Core.getGame().getMap();
		var player = Core.getGame().getPlayer();
		
		var visibleCells = {};		
		map.getFov().compute(player.getX(), player.getY(), player.getSightRadius(), function(x, y, radius, visibility) {
			var index = map.getCellIndex(x, y);
			visibleCells[index] = true;
			
			map.setExplored(x, y, true);
		});
		
		var bounds = {
			x: Math.min(Math.max(0, player.getX() - Core.getWidth() / 2), map.getWidth() - Core.getWidth()),
			y: Math.min(Math.max(0, player.getY() - Core.getHeight() / 2), map.getHeight() - Core.getHeight())
		};
		
		for (var x = bounds.x; x < bounds.x + Core.getWidth(); x++) {
			for (var y = bounds.y; y < bounds.y + Core.getHeight(); y++) {
				var index = map.getCellIndex(x, y);
				
				if (map.isExplored(x, y)) {
					var tile = map.getTile(x, y);
					
					var glyph = tile.getGlyph();
					var colour = tile.getColour();
					var backColour = tile.getBackColour();
					
					if (visibleCells[index]) {
						var items = map.getItemsAt(x, y);
						
						if (items) {
							var item = items[items.length - 1];
							glyph = item.getGlyph();
							colour = item.getColour();
							
							if (item.getBackColour()) {
								backColour = item.getBackColour();
							}
						}
						
						if (map.getEntityAt(x, y)) {
							var entity = map.getEntityAt(x, y);
							
							glyph = entity.getGlyph();
							colour = entity.getColour();
							
							if (entity.getBackColour()) {
								backColour = entity.getBackColour();
							}
						}
					} else {
						var fogColour = [ 34, 32, 52 ];
						var fogPercent = 0.7;
						
						colour = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(tile.getColour()), fogColour, fogPercent));
						backColour = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(tile.getBackColour()), fogColour, fogPercent));
					}
					
					display.draw(x - bounds.x, y - bounds.y, glyph, colour, backColour);
				}
			}
		}
		
		if (Core.getGame().getEnded()) {
			var gameOverText = [ 'You have died', 'Press any key to continue' ];
			var gameOverTextY = Math.floor(Core.getHeight() / 2) - Math.floor(gameOverText.length / 2);
			
			for (var i = 0; i < gameOverText.length; i++) {
				display.drawText(Core.getWidth() / 2 - gameOverText[i].length / 2, gameOverTextY++, '%c{white}%b{red}' + gameOverText[i]);	
			}
		}
		
		Core.UI.update();
	},
	
	handleInput: function(inputType, inputData) {
		if (inputType === 'keydown') {
			if (Core.getGame().getEnded()) {
				Core.setScreen(Core.Screens.mainMenuScreen);
			}
			
			var player = Core.getGame().getPlayer();
			var didAct = false;
			
			if (inputData.keyCode === ROT.VK_ESCAPE) {
				Core.setScreen(Core.Screens.mainMenuScreen);				
			}
			else if (inputData.keyCode === ROT.VK_LEFT) {
				didAct = player.move(-1, 0);
			}
			else if (inputData.keyCode === ROT.VK_RIGHT) {
				didAct = player.move(1, 0);
			}
			else if (inputData.keyCode === ROT.VK_UP) {
				didAct = player.move(0, -1);
			}
			else if (inputData.keyCode === ROT.VK_DOWN) {
				didAct = player.move(0, 1);
			}
			else if (inputData.keyCode === ROT.VK_G) {
				didAct = player.takeItem();
			}
			
			if (didAct) {
				Core.getGame().getEngine().unlock();
			}
		}
	}
};