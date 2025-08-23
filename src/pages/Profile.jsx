import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import extractUserDetails from '../utils/extractUserDetails'; // Changed from named to default import

// ...rest of your Profile.jsx code
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "CE", "AI/ML"];
const HUMOR_TYPES = ["Witty", "Sarcastic", "Dark", "Silly", "Meme Lord"];

const Profile = ({ isInitialSetup }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    branch: '',
    year: '1',
    bio: '',
    preferences: {
      redFlags: [],
      greenFlags: [],
      humorType: ''
    }
  });

 useEffect(() => {
  const fetchProfile = async () => {
    if (!user?.email) {
      navigate('/login');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.email));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      } else {
        const { name } = extractUserDetails(user.email);
        setProfile(prev => ({ ...prev, name }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (type, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: Array.isArray(prev.preferences[type])
          ? prev.preferences[type].includes(value)
            ? prev.preferences[type].filter(item => item !== value)
            : [...prev.preferences[type], value]
          : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, 'users', user.email), {
        ...profile,
        profileCompleted: true,
        updatedAt: new Date()
      });
      
      if (isInitialSetup) {
        navigate('/match');
      } else {
        // Just show success message for regular updates
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
          
          <div className="space-y-4">
            {/* Name (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile.name}
                readOnly
                className="mt-1 w-full p-2 border rounded bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">Name is extracted from your college email</p>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded"
              >
                <option value="">Select Branch</option>
                {BRANCHES.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded"
              >
                {[1, 2, 3, 4].map(year => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 w-full p-2 border rounded"
                placeholder="Tell us something about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Vibe</h2>
          
          {/* Humor Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your humor type? 😄
            </label>
            <div className="flex flex-wrap gap-2">
              {HUMOR_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePreferenceChange('humorType', type)}
                  className={`px-4 py-2 rounded-full ${
                    profile.preferences.humorType === type
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            saving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;