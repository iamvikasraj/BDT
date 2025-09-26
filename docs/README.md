# Blood Diagnostic Tool

AI-powered blood diagnostic tool for medical professionals providing instant analysis and clinical insights.

## 🏗️ Project Structure

```
BDT/
├── public/                     # Static assets
│   ├── index.html             # Main HTML (minimal)
│   ├── _headers               # Netlify headers
│   └── _redirects             # Netlify redirects
├── src/                       # Source code
│   ├── css/                   # Stylesheets
│   │   ├── main.css           # Main styles & variables
│   │   ├── components.css      # Component styles
│   │   ├── chat.css           # Chat interface styles
│   │   ├── input.css          # Input & form styles
│   │   ├── medical.css        # Medical data styles
│   │   ├── message-cards.css   # Message card styles
│   │   └── responsive.css     # Mobile & responsive styles
│   ├── js/                    # JavaScript modules
│   │   ├── api/               # API layer
│   │   │   ├── bloodDiagnosticAPI.js
│   │   │   └── sessionManager.js
│   │   ├── components/        # UI components
│   │   │   ├── chatInterface.js
│   │   │   ├── sessionList.js
│   │   │   └── messageFormatter.js
│   │   └── main.js            # Main application
│   └── assets/                # Images, icons
├── netlify/                   # Deployment config
│   └── functions/
│       └── proxy.js
├── docs/                      # Documentation
├── cors-proxy.py              # Development proxy
├── requirements.txt           # Python dependencies
└── package.json              # Node.js dependencies
```

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- Modern web browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BDT
   ```

2. **Start the development server**
   ```bash
   python3 cors-proxy.py
   ```

3. **Open your browser**
   Navigate to `http://localhost:4000`

### Production Deployment

The application is configured for Netlify deployment with:
- Serverless functions for API proxying
- Static file serving
- Automatic HTTPS

## 🎯 Features

- **AI-Powered Analysis**: Advanced medical diagnosis using AI
- **PDF Upload**: Support for blood test PDF uploads
- **Session Management**: Track and manage diagnosis sessions
- **Real-time Chat**: Interactive chat interface
- **Responsive Design**: Works on desktop and mobile
- **Session History**: View previous diagnoses and conversations

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python (Flask/FastAPI)
- **Deployment**: Netlify
- **API**: RESTful API with timeout handling
- **Styling**: CSS Variables, Flexbox, Grid

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Development

### CSS Architecture
- **Modular CSS**: Separate files for different components
- **CSS Variables**: Consistent theming and colors
- **Responsive Design**: Mobile-first approach
- **Component-based**: Reusable styles

### JavaScript Architecture
- **ES6 Modules**: Modern JavaScript modules
- **Class-based**: Object-oriented design
- **API Layer**: Centralized API management
- **Component System**: Reusable UI components

### API Integration
- **Timeout Handling**: Prevents hanging requests
- **Error Handling**: Comprehensive error management
- **Session Management**: Persistent session handling
- **File Upload**: PDF processing support

## 📝 API Endpoints

- `GET /api/v1/health/` - Health check
- `POST /api/v1/chat/sessions` - Create session
- `GET /api/v1/chat/sessions` - List sessions
- `GET /api/v1/chat/sessions/{id}/history` - Session history
- `POST /api/v1/chat/sessions/{id}/messages` - Send message
- `POST /api/v1/chat/upload/report` - Upload PDF

## 🎨 Styling Guidelines

- Use CSS variables for colors and spacing
- Follow mobile-first responsive design
- Maintain consistent component styling
- Use semantic class names

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.
