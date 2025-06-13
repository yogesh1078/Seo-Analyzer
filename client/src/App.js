import React, { useState } from 'react';
import { analyzeSEO } from './services/api';
import './App.css';

function App() {
  const [text, setText] = useState(''); // Bound to the main textarea
  const [seoResults, setSeoResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optimizedText, setOptimizedText] = useState(''); // Used for preview and as base for keyword insertion
  const [insertedKeywords, setInsertedKeywords] = useState([]);

  // Handles the initial analysis from the main textarea
  const handleInitialSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Set optimizedText from the current textarea content for the first analysis
    setOptimizedText(text); 
    setInsertedKeywords([]); // Reset any previously inserted keywords
    
    try {
      const results = await analyzeSEO(text);
      setSeoResults(results);
    } catch (err) {
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles re-analyzing the content that's currently in the "Optimized Text Preview"
  const handleReanalyzeSubmit = async () => {
    // Get the plain text version from the optimizedText (which might have HTML)
    const plainTextFromOptimized = optimizedText.replace(/<\/?[^>]+(>|$)/g, "");

    if (!plainTextFromOptimized.trim()) {
      setError('Please enter some text to reanalyze');
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. Update the main textarea to show the text that's being reanalyzed.
    setText(plainTextFromOptimized);
    // 2. The optimizedText (for preview and further keyword ops) also becomes this new plain base.
    setOptimizedText(plainTextFromOptimized);
    // 3. Keywords previously "inserted" are now part of this new base text.
    setInsertedKeywords([]);

    try {
      const results = await analyzeSEO(plainTextFromOptimized);
      setSeoResults(results);
    } catch (err) {
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const findReplacementTarget = (currentText, keyword) => {
    try {
      const plainText = currentText.replace(/<\/?[^>]+(>|$)/g, "");
      if (plainText.toLowerCase().includes(keyword.toLowerCase())) {
        return null;
      }
      
      const words = plainText.split(/\s+/);
      
      if (words.length <= 2) {
        return { position: 0, type: 'insert' };
      }
      
      for (let i = 0; i < Math.min(words.length, 20); i++) {
        if (words[i] && words[i].match(/[.!?]$/)) {
          const position = plainText.indexOf(words[i]) + words[i].length + 1;
          return { position, type: 'insert' };
        }
      }
      
      const idealPositionStart = Math.min(5, Math.floor(words.length / 4));
      const idealPositionEnd = Math.min(15, Math.floor(words.length / 2));
      const nonCriticalWords = ["also", "additionally", "furthermore", "moreover", "similarly"];
      
      for (let i = idealPositionStart; i < idealPositionEnd; i++) {
        if (words[i] && nonCriticalWords.includes(words[i].toLowerCase())) {
          let startPos = 0;
          for (let j = 0; j < i; j++) {
            startPos += (words[j]?.length || 0) + 1;
          }
          const endPos = startPos + (words[i]?.length || 0);
          return { startPos, endPos, originalText: words[i] || "", type: 'replace' };
        }
      }
      
      const defaultInsertPos = plainText.length > 100 ? 
        Math.floor(plainText.length / 4) :
        Math.min(plainText.length, 20);
      
      const insertAfterSpace = plainText.indexOf(' ', defaultInsertPos);
      const insertPosition = insertAfterSpace > -1 ? insertAfterSpace + 1 : defaultInsertPos;
      
      return { position: insertPosition, type: 'insert' };
    } catch (err) {
      console.error("Error in findReplacementTarget:", err);
      return { position: 0, type: 'insert' };
    }
  };

  const handleAddKeyword = (keyword) => {
    try {
      if (insertedKeywords.includes(keyword)) {
        return;
      }
      
      const replacement = findReplacementTarget(optimizedText, keyword);
      
      if (!replacement) {
        setInsertedKeywords([...insertedKeywords, keyword]);
        return;
      }
      
      let newText = optimizedText;
      if (replacement.type === 'replace') {
        newText = 
          optimizedText.substring(0, replacement.startPos) + 
          `<u>${keyword}</u>` + 
          optimizedText.substring(replacement.endPos);
      } else {
        newText = 
          optimizedText.substring(0, replacement.position) +
          `<u>${keyword}</u> ` + 
          optimizedText.substring(replacement.position);
      }
      
      setOptimizedText(newText);
      setInsertedKeywords([...insertedKeywords, keyword]);
    } catch (err) {
      console.error("Error in handleAddKeyword:", err);
      setError(`Failed to add keyword: ${err.message || 'Unknown error'}`);
    }
  };

  const renderOptimizedText = () => {
    if (!optimizedText) return null;
    return {__html: optimizedText.replace(/\n/g, '<br>')};
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="header">
          <h1 className="header-title">SEO Text Analyzer</h1>
          <p className="header-subtitle">Suggested content analysis for better search engine visibility</p>
        </div>
        
        <div className="input-section">
          <label className="input-label">
            Enter your text
          </label>
          <textarea
            className="input-textarea"
            value={text} // Bound to the 'text' state
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to analyze..."
          />
          <div className="button-container">
            <button
              className="analyze-button"
              onClick={handleInitialSubmit} // Calls the new handler for initial submission
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {seoResults && (
          <div className="results-section">
            <h2 className="results-title">SEO Analysis Results</h2>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <h3 className="metric-label">Readability Score</h3>
                <p className="metric-value">{seoResults.metrics.readabilityScore}</p>
                <p className="metric-description">Flesch Reading Ease</p>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Keyword Density</h3>
                <p className="metric-value">{seoResults.metrics.keywordDensity}%</p>
                <p className="metric-description">Optimal: 1-3%</p>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Content Length</h3>
                <p className="metric-value">{seoResults.metrics.contentLength}</p>
                <p className="metric-description">words</p>
              </div>
            </div>
            
            <div className="tips-section">
              <div className="tips-container">
                <h3 className="tips-title">Optimizer Tips</h3>
                <ul className="tips-list">
                  <li className="tip-item">Include relevant header tags (H1, H2, H3) to structure your content</li>
                  <li className="tip-item">Add meta description between 150-160 characters with keywords</li>
                  <li className="tip-item">Adding sufficient internal and external links for improved SEO</li>
                  {seoResults.metrics.readabilityScore < 60 && (
                    <li className="tip-item">Improve readability by using shorter sentences and simpler words</li>
                  )}
                  {parseFloat(seoResults.metrics.keywordDensity) < 0.5 && (
                    <li className="tip-item">Consider adding primary keywords (0.5%-1%) to improve search visibility</li>
                  )}
                  {parseFloat(seoResults.metrics.keywordDensity) > 3 && (
                    <li className="tip-item">Keyword density too high (above 3%). Try to reduce keyword stuffing</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="keyword-preview-grid">
              <div className="keywords-section">
                <h3 className="section-title">Recommended Keywords</h3>
                <div className="keywords-table-container">
                  <table className="keywords-table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Keyword</th>
                        <th className="table-header-cell">Relevance</th>
                        <th className="table-header-cell-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {seoResults.keywords.map((keyword, index) => (
                        <tr key={index}>
                          <td className="table-row-cell">{keyword.text}</td>
                          <td className="table-row-cell-score">{Math.round(keyword.score * 100)}%</td>
                          <td className="table-row-cell-center">
                            <button
                              className={`keyword-button ${
                                insertedKeywords.includes(keyword.text) 
                                ? 'keyword-button-added' 
                                : 'keyword-button-add'
                              }`}
                              onClick={() => handleAddKeyword(keyword.text)}
                              disabled={insertedKeywords.includes(keyword.text)}
                            >
                              {insertedKeywords.includes(keyword.text) ? 'ADDED' : 'ADD'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="preview-section">
                <h3 className="section-title">Optimized Text Preview</h3>
                <div className="preview-container">
                  <div className="preview-content">
                    {optimizedText ? (
                      <div dangerouslySetInnerHTML={renderOptimizedText()} />
                    ) : (
                      <p className="preview-placeholder">Your optimized content will appear here...</p>
                    )}
                  </div>
                  <div className="preview-actions">
                    <button 
                      className="copy-button"
                      onClick={() => {
                        const plainText = optimizedText.replace(/<\/?[^>]+(>|$)/g, "");
                        navigator.clipboard.writeText(plainText);
                        alert('Text copied to clipboard!');
                      }}
                    >
                      Copy Text
                    </button>
                    <button 
                      className="reanalyze-button"
                      onClick={handleReanalyzeSubmit} // Calls the new handler for reanalyzing
                      disabled={isLoading}
                    >
                      Reanalyze
                    </button>
                    <button className="save-button">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="expert-tips-section">
              <div className="expert-tips-container">
                <h3 className="expert-tips-title">Expert Usage Tips</h3>
                <ul className="expert-tips-list">
                  <li className="expert-tip-item">Include each key SEO term at least once</li>
                  <li className="expert-tip-item">Place important keywords in headings and the first paragraph</li>
                  <li className="expert-tip-item">Consider LSI (Latent Semantic Indexing) keywords for improved ranking</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;