import React from 'react';

const SeoRecommendations = ({ metrics }) => {
  // Generate recommendations based on metrics
  const recommendations = [];
  
  // Readability recommendations
  if (metrics.readabilityScore < 60) {
    recommendations.push({
      title: "Improve readability",
      description: "Use shorter sentences and simpler words.",
      priority: "high"
    });
  }
  
  // Keyword density recommendations
  const keywordDensity = parseFloat(metrics.keywordDensity);
  if (keywordDensity < 0.5) {
    recommendations.push({
      title: "Increase keyword usage",
      description: "Include your main keyword more frequently.",
      priority: "medium"
    });
  } else if (keywordDensity > 3) {
    recommendations.push({
      title: "Reduce keyword density",
      description: "Your content may be flagged for keyword stuffing.",
      priority: "high"
    });
  }
  
  // Content length recommendations
  if (metrics.contentLength < 300) {
    recommendations.push({
      title: "Add more content",
      description: "Longer content typically ranks better in search results.",
      priority: "high"
    });
  }
  
  // Always include helpful SEO tips
  recommendations.push({
    title: "Use header tags (H1, H2, H3)",
    description: "Structure your content with proper headers.",
    priority: "medium"
  });
  
  recommendations.push({
    title: "Add meta description",
    description: "Write a compelling meta description with your target keyword.",
    priority: "medium"
  });

  return (
    <div className="space-y-3 overflow-y-auto pr-1 max-h-[calc(100vh-320px)]">
      {recommendations.map((rec, index) => (
        <div 
          key={index} 
          className={`p-3 rounded border-l-4 ${getPriorityBorderColor(rec.priority)}`}
        >
          <h3 className="font-semibold">{rec.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
        </div>
      ))}
    </div>
  );
};

function getPriorityBorderColor(priority) {
  switch (priority) {
    case 'high': return 'border-red-500 bg-red-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    default: return 'border-blue-500 bg-blue-50';
  }
}

export default SeoRecommendations;