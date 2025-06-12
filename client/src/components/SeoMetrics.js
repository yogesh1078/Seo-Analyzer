import React from 'react';

const SeoMetrics = ({ metrics }) => {
  const getReadabilityLevel = (score) => {
    if (score >= 90) return { level: 'Very Easy', color: 'green' };
    if (score >= 80) return { level: 'Easy', color: 'green' };
    if (score >= 70) return { level: 'Fairly Easy', color: 'green' };
    if (score >= 60) return { level: 'Standard', color: 'yellow' };
    if (score >= 50) return { level: 'Fairly Difficult', color: 'yellow' };
    if (score >= 30) return { level: 'Difficult', color: 'red' };
    return { level: 'Very Difficult', color: 'red' };
  };

  const getKeywordDensityStatus = (density) => {
    const densityNum = parseFloat(density);
    if (densityNum < 0.5) return { status: 'Too Low', color: 'red' };
    if (densityNum >= 0.5 && densityNum <= 3) return { status: 'Optimal', color: 'green' };
    return { status: 'Too High', color: 'red' };
  };

  const getContentLengthStatus = (length) => {
    if (length < 300) return { status: 'Too Short', color: 'red' };
    if (length >= 300 && length < 600) return { status: 'Acceptable', color: 'yellow' };
    if (length >= 600) return { status: 'Good', color: 'green' };
    return { status: 'Unknown', color: 'gray' };
  };

  const readabilityInfo = getReadabilityLevel(metrics.readabilityScore);
  const densityInfo = getKeywordDensityStatus(metrics.keywordDensity);
  const lengthInfo = getContentLengthStatus(metrics.contentLength);

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      <div className={`p-3 rounded-md border-l-4 ${getColorClass(readabilityInfo.color)}`}>
        <div className="font-semibold">Readability Score</div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{metrics.readabilityScore}</div>
          <div className="text-sm font-medium pb-1">{readabilityInfo.level}</div>
        </div>
      </div>

      <div className={`p-3 rounded-md border-l-4 ${getColorClass(densityInfo.color)}`}>
        <div className="font-semibold">Keyword Density</div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{metrics.keywordDensity}%</div>
          <div className="text-sm font-medium pb-1">{densityInfo.status}</div>
        </div>
      </div>

      <div className={`p-3 rounded-md border-l-4 ${getColorClass(lengthInfo.color)}`}>
        <div className="font-semibold">Content Length</div>
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold">{metrics.contentLength}</div>
          <div className="text-sm font-medium pb-1">{lengthInfo.status}</div>
        </div>
      </div>
    </div>
  );
};

function getColorClass(color) {
  switch (color) {
    case 'green': return 'border-green-500 bg-green-50';
    case 'yellow': return 'border-yellow-500 bg-yellow-50';
    case 'red': return 'border-red-500 bg-red-50';
    default: return 'border-gray-500 bg-gray-50';
  }
}

export default SeoMetrics;