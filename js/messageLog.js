Core.MessageLog = {
	_types: {
		'default': 'white',
		'info': 'blue',
		'combat': 'red'
	},
	
	init: function() {
		this._messagesElement = document.getElementById('messageLogContent');
		this._messages = [];
	},

	add: function(text, type) {
		if (!text) {
			return;
		}
		
		colour = this._types[type] || this._types['default'];
		text = text + Math.random() * 20;
		
		var message = document.createElement('li');
		message.setAttribute('style', 'color: ' + colour + ';');
		message.innerHTML = text;
		
		this._messagesElement.prepend(message);
		
		this._messages.push({ text: text, colour: colour, htmlElement: message });
	},

	clear: function() {
		while (this._messagesElement.firstChild) {
			this._messagesElement.removeChild(this._messagesElement.firstChild);
		}
		
		this._messages = [];
	},

	toggle: function() {
		this._messagesElement.classList.toggle('collapsed');
	},
	
	show: function() {
		document.getElementById('messageLog').setAttribute('class', '');
	},
	
	hide: function() {
		document.getElementById('messageLog').setAttribute('class', 'collapsed');
	}
}