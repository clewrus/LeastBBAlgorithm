let controller;


function setup() {
	controller = constructController();
}

function draw() {

}

function constructController() {
	const hull = new HullEvaluator();
	const rect = new RectEnumerator();
	const alg = new LeastBBFinder();

	return new LabController( hull, rect, alg )
}