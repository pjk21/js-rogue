var Core = {
	_display: null,
	
	_width: 80,
	_height: 26,
	
	_currentScreen: null,
	
	_game: null,
	
	getDisplay: function() {
		return this._display;
	},
	
	getWidth: function() {
		return this._width;
	},
	
	getHeight: function() {
		return this._height;
	},
	
	getCurrentScreen: function() {
		return this._currentScreen;
	},
	
	getGame: function() {
		return this._game;
	},
	
	setGame: function(game) {
		this._game = game;
	},
	
	init: function() {
		this._display = new ROT.Display({ width: this._width, height: this._height, bg: '#222034', fontFamily: 'Oxygen Mono' });
		
		var core = this;
		
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if (core._currentScreen) {
					if (core._currentScreen.handleInput(event, e)) {
						core.refresh();
					}
				}
			});
		};
		
		bindEventToScreen('keydown');
		bindEventToScreen('keypress');
		
		this.MessageLog.init();
	},
	
	setScreen: function(screen) {
		if (this.getCurrentScreen() && this.getCurrentScreen().exit !== undefined) {
			this.getCurrentScreen().exit();
		}
		
		this._currentScreen = screen;
		
		if (this.getCurrentScreen()) {
			if (this.getCurrentScreen().enter !== undefined) {
				this.getCurrentScreen().enter();
			}
			
			this.refresh();
		}
	},
	
	refresh: function() {
		this.getDisplay().clear();
		this.getCurrentScreen().render(this.getDisplay());
	}
};

// Modules
Core.Screens = {};
Core.Tiles = {};
Core.Components = {};

window.onload = function() {
	if (!ROT.isSupported()) {
		var errorMessageDiv = document.createElement("div");
		errorMessageDiv.setAttribute("style", "color: red; text-align: center;");
		
		var errorMessageText = document.createElement("h1");
		errorMessageText.innerHTML = "Fatal Error: Your browser does not support ROT.";
		
		errorMessageDiv.append(errorMessageText);
		
		document.body.append(errorMessageDiv);
	}
	else {
		Core.init();
		
		var container = Core.getDisplay().getContainer();
		container.setAttribute("id", "gameCanvas");
		
		document.getElementById("game").prepend(container);
		
		Core.setScreen(Core.Screens.mainMenuScreen);
	}
};