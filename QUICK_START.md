# Quick Start Guide

## Installation & Running

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Using the Visualizer

### Search for Courses
1. Click the search bar at the top
2. Type a course code (e.g., "CS 61A") or name
3. Select from the dropdown results
4. The camera will focus on the selected course

### Filter by Department
1. Click the **Filter** button (top right of search bar)
2. Select one or more departments
3. Click "All" to select all, "None" to clear
4. The graph updates automatically

### View Course Details
When you select a course, you'll see:
- **Course information**: Code, name, units
- **Ratings**: Visual charts showing difficulty, workload, usefulness
- **Prerequisites**: Clickable list of required courses
- **Postrequisites**: Courses that require this course

### Navigate the 3D Graph
- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Focus**: Click any node to zoom in
- **See Prerequisites**: Blue lines connect courses (animated particles show direction)
- **Highlight Connections**: Select a course to see its prerequisite links glow green
- **Clear selection**: Click the X button or press the clear button

### View Statistics
Bottom left corner shows:
- Number of visible courses
- Number of connections (prerequisites)
- Active department filters

## Key Features

✅ **9,733 courses** from UC Berkeley catalog  
✅ **Department filtering** - focus on specific areas  
✅ **Fuzzy search** - find courses quickly  
✅ **3D visualization** - see course relationships  
✅ **Course ratings** - difficulty, workload, usefulness  
✅ **Prerequisite navigation** - explore course paths  

## Tips

- Start by filtering to a specific department (e.g., COMPSCI, MATH) for better performance
- Use the search bar to quickly find specific courses
- Click on prerequisites to explore course sequences
- The graph colors nodes by department automatically

## Performance Optimization

**The app is optimized to start with 6 popular STEM departments:**
- COMPSCI, MATH, STAT, PHYSICS, EECS, DATA

This gives you ~500-800 courses for smooth performance.

### For Best Performance:
1. ⚡ **Keep filters active** - Don't select "All" departments unless needed
2. 🎯 **Focus on 3-10 departments** - Sweet spot for performance
3. ⏱️ **Wait for physics** - Graph needs 5-10 seconds to settle
4. 🔍 **Use search** - Find specific courses without loading everything

## Troubleshooting

**Graph is laggy/slow?**
- ✅ **Filter by department** - This is the #1 performance improvement
- ✅ **Deselect unused departments** - Click "None" then select just what you need
- ✅ **Wait for stabilization** - Graph performance improves after physics settles
- Close other browser tabs
- Try a different browser (Chrome/Firefox recommended)

**Graph is too crowded?**
- Use department filtering to reduce visible courses
- Search for specific courses instead of viewing all
- Start with fewer departments, add more as needed

**Course not found?**
- Check spelling of course code
- Try searching by course name
- Some courses may use abbreviated department names
- Make sure the department is selected in filters

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [scripts/](scripts/) folder for data processing
- Customize the UI in [frontend/app/globals.css](frontend/app/globals.css)

## Need Help?

- Check the README for more details
- Review the TypeScript types in `frontend/lib/types.ts`
- Examine component code in `frontend/components/`

