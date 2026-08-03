#  Segment Tree Visualizer

> *An interactive, beautifully animated Segment Tree visualization tool w**

# What is Segment Tree?

Segment Tree ek advanced data structure hai jo **range queries** aur **updates** ko **O(log n)** time me efficiently handle karta hai.

# Real-world Applications:
-  Stock market data analysis (range min/max prices)
-  Game development (collision detection in ranges)
-  Statistics (range sum, average, etc.)
-  Geographic data (region-based queries)

# Tech Stack

| Technology | Purpose |
| React.js | UI Framework |
| Vite | Build tool (super fast) |
| React Flow | Tree graph rendering |
| Framer Motion | Smooth animations |
| Tailwind CSS | Styling |
| Lucide React | Icons |

---

##  Project Structure

```
segment-tree-visualizer/
├── src/
│   ├── algorithms/
│   │   ├── SegmentTree.js        Core logic (DONE)
│   │   └── test.js               Testing (DONE)
│   ├── utils/
│   │   └── treeConverter.js      Graph converter (DONE)
│   ├── components/
│   │   ├── ArrayInput/          
│   │   ├── TreeVisualization/   
│   │   ├── OperationPanel/      
│   │   └── CodeDisplay/         
│   ├── App.jsx                  
│   └── index.css                
└── package.json
```

---

#  You Should Now Understand:

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

