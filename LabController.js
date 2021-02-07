
class LabController {
	constructor( hullEvaluater, rectEnumerator, algorithm ) {
		this.hullEvaluater = hullEvaluater;
		this.rectEnumerator = rectEnumerator;
		this.algorithm = algorithm;
	}

	solveForPoints( points ) {

	}

	findHull( points ) {
		return this.hullEvaluater.evaluateForPoints( points );
	}
}