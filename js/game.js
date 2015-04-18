$.game = playground({
	width: 900,
	height: 600,
	scale: 1,
	smoothing: false
});

$.game.create = function() {
	this.loadSounds( 'warp1', 'charge1' );
	$.ctx = this.layer;
};

$.game.ready = function() {
	this.setState( $.statePlay );
};

$.game.step = function( dt ) {
};

$.game.step = function( dt ) {
};