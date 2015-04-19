$.wall = function( opt ) {};

$.wall.prototype.init = function( opt ) {
	$.merge( this, opt );
};

$.wall.prototype.step = function() {
};

$.wall.prototype.render = function() {
	//$.ctx.fillStyle( 'hsla(' + $.game.state.level.hue + ', 0%, 0%, 1)' );
	//$.ctx.fillRect( this.x, this.y, this.w, this.h );

	var scale = 0.95 + Math.sin( $.game.lifetime * 4 ) * 0.05;
	$.ctx.save();
	$.ctx.translate( this.x + this.w / 2 , this.y + this.h / 2 );
	$.ctx.scale( scale, scale );
	$.ctx.fillStyle( '#1c1c1c' );
	$.ctx.fillRect( -this.w / 2, -this.h / 2, this.w, this.h );
	$.ctx.restore();


	var scale = 0.75 + Math.cos( $.game.lifetime * 4 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( this.x + this.w / 2 , this.y + this.h / 2 );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( $.game.lifetime * 2 );
	$.ctx.fillStyle( '#444' );
	$.ctx.fillRect(	-4, -4, 8, 8 );
	$.ctx.restore();
};