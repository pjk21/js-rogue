Core.MessageLog = {
	_types: {
		'default': 'white',
		'info': 'lightBlue',
		'warning': 'orange',
		'combat': 'red',
		'success': 'lightGreen'
	},
	
	init: function() {
		this._messagesElement = document.getElementById('messageLogContent');
		this._messages = [];
	},

	add: function(text, type) {
		if (!text) {
			return;
		}
		
		var colour = this._types[type] || this._types['default'];
		
		var message = document.createElement('li');
		message.setAttribute('style', 'color: ' + colour + ';');
		message.innerHTML = text;
		
		this._messagesElement.prepend(message);
		
		this._messages.push({ text: text, colour: colour, htmlElement: message });
	
		setTimeout(function() { message.setAttribute('style', 'color: %s; opacity: 0.4;'.format(colour)); }, 3000);
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
};