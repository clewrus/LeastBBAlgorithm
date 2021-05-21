class LeastBBFinder {
    rectsEnumerator = undefined;

    setRectEnumerator(rects) {
        this.rectsEnumerator = rects;
    }

    solve() {
        let minArea = Infinity;
        let minRect = undefined;

        while (this.rectsEnumerator.hasNext()) {
            let currRect = this.rectsEnumerator.getCurrent();
            let currArea = this.evaluateRectArea(currRect);

            if (currArea < minArea) {
                minArea = currArea;
                minRect = currRect;
            }

            this.rectsEnumerator.next();
        }

        return minRect;
    }

    evaluateRectArea(rect) {
        let a = p5.Vector.sub(rect.min, rect.minMax);
        let b = p5.Vector.sub(rect.min, rect.maxMin);
        return a.cross(b).mag();
    }
}