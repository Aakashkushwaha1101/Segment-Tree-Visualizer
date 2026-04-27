# 🌳 Segment Tree Visualizer

> **An interactive, beautifully animated Segment Tree visualization tool with iOS-inspired glassmorphism UI**

## 📚 What is Segment Tree?

Segment Tree ek advanced data structure hai jo **range queries** aur **updates** ko **O(log n)** time me efficiently handle karta hai.

### Real-world Applications:
- 📊 Stock market data analysis (range min/max prices)
- 🎮 Game development (collision detection in ranges)
- 📈 Statistics (range sum, average, etc.)
- 🗺️ Geographic data (region-based queries)

---

## 🎯 Project Features

### ✅ Day 1 Complete:
- [x] Segment Tree core algorithm
- [x] Build tree from array
- [x] Range query (sum/min/max)
- [x] Point update
- [x] Range update with lazy propagation
- [x] Animation step recording
- [x] Tree to graph converter utility

### 🚧 Upcoming (Day 2-10):
- [ ] Array input component with validation
- [ ] Interactive tree visualization with React Flow
- [ ] Smooth animations with Framer Motion
- [ ] Step-by-step execution controls
- [ ] Code display panel with syntax highlighting
- [ ] Dark mode support
- [ ] Brute force comparison
- [ ] Export visualization

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | UI Framework |
| **Vite** | Build tool (super fast) |
| **React Flow** | Tree graph rendering |
| **Framer Motion** | Smooth animations |
| **Tailwind CSS** | Styling |
| **Lucide React** | Icons |

---

## 📁 Project Structure

```
segment-tree-visualizer/
├── src/
│   ├── algorithms/
│   │   ├── SegmentTree.js       ✅ Core logic (DONE)
│   │   └── test.js              ✅ Testing (DONE)
│   ├── utils/
│   │   └── treeConverter.js     ✅ Graph converter (DONE)
│   ├── components/
│   │   ├── ArrayInput/          🚧 Day 2
│   │   ├── TreeVisualization/   🚧 Day 3
│   │   ├── OperationPanel/      🚧 Day 4-6
│   │   └── CodeDisplay/         🚧 Day 7
│   ├── App.jsx                  🚧 Day 2
│   └── index.css                ✅ Glassmorphism (DONE)
└── package.json
```

---

## 🚀 Day 1: Core Algorithm Implementation

### What We Built Today:

#### 1. **SegmentTree Class** (`algorithms/SegmentTree.js`)

Complete implementation with:

```javascript
class SegmentTree {
  - build()              // Tree banata hai O(n)
  - query()              // Range query O(log n)
  - updatePoint()        // Single update O(log n)
  - updateRange()        // Range update O(log n)
  - pushDown()           // Lazy propagation
  - merge()              // Operations combine
}
```

**Key Concepts:**

1. **Tree Representation:**
   - Array me store karte hain
   - Node `i` ke children: `2*i + 1` (left), `2*i + 2` (right)
   - Parent of node `i`: `(i-1)/2`

2. **Build Process:**
   ```
   [1, 3, 5, 7, 9, 11]
   
   Tree:
              36 [0,5]
            /          \
        9 [0,2]      27 [3,5]
       /     \        /      \
   4[0,1]  5[2,2]  16[3,4]  11[5,5]
   /   \           /    \
  1[0] 3[1]      7[3]  9[4]
   ```

3. **Query Logic:**
   - **No Overlap:** Return identity (0 for sum, ∞ for min)
   - **Complete Overlap:** Return node value directly
   - **Partial Overlap:** Recurse on both children

4. **Lazy Propagation:**
   - Pending updates ko lazy array me store karte hain
   - Jab need ho tab hi apply karte hain
   - Efficient for range updates

#### 2. **Tree Converter Utility** (`utils/treeConverter.js`)

React Flow ke liye nodes aur edges generate karta hai:

```javascript
convertTreeToGraph(tree, n, lazy)
  ↓
Returns: { nodes: [...], edges: [...] }
```

**Position Calculation:**
- Horizontal: Level-based spacing
- Vertical: Fixed 120px gap
- Center alignment

#### 3. **Testing Suite** (`algorithms/test.js`)

3 comprehensive tests:
- Sum queries
- Min queries  
- Range updates with lazy propagation

---

## 📖 Understanding the Code (Hindi me)

### Build Function Samjho:

```javascript
build(node, start, end) {
  // Agar sirf ek element hai
  if (start === end) {
    tree[node] = arr[start];  // Directly assign
    return;
  }
  
  // Range ko do parts me todo
  mid = (start + end) / 2;
  
  // Left aur right subtree banao
  build(2*node + 1, start, mid);      // Left
  build(2*node + 2, mid + 1, end);    // Right
  
  // Parent = left + right (for sum)
  tree[node] = tree[2*node + 1] + tree[2*node + 2];
}
```

### Query Function Samjho:

```javascript
query(node, start, end, l, r) {
  // Case 1: Koi overlap nahi
  if (start > r || end < l) return 0;
  
  // Case 2: Complete overlap - return directly
  if (start >= l && end <= r) return tree[node];
  
  // Case 3: Partial - dono children se lao
  mid = (start + end) / 2;
  left = query(2*node+1, start, mid, l, r);
  right = query(2*node+2, mid+1, end, l, r);
  return left + right;
}
```

---

## 🧪 How to Test Day 1 Work

### Installation:
```bash
cd segment-tree-visualizer
npm install
```

### Run Dev Server:
```bash
npm run dev
```

---

## 🎓 Learning Objectives - Day 1

### ✅ You Should Now Understand:

1. **Segment Tree Structure:**
   - Kaise array se tree banta hai
   - Node indexing formula
   - Leaf vs internal nodes

2. **Operations:**
   - Build: Bottom-up construction
   - Query: Three types of overlap
   - Update: Point aur range dono

3. **Lazy Propagation:**
   - Kyu zaroori hai (efficiency)
   - Kaise kaam karta hai (postpone updates)
   - Push down mechanism

4. **Time Complexity:**
   - Build: O(n)
   - Query: O(log n)
   - Update: O(log n)

---

## 📝 Homework Before Day 2

1. **Code Read Karo:**
   - `SegmentTree.js` ki har line samjho
   - Comments padho aur understand karo

2. **Dry Run Karo:**
   - Paper pe tree draw karo for `[1, 3, 5, 7]`
   - Build process step-by-step trace karo
   - Query `[1, 2]` manually calculate karo

3. **Experiment:**
   - Test file me apna array try karo
   - Different operations test karo
   - Console.log add karke intermediate steps dekho

4. **Questions Ready Rakho:**
   - Jo nahi samajh aaya note kar lo
   - Day 2 me discuss karenge

---

## 🎨 Next: Day 2 Preview

Tomorrow we'll build:

1. **Array Input Component**
   - Glass UI design
   - Input validation
   - Visual feedback

2. **Basic App Layout**
   - Gradient background
   - Glassmorphism containers
   - Responsive grid

3. **State Management**
   - React hooks setup
   - Animation state
   - Tree data flow

---

**Day 1 Status: ✅ COMPLETE**

Core algorithm solid hai! Tomorrow visualization shuru karenge! 🚀