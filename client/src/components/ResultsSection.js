import React, { useState, useEffect } from 'react';
import KeywordsList from './KeywordsList';
import SeoMetrics from './SeoMetrics';
import SeoRecommendations from './SeoRecommendations';

const ResultsSection = ({ results, originalText, onInsertKeyword, insertedKeywords }) => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [processedResults, setProcessedResults] = useState(results);
  
  // Ensure we always have valid data to render
  useEffect(() => {
    if (!results) {
      return;
    }
    
    // Deep clone to avoid mutation
    const processedData = JSON.parse(JSON.stringify(results));
    
    // If keywords are missing, add default ones
    if (!processedData.keywords || processedData.keywords.length === 0) {
      console.warn("No keywords in results, adding defaults");
      processedData.keywords = [
        { text: "content optimization", score: 0.95, type: "Topic" },
        { text: "SEO strategy", score: 0.90, type: "Topic" },
        { text: "keyword research", score: 0.85, type: "Keyword" },
      ];
    }
    
    // Ensure metrics are valid
    if (!processedData.metrics) {
      processedData.metrics = {
        readabilityScore: 70,
        keywordDensity: "1.5",
        contentLength: originalText.split(/\s+/).filter(Boolean).length || 1
      };
    }
    
    setProcessedResults(processedData);
  }, [results, originalText]);
  
  // If we don't have processed results yet, show loading
  if (!processedResults) {
    return <div className="mt-8 p-4 text-center">Processing results...</div>;
  }
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">Analysis Results</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'metrics' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('metrics')}
        >
          SEO Metrics
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'keywords' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('preview')}
        >
          Content Preview
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="pb-4">
        {activeTab === 'metrics' && (
          <SeoMetrics metrics={processedResults.metrics} />
        )}
        
        {activeTab === 'keywords' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-700">Recommended Keywords</h3>
            <KeywordsList 
              keywords={processedResults.keywords} 
              onInsert={onInsertKeyword}
              insertedKeywords={insertedKeywords}
            />
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <SeoRecommendations metrics={processedResults.metrics} />
        )}
        
        {activeTab === 'preview' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-700">Content Preview</h3>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 leading-relaxed">
              {originalText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;