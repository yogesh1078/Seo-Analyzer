import React from 'react';

const TextPreview = ({ text }) => {
  return (
    <div className="border border-gray-200 rounded-md p-4 flex-1 min-h-[50vh] overflow-auto bg-gray-50">
      {text ? (
        <div className="prose max-w-none">
          {text.split('\n').map((paragraph, i) => (
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 italic h-full flex items-center justify-center">
          Your content preview will appear here...
        </div>
      )}
    </div>
  );
};

export default TextPreview;