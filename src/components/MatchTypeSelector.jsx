import React from 'react';

const matchTypes = [
  { id: 'regular', name: 'Regular Match', icon: '🤝' },
  { id: 'similar', name: 'Similar Vibes', icon: '✨' },
  { id: 'opposite', name: 'Opposites Attract', icon: '🔄' }
];

const MatchTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {matchTypes.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`p-4 rounded-lg transition ${
            selectedType === type.id
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl mb-2">{type.icon}</div>
          <div className="font-medium">{type.name}</div>
        </button>
      ))}
    </div>
  );
};

export default MatchTypeSelector;