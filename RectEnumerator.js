class RectEnumerator {
    hull = [];

    initPointsIndexes = {};
    currPointsIndexes = {};

    anglesToNext = {};

    localPoints = {
        top: createVector(),
        right: createVector(),
        down: createVector(),
        left: createVector()
    };

    setHull(hull) {
        this.hull = hull;

        this.initPointsIndexes = this.findInitialPointsIndexes();
        this.currPointsIndexes = {...this.initPointsIndexes };

        this.anglesToNext = this.evaluateAnglesToNextVertices();

        this.nextSide = this.selectNextSide();
    }

    next() {
        let a = this.anglesToNext;
        let b = this.nextSide;

        this.moveCalipers(this.nextSide);

        this.nextSide = this.selectNextSide();
    }

    hasNext() {
        return typeof(this.nextSide) != "undefined";
    }

    getCurrent() {
        if (!this.hasNext()) { return null; }

        const movedPointIndex = this.currPointsIndexes[this.nextSide];

        const rotOrigin = this.hull[movedPointIndex];
        const nextPoint = this.hull[this.getNextVertexIndex(movedPointIndex)];

        const rot = p5.Vector.sub(nextPoint, rotOrigin).normalize();
        const invRot = createVector(rot.x, -rot.y);

        for (let side in this.currPointsIndexes) {
            p5.Vector.sub(this.hull[this.currPointsIndexes[side]], rotOrigin, this.localPoints[side]);
            this.rotateVectorByRotation(this.localPoints[side], invRot);
        }

        const rect = {};
        rect.max = createVector(-Infinity, -Infinity);
        rect.min = createVector(Infinity, Infinity);

        for (let side in this.currPointsIndexes) {
            rect.max.x = max(rect.max.x, this.localPoints[side].x);
            rect.min.x = min(rect.min.x, this.localPoints[side].x);

            rect.max.y = max(rect.max.y, this.localPoints[side].y);
            rect.min.y = min(rect.min.y, this.localPoints[side].y);
        }

        rect.minMax = createVector(rect.min.x, rect.max.y);
        rect.maxMin = createVector(rect.max.x, rect.min.y);

        for (let rectVertex in rect) {
            this.rotateVectorByRotation(rect[rectVertex], rot);
            rect[rectVertex].add(rotOrigin);
        }

        return rect;
    }

    rotateVectorByRotation(vector, rot) {
        vector.z = vector.x;
        vector.x = vector.x * rot.x - vector.y * rot.y;
        vector.y = vector.z * rot.y + vector.y * rot.x;
        vector.z = 0;
    }

    findInitialPointsIndexes() {
        let first = this.hull[0];
        let extremeVertices = { top: first, down: first, right: first, left: first };
        let resultIndex = { top: 0, down: 0, right: 0, left: 0 };

        this.hull.forEach((p, i) => {
            if (extremeVertices.top.y < p.y) {
                extremeVertices.top = p;
                resultIndex.top = i;
            }

            if (extremeVertices.down.y > p.y) {
                extremeVertices.down = p;
                resultIndex.down = i;
            }

            if (extremeVertices.right.x < p.x) {
                extremeVertices.right = p;
                resultIndex.right = i;
            }

            if (extremeVertices.left.x > p.x) {
                extremeVertices.left = p;
                resultIndex.left = i;
            }
        });

        return resultIndex;
    }

    selectNextSide() {
        let maxValue = -Infinity;
        let nextSide = undefined;

        for (let side in this.anglesToNext) {
            if (this.rotationCompleated(side) ||
                maxValue > this.anglesToNext[side]
            ) { continue; }

            maxValue = this.anglesToNext[side];
            nextSide = side;
        }

        return nextSide;
    }

    moveCalipers(movedSide) {
        if (!movedSide) { return; }

        this.currPointsIndexes[movedSide] = this.getNextVertexIndex(
            this.currPointsIndexes[movedSide]
        );

        this.anglesToNext[movedSide] = this.calcSideAngle(movedSide);
    }

    evaluateAnglesToNextVertices() {
        const anglesToNext = { top: 1, down: 1, right: 1, left: 1 };

        for (let side in anglesToNext) {
            anglesToNext[side] = this.calcSideAngle(side);
        }

        return anglesToNext;
    }

    calcSideAngle(side) {
        switch (side) {
            case "top":
                return -this.calcCurrentDirToNext("top").x;
            case "right":
                return this.calcCurrentDirToNext("right").y;
            case "down":
                return this.calcCurrentDirToNext("down").x;
            case "left":
                return -this.calcCurrentDirToNext("left").y;
        }
    }

    calcCurrentDirToNext(side) {
        return this.calcDirBetweenVerteces(
            this.currPointsIndexes[side],
            this.getNextVertexIndex(this.currPointsIndexes[side])
        );
    }

    calcDirBetweenVerteces(fromIndex, destIndex) {
        return p5.Vector.sub(this.hull[destIndex], this.hull[fromIndex]).normalize();
    }

    getNextVertexIndex(vertIndex, offset = 1) {
        return (vertIndex + offset) % this.hull.length;
    }

    rotationCompleated(side) {
        const nextSide = this.calcNextSide(side);
        return this.currPointsIndexes[side] == this.initPointsIndexes[nextSide];
    }

    calcNextSide(side) {
        switch (side) {
            case "top":
                return "left";
            case "right":
                return "top";
            case "down":
                return "right";
            case "left":
                return "down";
        }
    }
}