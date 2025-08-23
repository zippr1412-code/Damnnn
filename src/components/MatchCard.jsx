import React from 'react';

const MatchCard = ({ match, onAccept, onDecline, isLightning }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {match.isAnonymous ? "Anonymous" : match.name}
          </h2>
          {isLightning && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              ⚡ Lightning Match
            </span>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            {match.branch} • Year {match.year}
          </p>
          <p className="text-gray-800">{match.bio}</p>

          <div className="flex justify-between text-sm text-gray-500">
            <span>{match.compatibility}% Match</span>
            {isLightning && <span>Expires in 1 hour</span>}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onDecline}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Pass
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;