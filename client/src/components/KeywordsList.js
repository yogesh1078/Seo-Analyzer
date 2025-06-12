import React from 'react';

const KeywordsList = ({ keywords, onInsert, insertedKeywords = [] }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="text-gray-500 h-full flex items-center justify-center">
        No keywords available. Try analyzing a longer text.
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto pr-2 max-h-[calc(100vh-320px)]">
      {keywords.map((keyword, index) => {
        const isInserted = insertedKeywords.includes(keyword.text);
        return (
          <div 
            key={index} 
            className={`flex justify-between items-center p-2 rounded ${
              isInserted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div>
              <div className="font-medium">{keyword.text}</div>
              <div className="text-xs text-gray-500">
                Relevance: {Math.round((keyword.score || 0.5) * 100)}%
              </div>
            </div>
            <button 
              className={`ml-2 px-3 py-1 rounded text-sm ${
                isInserted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              }`}
              onClick={() => !isInserted && onInsert(keyword.text)}
              disabled={isInserted}
            >
              {isInserted ? 'Added' : 'Insert'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default KeywordsList;