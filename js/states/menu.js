$.stateMenu = {};

$.stateMenu.create = function() {
};

$.stateMenu.enter = function() {
	this.tick = 0;
	this.particles = new $.pool( $.particle, 100 );
	this.button = {
		x: 340,
		y: 440,
		w: 220,
		h: 80
	};
	this.hoveringButton = false;
};

$.stateMenu.exit = function() {
	this.particles = null;
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

	if( $.pointInRect( $.game.mouse.x, $.game.mouse.y, this.button.x, this.button.y, this.button.w, this.button.h ) ) {
		this.hoveringButton = true;
	} else {
		this.hoveringButton = false;
	}
};

$.stateMenu.render = function( dt ) {
	$.ctx.clear( $.game.clearColor );

	this.particles.each( 'render' );
	
	$.ctx.drawImage( $.game.images[ 'title' ], 100, 80 );

	$.ctx.font( '13px droidsansmono' );
	$.ctx.textBaseline( 'top' );

	$.ctx.textAlign( 'right' );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillText( 'BUILT FOR LUDUM DARE 32', 280, 445 );
	$.ctx.fillText( 'AN UNCONVENTIONAL WEAPON', 280, 470 );
	$.ctx.fillText( 'MADE BY JACK RUGILE', 280, 495 );
	
	$.ctx.textAlign( 'left' );
	$.ctx.fillText( 'FASTEST RUN / ' + $.msToString( $.storage.get( 'fastestRun' ) * 1000 ), 620, 445 );
	$.ctx.fillText( 'TOTAL TIME / ' + $.msToString( $.storage.get( 'totalTime' ) * 1000 ), 620, 470 );
	$.ctx.fillText( 'TOTAL CLICKS / ' + $.formatCommas( $.storage.get( 'totalClicks' ) ), 620, 495 );

	$.ctx.font( '40px droidsansmono' );
	$.ctx.textAlign( 'center' );
	if( this.hoveringButton ) {
		$.ctx.fillStyle( 'hsla(120, 70%, 50%, 1)' );
		$.ctx.fillRect( this.button.x, this.button.y, this.button.w, this.button.h );
		$.ctx.fillStyle( '#fff' );
	} else {
		$.ctx.fillStyle( '#fff' );
		$.ctx.fillRect( this.button.x, this.button.y, this.button.w, this.button.h );
		$.ctx.fillStyle( '#222' );
	}
	$.ctx.fillText( 'PLAY', $.game.width / 2, 452 );


	$.ctx.drawImage( $.game.images[ 'light' ], $.game.width / 2 - 900 + Math.sin( this.tick / 150 ) * 300, $.game.height / 2 - 700 + Math.cos( this.tick / 175 ) * 75 );
	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
	$.game.renderCursor();
};

$.stateMenu.mousedown = function( e ) {
	if( this.hoveringButton ) {
		$.game.setState( $.stateTutorial );
	}
};