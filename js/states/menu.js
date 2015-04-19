$.stateMenu = {};

$.stateMenu.create = function() {
	this.tick = 0;

	this.particles = new $.pool( $.particle, 100 );
};

$.stateMenu.step = function( dt ) {
	this.tick++;

	this.particles.each( 'step' );

	if( this.tick % 3 == 0 ) {
		this.particles.create({
			x: $.rand( 100, 800 ),
			y: $.rand( 120, 340 ),
			vx: $.rand( -0.25, 0.25 ),
			vy: $.rand( -0.25, -0.5 ),
			decay: 0.005,
			hue: 0,
			desaturated: true
		});
	}
};

$.stateMenu.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	this.particles.each( 'render' );
	
	$.ctx.drawImage( $.game.images[ 'title' ], 100, 80 );

	

	$.game.renderCursor();

	$.ctx.drawImage( $.game.images[ 'light' ], $.game.width / 2 - 900 + Math.sin( this.tick / 150 ) * 300, $.game.height / 2 - 700 + Math.cos( this.tick / 175 ) * 75 );

	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
};

$.stateMenu.mousedown = function( e ) {
	$.game.setState( $.statePlay );
};