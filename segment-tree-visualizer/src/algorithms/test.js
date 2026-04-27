/**
 * SEGMENT TREE TESTING
 * 
 * Ye file algorithm ko test karti hai
 * Console me run karke dekh sakte ho ki sab sahi kaam kar raha hai
 */

import SegmentTree from './SegmentTree.js';

// Test Case 1: Simple Sum Query
console.log('=== TEST 1: SUM QUERY ===');
const arr1 = [1, 3, 5, 7, 9, 11];
const segTree1 = new SegmentTree(arr1, 'sum');

console.log('Original Array:', arr1);
console.log('Tree:', segTree1.getTree().slice(0, 15)); // First 15 elements

// Query [1, 3] = 3 + 5 + 7 = 15
const query1 = segTree1.rangeQuery(1, 3);
console.log('Query [1, 3]:', query1.result); // Should be 15
console.log('Steps:', query1.steps.length);

// Point Update: arr[2] = 10 (5 -> 10)
const update1 = segTree1.pointUpdate(2, 10);
console.log('After update arr[2] = 10');
console.log('Query [1, 3] again:', segTree1.rangeQuery(1, 3).result); // Should be 20

console.log('\n=== TEST 2: MIN QUERY ===');
const arr2 = [5, 2, 8, 1, 9, 3];
const segTree2 = new SegmentTree(arr2, 'min');

console.log('Original Array:', arr2);
const query2 = segTree2.rangeQuery(0, 5);
console.log('Min in [0, 5]:', query2.result); // Should be 1

console.log('\n=== TEST 3: RANGE UPDATE ===');
const arr3 = [1, 2, 3, 4, 5];
const segTree3 = new SegmentTree(arr3, 'sum');

console.log('Original Array:', arr3);
console.log('Sum [0, 4]:', segTree3.rangeQuery(0, 4).result); // 15

// Add 5 to range [1, 3]
segTree3.rangeUpdate(1, 3, 5);
console.log('After adding 5 to [1, 3]');
console.log('Sum [0, 4]:', segTree3.rangeQuery(0, 4).result); // Should be 30

console.log('\n=== All Tests Complete ✅ ===');

// Export for use in components
export const runTests = () => {
  return {
    test1: { arr: arr1, tree: segTree1 },
    test2: { arr: arr2, tree: segTree2 },
    test3: { arr: arr3, tree: segTree3 }
  };
};