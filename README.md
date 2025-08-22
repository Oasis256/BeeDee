# 🔥 BDSM Compatibility Checker 🔥

A fun and playful web application for comparing BDSMTest.org results! This app allows you to enter multiple test IDs and see how compatible different people's BDSM preferences are.

## ✨ Features

- **Beautiful Modern UI**: Glassmorphism design with smooth animations
- **Multiple Test Comparison**: Compare 2 or more BDSMTest.org results
- **Smart Compatibility Analysis**: 
  - Overall compatibility score
  - Shared interests detection
  - Complementary dynamics identification
  - Fun personality-based analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Results**: Instant compatibility calculations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to `http://localhost:3000`

## 🎯 How to Use

1. **Enter Test IDs**: Add one or more BDSMTest.org result IDs (e.g., `KTkXzPSn`, `T8n7yENK`)
2. **Compare Results**: Click "Compare Results" to fetch and analyze the data
3. **View Analysis**: See detailed compatibility scores and insights
4. **Explore Compatibility**: Check shared interests and complementary dynamics

## 🧠 How Compatibility Works

The app calculates compatibility using several factors:

- **Similarity Score**: How close your percentages are for each role
- **Shared Interests**: Roles where both people score high (>70%)
- **Complementary Dynamics**: Opposing roles that work well together (e.g., Submissive/Dominant)
- **Overall Chemistry**: Weighted combination of all factors

### Compatibility Levels

- **90%+**: Soulmates 💘 - Perfect kinky match!
- **80%+**: Highly Compatible 💕 - Great potential
- **70%+**: Good Match 💖 - Solid foundation
- **60%+**: Moderate Match 💝 - Room for growth
- **50%+**: Challenging 💔 - Will need work
- **<50%**: Incompatible 💔 - Tough but not impossible

## 🛠️ Technical Details

### Built With

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Project Structure

```
src/
├── components/
│   ├── BDSMResults.jsx      # Displays individual test results
│   └── CompatibilityChecker.jsx  # Calculates and shows compatibility
├── utils/
│   └── bdsmApi.js          # API utilities and mock data
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Real Data Integration

The app now includes a backend server that can fetch real data from BDSMTest.org! 

#### To use real data:

1. **Start the full application** (both frontend and backend):
   ```bash
   npm run dev:full
   ```

2. **Or start them separately**:
   ```bash
   # Terminal 1 - Backend API server
   npm run server
   
   # Terminal 2 - Frontend React app
   npm run dev
   ```

3. **Enter real test IDs** from BDSMTest.org (e.g., `KTkXzPSn`, `T8n7yENK`)

4. **The app will automatically**:
   - Try to fetch real data from BDSMTest.org
   - Fall back to mock data if the real data isn't available
   - Show console logs indicating which data source is being used

#### Backend Features:
- **Web scraping** of BDSMTest.org results pages
- **CORS enabled** for frontend communication
- **Error handling** with fallback to mock data
- **Rate limiting** and respectful scraping practices

## 🎨 Customization

### Colors and Themes

The app uses a purple/pink gradient theme. You can customize colors in:
- `tailwind.config.js` - Color palette
- `src/index.css` - Background gradients
- Component files - Individual color classes

### Adding New Features

- **More Analysis Types**: Add different compatibility algorithms
- **Export Results**: Save compatibility reports
- **User Profiles**: Store favorite test IDs
- **Social Features**: Share results with friends

## 🤝 Contributing

Feel free to contribute to this fun project! Some ideas:
- Improve the compatibility algorithm
- Add more visualizations
- Create mobile-specific features
- Add more BDSM role types

## 📝 License

This project is for educational and entertainment purposes. Please respect privacy and consent when using with real data.

## ⚠️ Disclaimer

This app is created for fun and exploration. It's not a substitute for open communication and consent in relationships. Always discuss boundaries and preferences openly with partners.

---

Made with 💕 for the kinky community! 🔥
