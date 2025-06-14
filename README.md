# SEO Analyzer

![SEO Analyzer](https://img.shields.io/badge/SEO-Analyzer-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-ISC-blue)

A comprehensive tool for analyzing and optimizing content for better search engine visibility. This application helps content creators improve their SEO by providing keyword suggestions, readability metrics, and actionable recommendations.

## Features

- **Text Analysis**: Analyze your content for SEO optimization opportunities
- **Keyword Extraction**: Identify the most relevant keywords in your content
- **Readability Scoring**: Measure how easy your content is to read
- **Keyword Density Analysis**: Check if your keyword usage is optimal
- **Content Recommendations**: Get actionable suggestions to improve SEO
- **Keyword Insertion**: Easily add recommended keywords to your content
- **Real-time Preview**: See how your optimized content will look

## 📚 Technology Stack

### Frontend
- React 19.1
- Axios for API requests
- TailwindCSS for styling

### Backend
- Node.js 
- Express 5.1
- TextRazor API for advanced text analysis
- Axios for third-party API communication

## 🏗️ Project Structure

```
seo-analyzer/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── context/      # Context API components
│       ├── services/     # API services
│       ├── App.js        # Main app component
│       └── index.js      # Entry point
├── server/               # Node.js backend
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── server.js         # Express server setup
└── README.md
```

## ⚙️ Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- TextRazor API key (sign up at [TextRazor](https://www.textrazor.com/))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yogesh1078/Seo-Analyzer.git
   cd Seo-Analyzer
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   
   # Create a .env file in the server directory with the following content:
   # PORT=5000
   # TEXT_RAZOR_API_KEY=your_api_key_here
   # FRONTEND_URL=http://localhost:3000
   ```

3. **Client Setup**
   ```bash
   cd client
   npm install
   
   # Create a .env file in the client directory with the following content:
   # REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm start
   # Server will run on http://localhost:5000
   ```

2. **Start the client**
   ```bash
   cd client
   npm start
   # Client will run on http://localhost:3000
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 📝 Usage Guide

1. **Input Your Content**
   - Enter your article, blog post, or any content in the text area

2. **Analyze SEO**
   - Click the "Analyze Text" button to process your content
   - The application will extract keywords and calculate important SEO metrics

3. **Review Metrics**
   - Check your readability score, keyword density, and content length
   - View recommended keywords from your content

4. **Optimize Content**
   - Add recommended keywords to your content with a single click
   - See a live preview of your optimized content
   - Re-analyze your content to see improvements

5. **Export Optimized Content**
   - Use the "Copy Text" button to copy your optimized content
   - Use the "Save Changes" button to save your content (implementation pending)

## 📡 API Endpoints

| Endpoint          | Method | Description                            | Request Body                   |
|-------------------|--------|----------------------------------------|-------------------------------|
| `/api/analyze`    | POST   | Analyzes text for SEO optimization     | `{ text: "content to analyze" }` |

## 🔍 How It Works

The SEO Analyzer uses advanced NLP (Natural Language Processing) through the TextRazor API to analyze your content and extract the most relevant keywords and entities. It then processes this information to provide SEO metrics and actionable recommendations.

When the TextRazor API is unavailable, the system falls back to a basic analysis algorithm that still provides useful keyword extraction and metrics.

## 💡 Future Enhancements

- User authentication and saved content history
- PDF and document upload support
- Competitor analysis
- Custom industry-specific recommendations
- Content plagiarism checking
- Image SEO recommendations

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yogesh1078/Seo-Analyzer/issues).



## ✨ Author

Created by [Yogesh](https://github.com/yogesh1078)

---

**Note**: This project was last updated on 2025-06-14.
