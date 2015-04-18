$.particle = function( opt ) {};

$.particle.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.drag = 0.99;
	this.life = 1;
	this.radius = $.rand( 0.5, 2 );
	this.alphaBase = $.rand( 0.25, 1 );
};

$.particle.prototype.step = function() {
	this.vx *= this.drag;
	this.vy *= this.drag;

	this.x += this.vx;
	this.y += this.vy;

	this.life -= this.decay;

	if( this.life <= 0 ) {
		$.game.state.particles.release( this );
	}
};

$.particle.prototype.render = function() {
	$.ctx.fillStyle( 'hsla(' + $.game.state.hero.hue + ', 90%, 70%, ' + ( this.life * this.alphaBase ) + ')' );
	$.ctx.fillCircle( this.x, this.y, this.radius );
};