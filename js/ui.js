Core.UI = {
	init: function() {
		this._hpBar = {
			valueElement: document.getElementById('healthBarValue'),
			valueTextElement: document.getElementById('healthBarText'),
			
			update: function(hp, maxHp) {
				var healthPercent = (hp / maxHp) * 100;
				
				this.valueElement.setAttribute('style', 'width: %s%;'.format(healthPercent));
				this.valueTextElement.innerHTML = '%s / %s'.format(hp, maxHp);
			}
		};
	},
	
	update: function() {
		var player = Core.getGame().getPlayer();
		
		this._hpBar.update(player.getHp(), player.getMaxHp());
	}
};