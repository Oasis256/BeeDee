# 🔥 BDSM Compatibility Checker

A comprehensive web application for comparing BDSM test results, creating scenarios, and tracking your exploration journey with advanced analytics and safety features.

## 🌟 Features

### 📊 **Core Compatibility Analysis**
- **Multi-Profile Comparison**: Compare results from multiple BDSMTest.org profiles
- **Detailed Breakdown**: Visual charts and graphs showing compatibility percentages
- **Role Compatibility Matrix**: See how different roles align between partners
- **Smart Recommendations**: AI-powered suggestions based on compatibility scores
- **Advanced Analysis**: Deep insights into kink alignment and communication patterns

### 🎯 **Scenario Builder & Management**
- **Custom Scenario Creation**: Build personalized BDSM scenarios
- **Template Library**: 30+ pre-built scenarios across all difficulty levels
- **Database Persistence**: Save, edit, and manage your scenarios
- **Role Assignment**: Assign specific roles to test results
- **Timer Integration**: Built-in session timing and tracking

### 🔥 **Sex Positions Guide**
- **Comprehensive Database**: 235 real sex positions from Cosmopolitan guides
- **99.2% Success Rate**: High-quality content extraction with lazy loading support
- **9 Categories**: Oral, Missionary, Anal, Chair, Lesbian, Beginner, Romantic, Solo, Deep Penetration
- **Rich Content**: Each position includes descriptions, how-to instructions, and images
- **Interactive Gallery**: Click-to-expand images and detailed position views
- **Search & Filter**: Find positions by category or search terms

### 📈 **Session Analytics Dashboard**
- **Progress Tracking**: Monitor your BDSM exploration journey
- **Category Analysis**: See which types of play you explore most
- **Difficulty Progression**: Track your advancement through difficulty levels
- **Rating System**: Rate and review completed scenarios
- **Data Export**: Download your analytics for personal records
- **Time-based Filtering**: Analyze data by week, month, quarter, or year

### 🛡️ **Advanced Safety Features**
- **Dynamic Safety Checklists**: Scenario-specific safety requirements
- **Automatic Risk Assessment**: High-risk scenarios trigger safety prompts
- **Emergency Contacts**: Quick access to emergency numbers
- **Safety Guidelines**: Comprehensive safety information and best practices
- **Critical vs Optional Items**: Clear distinction between must-have and recommended safety measures

### 👥 **Community Features**
- **Scenario Sharing**: Share your custom scenarios with the community
- **Community Discovery**: Browse and download scenarios from other users
- **Rating System**: Like and rate community scenarios
- **Search & Filter**: Find scenarios by category, difficulty, and popularity
- **Social Features**: Connect with other users through shared content

### 🎨 **User Experience**
- **Beautiful UI**: Modern, responsive design with purple/dark theme
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Mobile Friendly**: Works perfectly on all devices
- **Real-time Updates**: Live data updates and notifications
- **Export Capabilities**: Download results and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bdsm-compatibility-checker.git
   cd bdsm-compatibility-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t beedee .
   ```

2. **Run the container**
   ```bash
   docker run -p 1919:80 beedee
   ```

3. **Access the application**
   ```
   http://localhost:1919
   ```

## 📖 User Guide

### Getting Started

1. **Enter Test IDs**: Add BDSMTest.org test IDs for comparison
2. **Compare Results**: View detailed compatibility analysis
3. **Create Scenarios**: Build custom scenarios or use templates
4. **Track Progress**: Monitor your exploration with analytics
5. **Stay Safe**: Use safety checklists for all activities

### Using the Scenario Builder

1. **Create Custom Scenarios**
   - Click "Custom Scenario" tab
   - Fill in scenario details (name, description, category)
   - Set intensity, duration, and difficulty levels
   - Add safety considerations and equipment lists
   - Save to your personal library

2. **Use Templates**
   - Click "Templates" button
   - Browse 30+ pre-built scenarios
   - Filter by category, difficulty, or intensity
   - Apply templates to customize for your needs

3. **Session Management**
   - Start timer for any scenario
   - Track session duration and progress
   - Rate and log completed sessions
   - View session history in analytics

### Safety Features

1. **Safety Checklists**
   - Automatically triggered for high-risk scenarios
   - Manual access via "Safety Checklist" button
   - Complete critical items before proceeding
   - Emergency contact information readily available

2. **Risk Assessment**
   - Automatic risk level detection
   - Difficulty-based safety requirements
   - Category-specific safety guidelines
   - Professional training recommendations

### Analytics Dashboard

1. **Key Metrics**
   - Total sessions completed
   - Cumulative time spent
   - Average session ratings
   - Difficulty progression

2. **Detailed Analysis**
   - Category distribution charts
   - Difficulty level breakdown
   - Rating distribution analysis
   - Recent session history

3. **Data Management**
   - Filter by time range
   - Export data as JSON
   - Search and sort capabilities
   - Personal record keeping

### Community Features

1. **Sharing Scenarios**
   - Upload custom scenarios
   - Add descriptions and safety notes
   - Categorize and tag scenarios
   - Share with the community

2. **Discovering Content**
   - Browse community scenarios
   - Search by keywords
   - Filter by category and difficulty
   - Sort by popularity or rating

3. **Social Interaction**
   - Like and rate scenarios
   - Download scenarios to your library
   - Track community engagement
   - Build your profile

## 🔧 Technical Details

### Architecture
- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite for data persistence
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Deployment**: Docker with Nginx reverse proxy

### Data Scraping
- **Web Scraping**: Puppeteer-based content extraction
- **Lazy Loading Support**: Handles dynamic content loading
- **High Success Rate**: 99.2% content extraction success
- **Source**: Cosmopolitan sex position guides
- **Data Format**: JSON with rich metadata
- **Automation**: Single-command scraping process

### Key Components
- `App.jsx`: Main application component
- `ScenarioBuilder.jsx`: Scenario creation and management
- `SessionAnalytics.jsx`: Analytics dashboard
- `SafetyChecklist.jsx`: Dynamic safety checklists
- `CommunityScenarios.jsx`: Community sharing features
- `AdvancedAnalysis.jsx`: Deep compatibility analysis

### API Endpoints
- `/api/scenarios`: Scenario CRUD operations
- `/api/community-scenarios`: Community scenario management
- `/api/profiles`: User profile management
- `/api/analytics`: Analytics data endpoints
- `/api/health`: Health check endpoint

## 🛡️ Safety & Privacy

### Safety First
- **Comprehensive Safety Guidelines**: Built-in safety information
- **Risk Assessment**: Automatic risk level detection
- **Emergency Contacts**: Quick access to emergency numbers
- **Professional Recommendations**: Training and education resources

### Privacy Protection
- **Local Data Storage**: Personal data stays on your device
- **No Registration Required**: Use without creating accounts
- **Data Export**: Full control over your data
- **Secure Communication**: HTTPS encryption for all data

### Responsible Use
- **Consent Emphasis**: Clear consent guidelines throughout
- **Education Focus**: Educational content and resources
- **Community Guidelines**: Safe and respectful community standards
- **Professional Resources**: Links to professional BDSM education

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BDSMTest.org**: For the original test and inspiration
- **BDSM Community**: For feedback and suggestions
- **Open Source Contributors**: For libraries and tools used
- **Safety Educators**: For guidance on safety features

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/bdsm-compatibility-checker/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/bdsm-compatibility-checker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bdsm-compatibility-checker/discussions)
- **Email**: support@beedee.app

## 🔄 Changelog

### v2.1.0 (Current)
- 🔥 Sex Positions Guide (235 positions, 99.2% success rate)
- ✨ Session Analytics Dashboard
- 🛡️ Dynamic Safety Checklists
- 👥 Community Scenario Sharing
- 📊 Enhanced Data Visualization
- 🎯 Improved Scenario Builder
- 📱 Mobile Responsive Design

### v1.0.0
- 🎯 Initial release
- 📊 Basic compatibility analysis
- 🎨 Scenario builder
- 📈 Basic analytics

---

**Remember**: This application is for educational and entertainment purposes. Always prioritize safety, consent, and responsible BDSM practices. Seek professional guidance when needed.
