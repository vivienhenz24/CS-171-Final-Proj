# The Harvard Concentration Compass 🎓

**COMPSCI 1710 Final Project**

Exploring the data behind every Harvard concentration - from workload to well-being.

## 🌐 Live Demo

Visit the live application at: **[https://cs-171-final-proj.vercel.app/](https://cs-171-final-proj.vercel.app/)**

## 👥 Team

- Kirthi Chigurupati
- Yasmine Moussa
- Said El Kadi
- Vivien Henz

## 📖 About

The Harvard Concentration Compass is an interactive data visualization project that helps students explore and compare Harvard's academic concentrations. Using comprehensive Q-Guide data, our application provides insights into course workload, ratings, and trends across different departments and divisions.

## 🚀 Running Locally

### Prerequisites

- Node.js (v20 or higher recommended)
- pnpm (preferred) or npm/yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CS-171-Final-Proj
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## 📚 Key Libraries & Technologies

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework for production with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Data Visualization
- **[D3.js v7](https://d3js.org/)** - The primary data visualization library used throughout the project
  - Used for creating interactive charts, graphs, and custom visualizations
  - Handles data transformations, scales, and axes
  - Powers complex visualizations including scatter plots, bar charts, and time series
  - Enables smooth transitions and interactive tooltips
  - Leverages D3's force simulation for network diagrams
  - Utilizes D3's selection API for DOM manipulation and data binding

### UI & Animation
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for smooth page transitions and component animations
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components (dropdown menus)
- **[Lucide React](https://lucide.dev/)** - Icon library

### 3D Graphics
- **[Three.js](https://threejs.org/)** - 3D graphics library for WebGL rendering
- **[Postprocessing](https://www.npmjs.com/package/postprocessing)** - Post-processing effects for Three.js

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Immer](https://immerjs.github.io/immer/)** - Immutable state updates

### Utilities
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[html2canvas](https://html2canvas.hertzen.com/)** - Screenshot functionality
- **[clsx](https://www.npmjs.com/package/clsx)** & **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)** - Conditional CSS class management

## 📊 Data Sources

This project analyzes Harvard Q-Guide data, which includes:
- Course ratings and reviews
- Workload metrics (hours per week)
- Department-level statistics
- Time series data across multiple semesters
- Individual course section data

The data is processed and aggregated from Harvard's official Q-Guide reports.

## 🗂️ Project Structure

```
CS-171-Final-Proj/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for data fetching
│   ├── story/             # Main story/visualization page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── story/            # Story-specific components
│   │   ├── pages/        # Individual visualization pages
│   │   └── StoryJourney.tsx
│   └── ui/               # Reusable UI components
├── data/                 # Raw and processed data
│   └── csv/             # CSV data files
├── lib/                  # Utility functions and configurations
│   ├── departmentNames.ts
│   ├── divisionMapping.ts
│   └── salaryMapping.ts
├── public/              # Static assets
│   └── data/           # Public data files
└── package.json        # Project dependencies
```

## 🎨 Features

- **Interactive Data Visualizations**: Explore concentrations through multiple interactive D3 visualizations
- **Storytelling Interface**: Guided narrative experience through the data
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Data**: Aggregated Q-Guide data updated regularly
- **Smooth Animations**: Framer Motion powers elegant page transitions
- **Accessible UI**: Built with accessibility in mind using Radix UI primitives

## 🛠️ Development

### Linting
```bash
pnpm lint
```

### Type Checking
TypeScript is configured to provide type safety throughout the project. The compiler options are set in `tsconfig.json`.

## 📝 License

This project was created for COMPSCI 1710 at Harvard University.

## 🙏 Acknowledgments

- Harvard Q-Guide for providing course evaluation data
- CS 171 course staff for guidance and support
- The D3.js community for comprehensive documentation and examples
