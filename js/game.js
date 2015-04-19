$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.loadSounds(
		'warp1',
		'charge1',
		'explode1',
		'error1'
	);

	this.loadData( 'level1-6x4-150' );
	this.loadData( 'level2-6x4-150' );
	this.loadData( 'level3-9x6-100' );
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
		this.data[ 'level10-30x20-30' ]
	];

	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
};

$.game.step = function( dt ) {
};