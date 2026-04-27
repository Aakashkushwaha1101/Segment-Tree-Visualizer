/**
 * SEGMENT TREE CLASS
 * 
 * Ye class complete segment tree ko manage karti hai
 * Sab operations yahan implement honge:
 * 1. Build Tree (array se tree banana)
 * 2. Range Query (kisi range ka sum/min/max nikalna)
 * 3. Point Update (single element update karna)
 * 4. Range Update with Lazy Propagation (range me sabko update karna efficiently)
 */

class SegmentTree {
  constructor(arr, operationType = 'sum') {
    this.arr = arr; // Original array ko store karte hain
    this.n = arr.length; // Array ki length
    this.operationType = operationType; // 'sum', 'min', ya 'max'
    
    // Tree ko store karne ke liye array (4*n size chahiye worst case ke liye)
    this.tree = new Array(4 * this.n).fill(0);
    
    // Lazy propagation ke liye array (pending updates store karega)
    this.lazy = new Array(4 * this.n).fill(0);
    
    // Animation/visualization ke liye step-by-step operations store karenge
    this.animationSteps = [];
    
    // Tree build karte hain
    this.build(0, 0, this.n - 1);
  }

  /**
   * MERGE FUNCTION
   * Do values ko combine karta hai operation ke according
   * @param {number} left - Left child ki value
   * @param {number} right - Right child ki value
   * @returns {number} - Merged value
   */
  merge(left, right) {
    switch(this.operationType) {
      case 'sum':
        return left + right; // Sum operation
      case 'min':
        return Math.min(left, right); // Minimum operation
      case 'max':
        return Math.max(left, right); // Maximum operation
      default:
        return left + right;
    }
  }

  /**
   * BUILD FUNCTION - Recursive
   * Tree ko bottom-up build karta hai
   * 
   * @param {number} node - Current tree node index (0 se start)
   * @param {number} start - Current segment ka start index
   * @param {number} end - Current segment ka end index
   * 
   * Working:
   * - Agar leaf node hai (start === end), to directly array value assign karo
   * - Nahi to left aur right child build karo, fir merge karo
   */
  build(node, start, end) {
    // Animation step record karte hain
    this.animationSteps.push({
      type: 'build',
      node,
      range: [start, end],
      description: `Building node ${node} for range [${start}, ${end}]`
    });

    // Base case: Leaf node (jab ek hi element ho)
    if (start === end) {
      this.tree[node] = this.arr[start];
      this.animationSteps.push({
        type: 'leaf_created',
        node,
        value: this.arr[start],
        range: [start, end]
      });
      return;
    }

    // Recursive case: Internal node
    const mid = Math.floor((start + end) / 2);
    
    // Left child build karo (2*node + 1 pe)
    this.build(2 * node + 1, start, mid);
    
    // Right child build karo (2*node + 2 pe)
    this.build(2 * node + 2, mid + 1, end);
    
    // Current node ki value = left child aur right child ka merge
    this.tree[node] = this.merge(
      this.tree[2 * node + 1],  // Left child
      this.tree[2 * node + 2]   // Right child
    );

    this.animationSteps.push({
      type: 'node_created',
      node,
      value: this.tree[node],
      range: [start, end],
      leftChild: 2 * node + 1,
      rightChild: 2 * node + 2
    });
  }

  /**
   * QUERY FUNCTION - Range Query with Lazy Propagation
   * Diye gaye range [l, r] ka result return karta hai
   * 
   * @param {number} node - Current tree node
   * @param {number} start - Current segment start
   * @param {number} end - Current segment end
   * @param {number} l - Query range start
   * @param {number} r - Query range end
   * @returns {number} - Query result
   */
  query(node, start, end, l, r) {
    // Pehle pending lazy updates apply karo
    this.pushDown(node, start, end);

    this.animationSteps.push({
      type: 'query_visit',
      node,
      range: [start, end],
      queryRange: [l, r],
      description: `Visiting node ${node} [${start}, ${end}] for query [${l}, ${r}]`
    });

    // Case 1: No overlap - Range bilkul bahar hai
    if (start > r || end < l) {
      this.animationSteps.push({
        type: 'no_overlap',
        node,
        range: [start, end]
      });
      return this.operationType === 'min' ? Infinity : 
             this.operationType === 'max' ? -Infinity : 0;
    }

    // Case 2: Complete overlap - Range completely andar hai
    if (start >= l && end <= r) {
      this.animationSteps.push({
        type: 'complete_overlap',
        node,
        range: [start, end],
        value: this.tree[node]
      });
      return this.tree[node];
    }

    // Case 3: Partial overlap - Dono children check karo
    this.animationSteps.push({
      type: 'partial_overlap',
      node,
      range: [start, end]
    });

    const mid = Math.floor((start + end) / 2);
    
    const leftResult = this.query(2 * node + 1, start, mid, l, r);
    const rightResult = this.query(2 * node + 2, mid + 1, end, l, r);
    
    return this.merge(leftResult, rightResult);
  }

  /**
   * POINT UPDATE FUNCTION
   * Single index ki value update karta hai
   * 
   * @param {number} node - Current node
   * @param {number} start - Segment start
   * @param {number} end - Segment end
   * @param {number} idx - Update karne wala index
   * @param {number} value - Nayi value
   */
  updatePoint(node, start, end, idx, value) {
    this.animationSteps.push({
      type: 'update_visit',
      node,
      range: [start, end],
      targetIndex: idx,
      newValue: value
    });

    // Leaf node mil gayi
    if (start === end) {
      this.arr[idx] = value;
      this.tree[node] = value;
      this.animationSteps.push({
        type: 'update_complete',
        node,
        value,
        range: [start, end]
      });
      return;
    }

    const mid = Math.floor((start + end) / 2);
    
    // Left ya right me jao
    if (idx <= mid) {
      this.updatePoint(2 * node + 1, start, mid, idx, value);
    } else {
      this.updatePoint(2 * node + 2, mid + 1, end, idx, value);
    }

    // Parent node update karo
    this.tree[node] = this.merge(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    );

    this.animationSteps.push({
      type: 'update_propagate',
      node,
      value: this.tree[node],
      range: [start, end]
    });
  }

  /**
   * RANGE UPDATE WITH LAZY PROPAGATION
   * Range [l, r] me sabko value add karta hai (efficiently)
   * 
   * @param {number} node - Current node
   * @param {number} start - Segment start
   * @param {number} end - Segment end
   * @param {number} l - Update range start
   * @param {number} r - Update range end
   * @param {number} value - Add karne wali value
   */
  updateRange(node, start, end, l, r, value) {
    // Pehle pending updates apply karo
    this.pushDown(node, start, end);

    this.animationSteps.push({
      type: 'range_update_visit',
      node,
      range: [start, end],
      updateRange: [l, r],
      value
    });

    // No overlap
    if (start > r || end < l) {
      return;
    }

    // Complete overlap - Lazy mark karo aur return
    if (start >= l && end <= r) {
      this.lazy[node] = value; // Lazy value store
      this.applyLazy(node, start, end); // Apply immediately
      
      this.animationSteps.push({
        type: 'lazy_applied',
        node,
        range: [start, end],
        lazyValue: value
      });
      return;
    }

    // Partial overlap - Children pe jao
    const mid = Math.floor((start + end) / 2);
    
    this.updateRange(2 * node + 1, start, mid, l, r, value);
    this.updateRange(2 * node + 2, mid + 1, end, l, r, value);
    
    // Parent update
    this.tree[node] = this.merge(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    );
  }

  /**
   * LAZY PROPAGATION HELPER
   * Pending lazy updates ko apply karta hai
   */
  pushDown(node, start, end) {
    if (this.lazy[node] !== 0) {
      this.applyLazy(node, start, end);
      
      // Agar leaf nahi hai to children ko propagate karo
      if (start !== end) {
        this.lazy[2 * node + 1] += this.lazy[node];
        this.lazy[2 * node + 2] += this.lazy[node];
        
        this.animationSteps.push({
          type: 'lazy_propagate',
          node,
          leftChild: 2 * node + 1,
          rightChild: 2 * node + 2,
          value: this.lazy[node]
        });
      }
      
      this.lazy[node] = 0; // Clear current lazy
    }
  }

  /**
   * APPLY LAZY VALUE
   * Lazy value ko current node pe apply karta hai
   */
  applyLazy(node, start, end) {
    if (this.operationType === 'sum') {
      // Sum ke liye: value * range_length add karo
      const rangeLength = end - start + 1;
      this.tree[node] += this.lazy[node] * rangeLength;
    } else {
      // Min/Max ke liye: directly value add karo
      this.tree[node] += this.lazy[node];
    }
  }

  /**
   * PUBLIC METHODS - External use ke liye
   */

  // Query wrapper
  rangeQuery(l, r) {
    this.animationSteps = []; // Reset steps
    const result = this.query(0, 0, this.n - 1, l, r);
    return { result, steps: this.animationSteps };
  }

  // Point update wrapper
  pointUpdate(idx, value) {
    this.animationSteps = [];
    this.updatePoint(0, 0, this.n - 1, idx, value);
    return { steps: this.animationSteps };
  }

  // Range update wrapper
  rangeUpdate(l, r, value) {
    this.animationSteps = [];
    this.updateRange(0, 0, this.n - 1, l, r, value);
    return { steps: this.animationSteps };
  }

  // Get tree for visualization
  getTree() {
    return this.tree;
  }

  // Get animation steps from build
  getBuildSteps() {
    return this.animationSteps;
  }
}

export default SegmentTree;