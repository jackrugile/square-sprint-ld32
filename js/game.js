$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.loadImages(
		'screen-overlay',
		'light'
	);

	this.loadSounds(
		'warp1',
		'charge1',
		'explode1',
		'error1'
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
	];

	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
};

$.game.step = function( dt ) {
};