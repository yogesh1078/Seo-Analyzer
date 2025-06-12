import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const analyzeSEO = async (text) => {
  try {
    console.log('Sending text for analysis...');
    
    // Make API request to backend
    const response = await axios.post(`${API_BASE_URL}/analyze`, { text });
    
    // If API call succeeds, return the data
    console.log('Analysis complete:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    // For demo purposes, if the API fails, return mock data
    // Remove this in production and let the error propagate
    console.log('Using fallback mock data due to API error');
    
    return {
      keywords: [
        { text: "digital marketing", score: 0.95, type: "Topic" },
        { text: "search engine", score: 0.90, type: "Keyword" },
        { text: "content strategy", score: 0.85, type: "Topic" },
        { text: "target audience", score: 0.82, type: "Keyword" },
        { text: "social media", score: 0.78, type: "Topic" },
        { text: "SEO ranking", score: 0.75, type: "Keyword" },
        { text: "conversion rate", score: 0.72, type: "Keyword" },
        { text: "international standards", score: 0.68, type: "Topic" },
      ],
      metrics: {
        readabilityScore: 72,
        keywordDensity: "0.56",
        contentLength: text.split(/\s+/).filter(Boolean).length,
      }
    };
    
    /* Uncomment this to use proper error handling
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up request: ' + error.message);
    }
    */
  }
};