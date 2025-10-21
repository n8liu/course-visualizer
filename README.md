# UC Berkeley Course Visualizer

A 3D force-directed graph visualization of UC Berkeley courses, built with Next.js, react-force-graph, and Recharts.

## Features

- **3D Course Visualization**: Interactive 3D force-directed graph showing course relationships
- **Course Search**: Fuzzy search with command palette interface
- **Prerequisite Tracking**: Visualize course prerequisites and postrequisites
- **Course Ratings**: Integration with BerkeleyEval for course ratings and reviews
- **Modern UI**: Dark mode support with Tailwind CSS and Radix UI components

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **react-force-graph-3d** for 3D visualization
- **Three.js** for custom 3D node rendering
- **Tailwind CSS** with custom design system
- **Radix UI** for accessible components
- **Recharts** for data visualizations

### Backend/Data
- **Python** with BeautifulSoup4 for web scraping
- **Next.js API routes** for BerkeleyEval integration
- **UC Berkeley Course Catalog API** for course data

## Project Structure

```
uc-berkeley-course-visualizer/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   └── berkeley-eval/ # Course ratings API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main visualization page
│   ├── components/             # React components
│   │   ├── ui/               # UI components
│   │   ├── search-bar.tsx    # Course search component
│   │   ├── berkeley-eval-donut.tsx
│   │   └── berkeley-eval-bar.tsx
│   ├── data/                  # Static course data
│   │   └── berkeley-courses-data.json
│   └── lib/                   # Utilities and types
│       ├── types.ts          # TypeScript types
│       ├── utils.ts          # Utility functions
│       └── command-score.ts  # Fuzzy search algorithm
└── scripts/                   # Python data scraping
    └── get_berkeley_course_data.py
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uc-berkeley-course-visualizer
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd ../scripts
   pip install beautifulsoup4 requests
   ```

4. **Scrape course data**
   ```bash
   python get_berkeley_course_data.py
   ```

5. **Start the development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Data Sources

### UC Berkeley Course Catalog
The application scrapes course data from UC Berkeley's course catalog API:
- Course codes and names
- Prerequisites and postrequisites
- Course descriptions and units

### BerkeleyEval Integration
Course ratings are fetched from BerkeleyEval (mock data for now):
- Overall course ratings
- Difficulty and workload ratings
- Usefulness ratings
- Review counts

## Key Features

### 3D Visualization
- **Force-directed graph**: Physics-based layout showing course relationships
- **Interactive nodes**: Click to focus and zoom on specific courses
- **Color coding**: Nodes colored by department (COMPSCI, MATH, etc.)
- **Smooth animations**: Camera transitions and node interactions

### Search and Navigation
- **Fuzzy search**: Find courses by code or name
- **Command palette**: Modern search interface
- **Course selection**: Click nodes or search results to focus
- **Prerequisite chains**: Navigate through course dependencies

### Course Information
- **Course details**: Code, name, units, description
- **Prerequisites**: Visual list of required courses
- **Postrequisites**: Courses that require this course
- **Ratings**: BerkeleyEval ratings with charts

## Customization

### Adding New Departments
Edit `scripts/get_berkeley_course_data.py`:
```python
departments = [
    "COMPSCI", "MATH", "STAT", "PHYSICS", "CHEM", "BIOLOGY", 
    # Add your department here
    "YOUR_DEPT"
]
```

### Modifying Visual Styles
Edit `frontend/app/globals.css` for custom colors and themes.

### Updating Course Data
Run the Python script to refresh course data:
```bash
cd scripts
python get_berkeley_course_data.py
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the original [course-visualizer](https://github.com/Raptors65/course-visualizer) for University of Waterloo
- Built with [react-force-graph](https://github.com/vasturiano/react-force-graph) for 3D visualization
- Uses [Recharts](https://recharts.org/) for data visualization
- Styled with [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/) 