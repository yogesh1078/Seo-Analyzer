import React, { useState } from 'react';
import { analyzeSEO } from './services/api';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [seoResults, setSeoResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optimizedText, setOptimizedText] = useState('');
  const [insertedKeywords, setInsertedKeywords] = useState([]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOptimizedText(text);
    setInsertedKeywords([]);
    
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

  // Function to find words to replace with the suggested keyword
  const findReplacementTarget = (text, keyword) => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    const textWords = text.split(/\s+/);
    
    // If the keyword already exists in the text, don't replace anything
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      return null;
    }
    
    // For each word in the text, score it based on similarity to the keyword
    const wordScores = textWords.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length < 3) return { score: 0, index }; // Skip very short words
      
      // Calculate how similar this word is to the keywords
      let score = 0;
      
      // Check for partial matches with keyword components
      keywordWords.forEach(keywordWord => {
        if (cleanWord.includes(keywordWord.substring(0, 3))) {
          score += 5; // Strong match
        } else if (keywordWord.includes(cleanWord.substring(0, 3))) {
          score += 3; // Partial match
        }
      });
      
      // Prefer words at the beginning of sentences or paragraphs
      if (index === 0 || textWords[index - 1].endsWith('.')) {
        score += 3;
      }
      
      // Avoid replacing important structural words
      const structuralWords = ['however', 'therefore', 'because', 'although', 'meanwhile'];
      if (structuralWords.includes(cleanWord)) {
        score -= 10;
      }
      
      return { word, score, index };
    });
    
    // Sort by score (highest first)
    const sortedScores = [...wordScores].sort((a, b) => b.score - a.score);
    
    // If the best candidate has a decent score, return it
    if (sortedScores[0]?.score >= 3) {
      const bestMatch = sortedScores[0];
      
      // Determine how many words to replace based on keyword length
      let wordsToReplace = 1;
      const keywordLength = keywordWords.length;
      
      if (keywordLength > 1) {
        // For multi-word keywords, try to replace multiple words
        wordsToReplace = Math.min(keywordLength, textWords.length - bestMatch.index);
      }
      
      return {
        startIndex: bestMatch.index,
        endIndex: bestMatch.index + wordsToReplace - 1,
        originalText: textWords.slice(bestMatch.index, bestMatch.index + wordsToReplace).join(' ')
      };
    }
    
    // If no good match found, find a generic insertion point
    // Prefer positions near the beginning of the text
    const insertion = Math.min(3, textWords.length - 1);
    return {
      startIndex: insertion,
      endIndex: insertion,
      originalText: textWords[insertion]
    };
  };

  const handleAddKeyword = (keyword) => {
    // Skip if keyword already inserted
    if (insertedKeywords.includes(keyword)) {
      return;
    }

    // Split text into words for processing
    const textWords = optimizedText.split(/\s+/);
    
    // Find target words to replace
    const replacement = findReplacementTarget(optimizedText, keyword);
    
    // If keyword already exists
    if (!replacement) {
      setInsertedKeywords([...insertedKeywords, keyword]);
      return;
    }
    
    // Replace the target words with the new keyword
    textWords.splice(
      replacement.startIndex, 
      replacement.endIndex - replacement.startIndex + 1,
      `<u>${keyword}</u>`
    );
    
    // Set the optimized text with replaced keyword
    setOptimizedText(textWords.join(' '));
    setInsertedKeywords([...insertedKeywords, keyword]);
  };

  const renderOptimizedText = () => {
    if (!optimizedText) return null;
    
    // Use dangerouslySetInnerHTML to render HTML underline tags
    return {__html: optimizedText.replace(/\n/g, '<br>')};
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">SEO Text Analyzer</h1>
          <p className="text-gray-600 text-sm">Suggested content analysis for better search engine visibility</p>
        </div>
        
        {/* Text Input Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-3 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to analyze..."
          />
          <div className="mt-3 flex justify-end">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mt-4 rounded">
            {error}
          </div>
        )}
        
        {seoResults && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">SEO Analysis Results</h2>
            
            {/* Metrics Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Readability Score</h3>
                <p className="text-2xl font-bold text-gray-800">{seoResults.metrics.readabilityScore}</p>
                <p className="text-xs text-gray-500 mt-1">Flesch Reading Ease</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Keyword Density</h3>
                <p className="text-2xl font-bold text-gray-800">{seoResults.metrics.keywordDensity}%</p>
                <p className="text-xs text-gray-500 mt-1">Optimal: 1-3%</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Content Length</h3>
                <p className="text-2xl font-bold text-gray-800">{seoResults.metrics.contentLength}</p>
                <p className="text-xs text-gray-500 mt-1">words</p>
              </div>
            </div>
            
            {/* Optimizer Tips Section */}
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Optimizer Tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm text-gray-700">Include relevant header tags (H1, H2, H3) to structure your content</li>
                  <li className="text-sm text-gray-700">Add meta description between 150-160 characters with keywords</li>
                  <li className="text-sm text-gray-700">Adding sufficient internal and external links for improved SEO</li>
                  {seoResults.metrics.readabilityScore < 60 && (
                    <li className="text-sm text-gray-700">Improve readability by using shorter sentences and simpler words</li>
                  )}
                  {parseFloat(seoResults.metrics.keywordDensity) < 0.5 && (
                    <li className="text-sm text-gray-700">Consider adding primary keywords (0.5%-1%) to improve search visibility</li>
                  )}
                  {parseFloat(seoResults.metrics.keywordDensity) > 3 && (
                    <li className="text-sm text-gray-700">Keyword density too high (above 3%). Try to reduce keyword stuffing</li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Keywords and Preview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommended Keywords</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Relevance</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {seoResults.keywords.map((keyword, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{keyword.text}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{Math.round(keyword.score * 100)}%</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <button
                              className={`text-white text-xs font-medium py-1 px-2 rounded transition-colors ${
                                insertedKeywords.includes(keyword.text) 
                                ? 'bg-green-500' 
                                : 'bg-blue-500 hover:bg-blue-600'
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
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Optimized Text Preview</h3>
                <div className="bg-white rounded-lg shadow p-4 h-full">
                  <div className="overflow-auto h-64 text-sm text-gray-700">
                    {optimizedText ? (
                      <div dangerouslySetInnerHTML={renderOptimizedText()} />
                    ) : (
                      <p className="text-gray-400 italic">Your optimized content will appear here...</p>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors mr-2"
                      onClick={() => {
                        // Strip HTML tags when copying to clipboard
                        const plainText = optimizedText.replace(/<\/?[^>]+(>|$)/g, "");
                        navigator.clipboard.writeText(plainText);
                        alert('Text copied to clipboard!');
                      }}
                    >
                      Copy Text
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expert Usage Tips */}
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Expert Usage Tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm text-gray-700">Include each key SEO term at least once</li>
                  <li className="text-sm text-gray-700">Place important keywords in headings and the first paragraph</li>
                  <li className="text-sm text-gray-700">Consider LSI (Latent Semantic Indexing) keywords for improved ranking</li>
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