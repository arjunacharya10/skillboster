import { useState } from 'react';
import ChallengeForm from '@/components/ChallengeForm';
import ChallengeList from '@/components/ChallengeList';
import { useChallenges } from '@/hooks/useChallenges';
import { type Challenge } from '@shared/schema';

const Home = () => {
  const [generatedChallenges, setGeneratedChallenges] = useState<Challenge[]>([]);
  const { 
    savedChallengeIds,
    completedChallengeIds,
    saveChallenge,
    unsaveChallenge,
    markChallengeComplete,
    markChallengeIncomplete
  } = useChallenges();

  const handleChallengesGenerated = (challenges: Challenge[]) => {
    setGeneratedChallenges(challenges);
  };

  const handleSaveToggle = (challengeId: number, isSaved: boolean) => {
    if (isSaved) {
      saveChallenge(challengeId);
    } else {
      unsaveChallenge(challengeId);
    }
  };

  const handleCompleteToggle = (challengeId: number, isCompleted: boolean) => {
    if (isCompleted) {
      markChallengeComplete(challengeId);
    } else {
      markChallengeIncomplete(challengeId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fun & Creative Hobby Challenges</h1>
        <p className="text-lg text-gray-600">Generate personalized challenges for your favorite hobbies and interests based on your available time</p>
      </div>

      <div className="mb-8">
        <ChallengeForm onChallengesGenerated={handleChallengesGenerated} />
      </div>

      {generatedChallenges.length > 0 && (
        <ChallengeList 
          challenges={generatedChallenges}
          savedChallengeIds={savedChallengeIds}
          completedChallengeIds={completedChallengeIds}
          onSaveToggle={handleSaveToggle}
          onCompleteToggle={handleCompleteToggle}
        />
      )}
    </div>
  );
};

export default Home;
