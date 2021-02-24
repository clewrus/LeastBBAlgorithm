
class HullEvaluator {
	points = [];

	lower = [];
	upper = [];

	evaluateForPoints( points ) {
		this.points.length = 0;
		points.forEach( p => this.points.push( p ) );

		this.points.sort((v1, v2) => (v1.x == v2.x) ? v1.y - v2.y : v1.x - v2.x);

		this.lower.length = 0;
		this.fillLower( this.lower );

		this.upper.length = 0;
		this.fillUpper( this.upper );
		
		return this.lower.concat(this.upper);
	}

	fillLower( lower ) {
		for (var i = 0; i < this.points.length; i++) {
			while (lower.length >= 2 && this.cross(lower[lower.length - 2], lower[lower.length - 1], this.points[i]) <= 0) {
				lower.pop();
			}
			lower.push(this.points[i]);
		}

		lower.pop();
	}

	fillUpper( upper ) {
		for (var i = this.points.length - 1; i >= 0; i--) {
			while (upper.length >= 2 && this.cross(upper[upper.length - 2], upper[upper.length - 1], this.points[i]) <= 0) {
				upper.pop();
			}
			upper.push(this.points[i]);
		}

		upper.pop();
	}

	cross(a, b, o) {
		return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	}
}