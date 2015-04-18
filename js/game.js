$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.loadSounds( 'warp' );

	$.ctx = this.layer;
};

$.game.ready = function() {
	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
};

$.game.step = function( dt ) {
};