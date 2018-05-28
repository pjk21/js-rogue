Core.Screens.playScreen = {
	_subScreen: null,
	
	init: function(data) {
		data = data || {};
		
		Core.setGame(data.game || new Core.Game());
		
		Core.getGame().init();
		Core.getGame().getEngine().start();
	},
	
	render: function(display) {
		if (this._subScreen) {
			this._subScreen.render(display);
			return;
		}
		
		var map = Core.getGame().getMap();
		var player = Core.getGame().getPlayer();
		
		var visibleCells = {};		
		map.getFov().compute(player.getX(), player.getY(), player.getSightRadius(), function(x, y, radius, visibility) {
			var index = map.getCellIndex(x, y);
			visibleCells[index] = true;
			
			map.setExplored(x, y, true);
		});
		
		var bounds = this.getCameraPosition(map, player);
		
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
	
	getCameraPosition: function(map, player) {		
		return {
			x: Math.min(Math.max(0, player.getX() - Core.getWidth() / 2), map.getWidth() - Core.getWidth()),
			y: Math.min(Math.max(0, player.getY() - Core.getHeight() / 2), map.getHeight() - Core.getHeight())
		};
	},
	
	handleInput: function(inputType, inputData) {
		var player = Core.getGame().getPlayer();
		var didAct = false;
	
		if (inputType === 'keydown') {
			if (Core.getGame().getEnded()) {
				Core.setScreen(Core.Screens.mainMenuScreen);
			}
			
			if (this._subScreen) {
				this._subScreen.handleInput(inputType, inputData);
				return;
			}
			
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
			else if (inputData.keyCode === ROT.VK_I) {
				this.setSubScreen(Core.Screens.inventoryScreen.init());
			}
			else if (inputData.keyCode === ROT.VK_SPACE) {
				didAct = player.rest();
			}
			else if (inputData.keyCode === ROT.VK_COMMA && inputData.shiftKey) {
				didAct = Core.getGame().descend();
			}
		}		
		else if (inputType === 'click') {
			didAct = this.handleMouseInput(inputData);
		}
		
		if (didAct) {
			player.endTurn();
			Core.getGame().getEngine().unlock();
		}
	},
	
	handleMouseInput: function(data) {
		var map = Core.getGame().getMap();
		var player = Core.getGame().getPlayer();
		
		var cameraPosition = this.getCameraPosition(map, player);
		var screenPosition = Core.getDisplay().eventToPosition(data);
		var worldPosition = { 
			x: cameraPosition.x + screenPosition[0],
			y: cameraPosition.y + screenPosition[1]
		};
		
		if (map.isExplored(worldPosition.x, worldPosition.y)) {			
			var path = new ROT.Path.AStar(worldPosition.x, worldPosition.y, function(x, y) {
				var blockingEntity = map.getEntityAt(x, y);
			
				if (blockingEntity && blockingEntity !== player) {
					return false;
				}
				
				if (!map.isExplored(x, y)) {
					return false;
				}
			
				return map.getTile(x, y).isWalkable();
			}, { topology: 4 });
			
			var playerPath = [];
						
			path.compute(player.getX(), player.getY(), function(x, y) {
				playerPath.push({ x: x, y: y});
			});
			
			playerPath.shift();
			
			if (playerPath.length > 0) {
				player.setPath(playerPath);
				return true;
			}
		}
		
		return false;
	},
	
	setSubScreen: function(screen) {
		this._subScreen = screen;
		Core.refresh();
	}
};