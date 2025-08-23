import React from 'react';

const redFlagOptions = [
  "Doesn't respect boundaries",
  "Bad communication",
  "Emotional unavailability",
  "Inconsistency",
  "Lack of ambition"
];

const greenFlagOptions = [
  "Good listener",
  "Emotionally intelligent",
  "Respects boundaries",
  "Clear communication",
  "Ambitious"
];

const humorTypes = [
  "Witty",
  "Sarcastic",
  "Silly",
  "Dark",
  "Wholesome"
];

const FlagsSelector = ({ preferences, onChange }) => {
  const handleFlagChange = (type, value) => {
    onChange(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(f => f !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Red Flags 🚩</h3>
        <div className="flex flex-wrap gap-2">
          {redFlagOptions.map(flag => (
            <button
              key={flag}
              onClick={() => handleFlagChange('redFlags', flag)}
              className={`px-3 py-1 rounded-full ${
                preferences.redFlags.includes(flag)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Green Flags 💚</h3>
        <div className="flex flex-wrap gap-2">
          {greenFlagOptions.map(flag => (
            <button
              key={flag}
              onClick={() => handleFlagChange('greenFlags', flag)}
              className={`px-3 py-1 rounded-full ${
                preferences.greenFlags.includes(flag)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Humor Type 😄</h3>
        <div className="flex flex-wrap gap-2">
          {humorTypes.map(type => (
            <button
              key={type}
              onClick={() => onChange(prev => ({ ...prev, humorType: type }))}
              className={`px-3 py-1 rounded-full ${
                preferences.humorType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagsSelector;