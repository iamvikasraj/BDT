# Blood Diagnosis Tool (BDT)

A modern, web-based medical diagnosis tool designed to assist healthcare professionals in analyzing blood test results and providing diagnostic insights.

## 🌟 Features

### Core Functionality
- **PDF Upload & Analysis**: Upload blood test PDFs for automated analysis
- **Interactive Chat Interface**: Natural language interaction with the diagnosis system
- **Patient Information Management**: Comprehensive patient data display and management
- **Lab Results Visualization**: Clear presentation of blood test values with normal ranges
- **Diagnostic Analysis**: AI-powered diagnosis suggestions with confidence scores
- **Detailed Diagnosis Views**: Clickable diagnosis cards with supporting evidence and recommendations

### User Interface
- **Modern Design**: Clean, professional medical interface
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Real-time Processing**: Animated feedback during analysis
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive navigation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iamvikasraj/BDT.git
   cd BDT
   ```

2. Open `index.html` in your web browser:
   ```bash
   open index.html
   # or simply double-click the file
   ```

3. Start using the tool by uploading a blood test PDF or typing a message

## 📱 Usage

### Basic Workflow
1. **Upload PDF**: Click the paperclip icon to upload a blood test PDF
2. **Wait for Analysis**: The system will process and analyze the results
3. **Review Results**: View patient information, lab values, and diagnostic suggestions
4. **Explore Details**: Click on diagnosis cards for detailed information
5. **Ask Questions**: Use the chat interface to ask follow-up questions

### Features Overview
- **Patient Dashboard**: View comprehensive patient information
- **Lab Results**: See all blood test values with normal ranges and status indicators
- **Diagnosis Cards**: Interactive cards showing potential diagnoses with confidence scores
- **Evidence & Citations**: Supporting medical literature and evidence for each diagnosis
- **Next Steps**: Recommended actions and follow-up procedures

## 🏗️ Project Structure

```
BDT/
├── index.html              # Main application file
├── version_manager.py      # Version management script
├── VERSION                 # Current version number
├── requirements.txt        # Python dependencies
├── assets/
│   └── images/            # Project images and assets
├── BRANCHING_STRATEGY.md  # Git branching guidelines
├── VERSIONING.md          # Versioning documentation
└── README.md              # This file
```

## 🛠️ Development

### Version Management
The project uses automated version management:

```bash
# Check current version
python version_manager.py current

# Bump version (patch/minor/major)
python version_manager.py bump patch

# Create release with tag
python version_manager.py release minor

# Push changes
python version_manager.py push
```

### Git Workflow
- **Main Branch**: `main` - Production-ready code
- **Development Branch**: `develop` - Integration branch
- **Feature Branches**: `feature/*` - New features and improvements

### Current Version
**v0.1.0** - Initial feature release with core functionality

## 🎨 Design System

### Color Palette
- **Primary**: #19B76A (Medical Green)
- **Secondary**: #16A085 (Teal)
- **Background**: Gradient from #BFC3C8 to #DAD9DA
- **Text**: #202020 (Primary), #343434 (Secondary)

### Typography
- **Font Family**: Work Sans (Google Fonts)
- **Weights**: 100-900 (Variable font)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Smooth transitions, gradient borders
- **Input Fields**: Glass-morphism design with focus states
- **Scrollbars**: Custom styled for better UX

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🔧 Technical Details

### Frontend Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern features with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS (ES6+)
- **Fonts**: Google Fonts (Work Sans)

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📋 Roadmap

### Phase 1 (Current)
- [x] Basic UI/UX design
- [x] PDF upload functionality
- [x] Mock data integration
- [x] Responsive design
- [x] Version management

### Phase 2 (Planned)
- [ ] Backend API integration
- [ ] Real PDF processing
- [ ] Database integration
- [ ] User authentication
- [ ] Real medical AI integration

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Integration with medical systems
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikas Raj Yadav**
- Email: vikasyadav.vision111@gmail.com
- GitHub: [@iamvikasraj](https://github.com/iamvikasraj)

## 🙏 Acknowledgments

- Medical UI/UX inspiration from modern healthcare applications
- Design system based on Material Design principles
- Color palette inspired by medical and healthcare themes

## 📞 Support

For support, email vikasyadav.vision111@gmail.com or create an issue in the repository.

---

**Note**: This is currently a prototype/demo version. For production use, additional backend integration and medical validation would be required.