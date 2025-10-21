# UC Berkeley Course Visualizer

A 3D force-directed graph visualization of UC Berkeley courses, built with Next.js, react-force-graph, and Recharts.

## Features

- **3D Course Visualization**: Interactive 3D force-directed graph showing course relationships
- **Course Search**: Fuzzy search with command palette interface  
- **Department Filtering**: Filter 9,733+ courses by department with interactive sidebar
- **Prerequisite Tracking**: Visualize course prerequisites and postrequisites
- **Course Ratings**: Realistic BerkeleyEval ratings for course evaluation
- **Real-time Statistics**: Live course and connection counts
- **Modern UI**: Dark mode support with Tailwind CSS and Radix UI components
- **Error Handling**: Graceful error boundaries and loading states

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
- **Python** with CSV parsing for clean data extraction
- **Next.js API routes** for BerkeleyEval integration
- **UC Berkeley Course Catalog** official CSV data (9,733+ courses)
- **Deterministic ratings** with realistic correlations

## Project Structure

```
course-visualizer/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   └── berkeley-eval/ # Course ratings API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main visualization page
│   │   ├── error.tsx          # Error boundary
│   │   └── loading.tsx        # Loading state
│   ├── components/             # React components
│   │   ├── ui/               # Radix UI components
│   │   ├── search-bar.tsx    # Course search component
│   │   ├── department-filter.tsx  # Department filtering
│   │   ├── berkeley-eval-donut.tsx
│   │   └── berkeley-eval-bar.tsx
│   ├── data/                  # Static course data
│   │   └── berkeley-courses-data.json  # 9,733 courses
│   └── lib/                   # Utilities and types
│       ├── types.ts          # TypeScript types
│       ├── utils.ts          # Utility functions
│       └── command-score.ts  # Fuzzy search algorithm
├── scripts/                   # Python data processing
│   ├── improved_scraper.py   # Main data processor
│   └── get_berkeley_course_data.py
├── courses-report.2025-07-31.csv  # UC Berkeley course data
└── .gitignore
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

4. **Generate course data** (optional - data already included)
   ```bash
   cd scripts
   python improved_scraper.py
   cd ..
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
The application uses official UC Berkeley course catalog data:
- **9,733 courses** from all departments
- Course codes, names, and descriptions
- Unit requirements and terms offered
- Prerequisites extracted from descriptions

### BerkeleyEval Integration
Course ratings use deterministic, realistic mock data:
- Overall course ratings (correlated with usefulness)
- Difficulty and workload ratings (correlated)
- Lower division courses have more reviews
- Same course always gets same rating
- Note: Replace with real BerkeleyTime API for production

## Key Features

### 3D Visualization
- **Force-directed graph**: Physics-based layout showing course relationships
- **Interactive nodes**: Click to focus and zoom on specific courses
- **Color coding**: Nodes colored by department (COMPSCI, MATH, etc.)
- **Smooth animations**: Camera transitions and node interactions

### Search and Navigation
- **Fuzzy search**: Find courses by code or name
- **Command palette**: Modern search interface with keyboard shortcuts
- **Department filtering**: Filter by one or multiple departments
- **Course selection**: Click nodes or search results to focus
- **Prerequisite chains**: Navigate through course dependencies
- **Real-time stats**: See filtered course and connection counts

### Course Information
- **Course details**: Code, name, units, description
- **Prerequisites**: Visual list of required courses
- **Postrequisites**: Courses that require this course
- **Ratings**: BerkeleyEval ratings with charts

## Customization

### Updating Course Data
The course data is sourced from the UC Berkeley course catalog CSV. To update:

1. Download the latest course report from UC Berkeley
2. Replace `courses-report.2025-07-31.csv`
3. Run the data processor:
   ```bash
   cd scripts
   python improved_scraper.py
   ```

### Modifying Visual Styles
Edit `frontend/app/globals.css` for custom colors and themes. The app supports both light and dark modes.

### Integrating Real BerkeleyTime API
Replace the mock data in `frontend/app/api/berkeley-eval/route.ts` with actual BerkeleyTime API calls:

```typescript
// Example with real API
const response = await fetch(
  `https://berkeleytime.com/api/course/${courseCode}/`
);
const data = await response.json();
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

## Development

### Running in Development Mode
```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:3000

### Building for Production
```bash
cd frontend
npm run build
npm run start
```

### Data Statistics
- **9,733 courses** across all UC Berkeley departments
- **89 prerequisite relationships** (high-quality validated data)
- **150+ departments** represented
- Top departments: EDUC (310), POLSCI (293), HISTORY (266)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the original [course-visualizer](https://github.com/Raptors65/course-visualizer) for University of Waterloo
- Built with [react-force-graph](https://github.com/vasturiano/react-force-graph) for 3D visualization
- Uses [Recharts](https://recharts.org/) for data visualization
- Styled with [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/) 