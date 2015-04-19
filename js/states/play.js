$.statePlay = {};

$.statePlay.create = function() {
	this.lightPosition = { x: 0, y: 0 };
	this.level = null;
	this.levelNumber = location.hash ? parseInt( location.hash.substring( 1 ) ) : 1;
	this.levelTotal = $.levels.length;
	this.generateLevel( this.levelNumber );
};

$.statePlay.step = function( dt ) {
	this.walls.each( 'step' );
	this.enemies.each( 'step' );
	this.particles.each( 'step' );
	this.pings.each( 'step' );
	this.hero.step();

	this.level.progress += ( ( this.level.killed / this.level.total ) - this.level.progress ) * 0.3;

	if( this.level.progress >= 0.999 ) {
		if( this.levelNumber < this.levelTotal ) {
			this.cleanUpLevel();
			this.levelNumber++;
			this.generateLevel( this.levelNumber );
		} else {
			console.log( 'you win!' );
		}
	}

	this.lightPosition.x += ( this.hero.x - 900 - this.lightPosition.x ) * 0.1;
	this.lightPosition.y += ( this.hero.y - 600 - this.lightPosition.y ) * 0.1;

	this.tick++;
};

$.statePlay.render = function( dt ) {
	$.ctx.clear( '#222' );

	this.walls.each( 'render' );
	this.enemies.each( 'render' );
	this.particles.each( 'render' );
	this.pings.each( 'render' );
	this.hero.render();

	$.ctx.fillStyle( 'hsla(0, 0%, 100%, 1)' );
	$.ctx.fillRect( 0, $.game.height - 1, this.level.progress * $.game.width, 1 );

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

	$.ctx.drawImage( $.game.images[ 'light' ], this.lightPosition.x, this.lightPosition.y );

	$.ctx.drawImage( $.game.images[ 'screen-overlay' ], 0, 0 );
};

$.statePlay.mousedown = function( e ) {
	if( e.button == 'left' ) {
		this.hero.charge( e.x, e.y );
	} else if( e.button == 'right' ) {
		this.hero.warp( e.x, e.y );
	}
};

$.statePlay.generateLevel = function( level ) {
	this.tick = 0;

	this.level = {};
	this.level.data = $.levels[ level - 1 ];
	this.level.size = parseInt( this.level.data.properties.size );
	this.level.map = this.level.data.layers[ 0 ].data;
	this.level.width = this.level.data.width;
	this.level.height = this.level.data.height;
	this.level.hue = parseInt( this.level.data.properties.hue );
	this.level.progress = 0;
	this.level.total = 0;
	this.level.killed = 0;
	this.level.padding = 0;

	this.walls = new $.pool( $.wall, 100 );
	this.enemies = new $.pool( $.enemy, 100 );
	this.particles = new $.pool( $.particle, 300 );
	this.pings = new $.pool( $.ping, 100 );
	this.hero = new $.hero();

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
				this.level.total++;
			}

			// hero start
			if( $.mapKey[ value ] == 'start' ) {
				this.hero.x = col * this.level.size + this.level.size / 2;
				this.hero.y = row * this.level.size + this.level.size / 2;
			}
		}
	}
};

$.statePlay.cleanUpLevel = function( level ) {
	this.walls = null;
	this.enemies = null;
	this.particles = null;
	this.pings = null;
	this.hero = null;
};