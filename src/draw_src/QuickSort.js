function QuickSort(){
    this.create();
}
QuickSort.prototype = {
    create: function(){},
    sort: function(a, lo, hi){
        if (hi <= lo) return;
        var j = this.partition(a, lo, hi);
        this.sort(a, lo, j-1);
        this.sort(a, j+1, hi);
    },
    partition: function(a, lo, hi){
        var i = lo;
        var j = hi + 1;
        var v = a[lo];
        while (true) {
            // find item on lo to swap
            while (this.less(a[++i], v))
                if (i == hi) break;
            // find item on hi to swap
            while (this.less(v, a[--j]))
                if (j == lo) break;      // redundant since a[lo] acts as sentinel
            // check if pointers cross
            if (i >= j) break;
            this.exch(a, i, j);
        }
        // put partitioning item v at a[j]
        this.exch(a, lo, j);
        // now, a[lo .. j-1] <= a[j] <= a[j+1 .. hi]
        return j;
    },
    less: function(v, w){
    	return parseInt(v) < parseInt(w);
    },
    exch: function(a, i, j){
    	var temp = a[i];
    	a[i] = a[j];
    	a[j] = temp;
    },
    shuffle: function(a){
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
} // end QuickSort