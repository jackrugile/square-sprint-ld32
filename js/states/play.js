$.statePlay = {};

$.statePlay.create = function() {
	this.tick = 0;
	this.hero = new $.hero();
	this.particles = new $.pool( $.particle, 300 );
	this.pings = new $.pool( $.ping, 50 );
	this.enemies = new $.pool( $.enemy, 50 );
};

$.statePlay.step = function( dt ) {
	this.particles.each( 'step' );
	this.pings.each( 'step' );
	this.enemies.each( 'step' );
	this.hero.step();
	this.tick++;

	if( this.tick % 50 == 0 ) {
		this.enemies.create({
			x: $.game.width,
			y: $.game.height / 2 - 64,
			w: 40,
			h: 40
		});
	}
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( 'hsla(' + this.hero.hue + ', 10%, 10%, 1)' );

	this.particles.each( 'render' );
	this.pings.each( 'render' );
	this.enemies.each( 'render' );
	this.hero.render();

	var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( $.game.mouse.x, $.game.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( 'hsla(' + this.hero.hue + ', 100%, 70%, 0.5)' );
	$.ctx.strokeRect( -8, -8, 16, 16 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();

	/*$.ctx.lineWidth( 2 );
	$.ctx.strokeStyle( 'rgba(255, 255, 255, 0.5 )' );
	//$.ctx.strokeCircle( $.game.width / 2 + Math.cos( this.tick * 0.02 ) * 50, $.game.height / 2 + Math.sin( this.tick * 0.02 ) * 50, 16 );
	$.ctx.strokeCircle( $.game.width / 2, $.game.height / 2 + Math.sin( this.tick * 0.02 ) * 100, 32 );*/




	/*var p1 = { x: 450, y: 200 },
		p2 = { x: 550, y: 300 },
		circle = {
			x: 300,
			y: 200,
			r: 130
		},
		collision = $.circleLineIntersect( p1.x, p1.y, p2.x, p2.y, circle.x, circle.y, circle.r );

	console.log( collision );

	$.ctx.beginPath();
	$.ctx.moveTo( p1.x, p1.y );
	$.ctx.lineTo( p2.x, p2.y );
	$.ctx.strokeStyle( '#fff' );
	$.ctx.stroke();

	$.ctx.beginPath();
	$.ctx.strokeCircle( circle.x, circle.y, circle.r );*/
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.hero.charge( e.x, e.y );
	} else if( e.button == 'right' ) {
		this.hero.warp( e.x, e.y );
	}
};