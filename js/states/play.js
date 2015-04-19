$.statePlay = {};

$.statePlay.create = function() {
	this.tick = 0;
	this.walls = new $.pool( $.wall, 100 );
	this.enemies = new $.pool( $.enemy, 100 );
	this.particles = new $.pool( $.particle, 300 );
	this.pings = new $.pool( $.ping, 100 );
	this.hero = new $.hero();

	this.level = null;
	this.generateLevel( 2 );
};

$.statePlay.step = function( dt ) {
	this.walls.each( 'step' );
	this.enemies.each( 'step' );
	this.particles.each( 'step' );
	this.pings.each( 'step' );
	this.hero.step();
	this.tick++;
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( '#000' );
	$.ctx.lineWidth( 4 );

	this.walls.each( 'render' );
	this.enemies.each( 'render' );
	this.particles.each( 'render' );
	this.pings.each( 'render' );
	this.hero.render();

	var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( $.game.mouse.x, $.game.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( '#fff');
	$.ctx.strokeRect( -8, -8, 16, 16 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.hero.charge( e.x, e.y );
	} else if( e.button == 'right' ) {
		this.hero.warp( e.x, e.y );
	}
};

$.statePlay.generateLevel = function( level ) {
	this.level = {};
	this.level.data = $.levels[ level - 1 ];
	this.level.size = parseInt( this.level.data.properties.size );
	this.level.map = this.level.data.layers[ 0 ].data;
	this.level.width = this.level.data.width;
	this.level.height = this.level.data.height;
	this.level.hue = this.level.data.properties.hue;
	this.level.padding = 10;

	for( var row = 0; row < this.level.height; row++ ) {
		for( var col = 0; col < this.level.width; col++ ) {
			var value = this.level.map[ ( row * this.level.width ) + col ] - 1;
			
			// empty
			if( $.mapKey[ value ] == 'empty' ) {
			}

			// wall
			if( $.mapKey[ value ] == 'wall' ) {
				this.walls.create({
					x: col * this.level.size,
					y: row * this.level.size,
					w: this.level.size,
					h: this.level.size
				});
			}

			// enemy
			if( $.mapKey[ value ] == 'enemy' ) {
				this.enemies.create({
					x: col * this.level.size,
					y: row * this.level.size,
					w: this.level.size,
					h: this.level.size
				});
			}

			// hero start
			if( $.mapKey[ value ] == 'start' ) {
				this.hero.x = col * this.level.size + this.level.size / 2;
				this.hero.y = row * this.level.size + this.level.size / 2;
			}
		}
	}
}