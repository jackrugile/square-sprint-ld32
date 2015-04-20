$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.tick = 0;
	this.clearColor = '#222';

	this.loadImages(
		'screen-overlay',
		'light',
		'title',
		'left-mouse',
		'right-mouse'
	);

	this.loadSounds(
		'music',
		'warp1',
		'charge1',
		'explode1',
		'error1',
		'click1'
	);

	this.loadData( 'level1-6x4-150' );
	this.loadData( 'level2-6x4-150' );
	this.loadData( 'level3-9x6-100' );
	this.loadData( 'level4-9x6-100' );
	this.loadData( 'level5-15x10-60' );
	this.loadData( 'level6-15x10-60' );
	this.loadData( 'level7-18x12-50' );
	this.loadData( 'level8-18x12-50' );
	this.loadData( 'level9-30x20-30' );
	this.loadData( 'level10-30x20-30' );
	//this.loadData( 'test-level' );

	this.lastRoundTime = 0;
	this.lastRoundClicks = 0;

	// setup local storage
	$.storage = new $.storage( 'square-sprint' );

	// setup storage defaults if they don't exist
	if( $.isObjEmpty( $.storage.obj ) ) {
		$.storage.set( 'fastestRun', 0 );
		$.storage.set( 'totalTime', 0 );
		$.storage.set( 'totalClicks', 0 );
		$.storage.set( 'mute', 0 );
	}

	if( $.storage.get( 'mute' ) ) {
		this.sound.setMaster( 0 );
		this.music.setMaster( 0 );
	} else {
		this.sound.setMaster( 1 );
		this.music.setMaster( 0.5 );
	}

	$.ctx = this.layer;
};

$.game.ready = function() {
	$.mapKey = [
		'empty',
		'wall',
		'enemy',
		'start',
		''
	];

	$.levels = [
		this.data[ 'level1-6x4-150' ],
		this.data[ 'level2-6x4-150' ],
		this.data[ 'level3-9x6-100' ],
		this.data[ 'level4-9x6-100' ],
		this.data[ 'level5-15x10-60' ],
		this.data[ 'level6-15x10-60' ],
		this.data[ 'level7-18x12-50' ],
		this.data[ 'level8-18x12-50' ],
		this.data[ 'level9-30x20-30' ],
		this.data[ 'level10-30x20-30' ]
		//this.data[ 'test-level' ]
	];

	this.music.play( 'music', true );

	this.setState( $.stateMenu );
};

$.game.step = function( dt ) {
	this.tick++;
};

$.game.renderCursor = function() {
	var scale = 1 + Math.sin( this.tick * 0.1 ) * 0.25;
	$.ctx.save();
	$.ctx.translate( this.mouse.x, this.mouse.y );
	$.ctx.scale( scale, scale );
	$.ctx.rotate( this.tick * 0.05 );
	$.ctx.lineWidth( 1 );
	$.ctx.strokeStyle( '#fff');
	$.ctx.strokeRect( -8, -8, 16, 16 );
	$.ctx.fillStyle( '#fff' );
	$.ctx.fillCircle( 0, 0, 1 );
	$.ctx.restore();
};

$.game.mousedown = function( e ) {
	var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );
	var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );
	var sound = this.playSound( 'click1' );
	this.sound.setVolume( sound, 2 );
};

$.game.keydown = function( e ) {
	if( e.key == 'm' ) {
		var muted = $.storage.get( 'mute' );
		if( muted ) {
			$.storage.set( 'mute', 0 );
			this.sound.setMaster( 1 );
			this.music.setMaster( 0.5 );
		} else {
			$.storage.set( 'mute', 1 );
			this.sound.setMaster( 0 );
			this.music.setMaster( 0 );
		}
	}
};