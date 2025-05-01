import { useQuery } from '@tanstack/react-query';
import ChallengeCard from '@/components/ChallengeCard';
import ChallengeDetailModal from '@/components/ChallengeDetailModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useChallenges } from '@/hooks/useChallenges';
import { Challenge } from '@shared/schema';

const SavedChallenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    savedChallengeIds, 
    completedChallengeIds,
    saveChallenge,
    unsaveChallenge,
    markChallengeComplete,
    markChallengeIncomplete
  } = useChallenges();

  const { data: savedChallenges, isLoading, error } = useQuery({
    queryKey: ['/api/saved-challenges'],
  });

  const handleOpenDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Challenges</h1>
          <p className="text-lg text-gray-600">Your bookmarked challenges for later</p>
        </div>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Challenges</h1>
          <p className="text-lg text-gray-600">Your bookmarked challenges for later</p>
        </div>
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>Error loading saved challenges: {(error as Error).message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const challenges = savedChallenges?.map((sc: any) => sc.challenge) || [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Challenges</h1>
        <p className="text-lg text-gray-600">Your bookmarked challenges for later</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow p-8">
          <div className="text-4xl mb-4">
            <i className="far fa-bookmark text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved challenges yet</h3>
          <p className="text-gray-600 mb-6">
            When you save challenges, they will appear here for easy access
          </p>
          <Button variant="default" onClick={() => window.location.href = '/'}>
            <i className="fas fa-arrow-left mr-2"></i>
            Go Generate Some Challenges
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Saved Challenges</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8">
                <i className="fas fa-filter mr-1"></i>
                Filter
              </Button>
            </div>
          </div>

          {challenges.map((challenge: Challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isSaved={savedChallengeIds.includes(challenge.id)}
              isCompleted={completedChallengeIds.includes(challenge.id)}
              onSaveToggle={handleSaveToggle}
              onCompleteToggle={handleCompleteToggle}
              onViewDetails={() => handleOpenDetails(challenge)}
            />
          ))}
        </div>
      )}

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isSaved={savedChallengeIds.includes(selectedChallenge.id)}
          onSaveToggle={(isSaved) => handleSaveToggle(selectedChallenge.id, isSaved)}
        />
      )}
    </div>
  );
};

export default SavedChallenges;
