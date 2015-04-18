$.ping = function( opt ) {};

$.ping.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.life = 1;
	if( this.grow ) {
		this.radius = 0;
		this.tween = $.game.tween( this )
			.to( { radius: 40 }, 0.35, 'outExpo' );
	} else {
		this.radius = 40;
		this.tween = $.game.tween( this )
			.to( { radius: 0 }, 0.35, 'outExpo' );
	}
};

$.ping.prototype.step = function() {
	if( this.tween.finished == true ) {
		$.game.state.pings.release( this );
	}
};

$.ping.prototype.render = function() {
	$.ctx.lineWidth( 2 )
	$.ctx.fillStyle( 'hsla(' + $.game.state.hero.hue + ', 90%, 10%, ' + ( 1 - this.tween.progress ) + ')' );
	$.ctx.fillCircle( this.x, this.y, Math.max( 0, this.radius ) );
	$.ctx.strokeStyle( 'hsla(' + $.game.state.hero.hue + ', 90%, 70%, ' + ( 1 - this.tween.progress ) + ')' );
	$.ctx.strokeCircle( this.x, this.y, Math.max( 0, this.radius ) );
};