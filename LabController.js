
class LabController {
	constructor( hullEvaluater, rectEnumerator, algorithm ) {
		this.hullEvaluater = hullEvaluater;
		this.rectEnumerator = rectEnumerator;
		this.algorithm = algorithm;
	}

	solveForPoints( points ) {
		let convexHull = this.findHull( points );
		
		this.rectEnumerator.setHull( convexHull );
		//this.algorithm.setRectEnumerator( this.rectEnumerator );
		
		//let solution = this.algorithm.solve();
		//return solution;
	}

	getNextRect() {
		const current = this.rectEnumerator.getCurrent();
		this.rectEnumerator.next();
		return current;
	}

	findHull( points ) {
		return this.hullEvaluater.evaluateForPoints( points );
	}
}