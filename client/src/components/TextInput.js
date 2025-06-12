import React from 'react';

const TextInput = ({ text, onTextChange, onSubmit, isLoading }) => {
  return (
    <div className="flex flex-col flex-1">
      <textarea
        className="w-full border border-gray-300 rounded-md p-4 flex-1 min-h-[50vh] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter your blog post, newsletter, or social media content here..."
        disabled={isLoading}
      />
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          {text ? `${text.split(/\s+/).filter(Boolean).length} words` : '0 words'}
        </span>
        
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors ${
            isLoading ? 'opacity-70 cursor-wait' : ''
          }`}
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze SEO'
          )}
        </button>
      </div>
    </div>
  );
};

export default TextInput;