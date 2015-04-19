$.wall = function( opt ) {};

$.wall.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.clickTick = 0;
	this.clickTickMax = 10;
};

$.wall.prototype.step = function() {
	if( this.clickTick > 0 ) {
		this.clickTick--;
	}
};

$.wall.prototype.render = function() {
	//$.ctx.fillStyle( 'hsla(' + $.game.state.level.hue + ', 0%, 0%, 1)' );
	//$.ctx.fillRect( this.x, this.y, this.w, this.h );

	var scale = 0.9 + Math.sin( $.game.lifetime * 4 ) * 0.05;
	$.ctx.save();
	$.ctx.translate( this.x + this.w / 2 , this.y + this.h / 2 );
	$.ctx.scale( scale, scale );
	$.ctx.fillStyle( this.clickTick ? 'hsla(0, 0%, ' + ( 0.25 + ( ( this.clickTick / this.clickTickMax ) * 0.75 ) * 100 ) + '%, 1)' : '#1e1e1e' );
	$.ctx.fillRect( -this.w / 2, -this.h / 2, this.w, this.h );
	$.ctx.restore();
};