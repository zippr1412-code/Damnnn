import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  Timestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';
import MatchCard from '../components/MatchCard';
import MatchTypeSelector from '../components/MatchTypeSelector';

const MatchRoom = () => {
  const { user } = useAuth();
  const [matchType, setMatchType] = useState('regular');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isLightningHour, setIsLightningHour] = useState(false);
  const [timer, setTimer] = useState(null);

  // Check if it's Lightning Hour (8-9 PM)
  useEffect(() => {
    const checkLightningHour = () => {
      const now = new Date();
      const hour = now.getHours();
      const isLightning = hour >= 20 && hour < 21;
      setIsLightningHour(isLightning);
      
      if (isLightning) {
        const endTime = new Date();
        endTime.setHours(21, 0, 0, 0);
        setTimer(Math.floor((endTime - now) / 1000));
      }
    };

    checkLightningHour();
    const interval = setInterval(checkLightningHour, 60000);
    return () => clearInterval(interval);
  }, []);

  const findMatch = async () => {
    if (!user?.email) return;

    try {
      const usersRef = collection(db, 'users');
      let matchQuery;

      if (isLightningHour) {
        // Lightning hour: Random match
        matchQuery = query(
          usersRef,
          where('email', '!=', user.email),
          where('lightningAvailable', '==', true)
        );
      } else {
        // Regular match based on preferences
        const userDoc = await getDocs(query(usersRef, where('email', '==', user.email)));
        if (!userDoc.docs[0]) return;
        
        const userData = userDoc.docs[0].data();
        matchQuery = query(
          usersRef,
          where('email', '!=', user.email),
          where('branch', '==', userData.branch),
          where('year', '==', userData.year)
        );
      }

      const matchSnapshot = await getDocs(matchQuery);
      const potentialMatches = matchSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(match => !match.seenBy?.includes(user.email));

      if (potentialMatches.length > 0) {
        const randomMatch = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];
        setCurrentMatch(randomMatch);

        // Update seen status
        const userRef = doc(db, 'users', user.email);
        await updateDoc(userRef, {
          seenBy: [...(user.seenBy || []), randomMatch.email]
        });
      }
    } catch (error) {
      console.error('Error finding match:', error);
    }
  };

  const handleAccept = async () => {
    if (!currentMatch || !user?.email) return;

    try {
      await addDoc(collection(db, 'matches'), {
        users: [user.email, currentMatch.email],
        timestamp: Timestamp.now(),
        type: isLightningHour ? 'lightning' : matchType,
        status: 'pending',
        expiresAt: isLightningHour 
          ? Timestamp.fromDate(new Date(Date.now() + 3600000))
          : null
      });

      setCurrentMatch(null);
      findMatch();
    } catch (error) {
      console.error('Error accepting match:', error);
    }
  };

  const handleDecline = async () => {
    if (!currentMatch || !user?.email) return;

    try {
      const userRef = doc(db, 'users', user.email);
      await updateDoc(userRef, {
        seenBy: [...(user.seenBy || []), currentMatch.email]
      });

      setCurrentMatch(null);
      findMatch();
    } catch (error) {
      console.error('Error declining match:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        {isLightningHour && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4">
            ⚡ Lightning Hour Active! 
            {timer && (
              <span className="ml-2">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2">
          {isLightningHour ? "⚡ Lightning Matches" : "Find Your Match"}
        </h1>
        <p className="text-gray-600">
          {isLightningHour 
            ? "Quick matches with random people for the next hour!" 
            : "Connect with people who match your vibe"}
        </p>
      </div>

      {!isLightningHour && (
        <MatchTypeSelector 
          selectedType={matchType}
          onSelect={setMatchType}
        />
      )}

      {currentMatch ? (
        <MatchCard 
          match={currentMatch}
          onAccept={handleAccept}
          onDecline={handleDecline}
          isLightning={isLightningHour}
        />
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            Ready to find your next match?
          </p>
          <button
            onClick={findMatch}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Start Matching
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchRoom;