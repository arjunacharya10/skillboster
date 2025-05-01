import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChallengeCard from './ChallengeCard';
import ChallengeDetailModal from './ChallengeDetailModal';
import { type Challenge } from '@shared/schema';

interface ChallengeListProps {
  challenges: Challenge[];
  savedChallengeIds?: number[];
  completedChallengeIds?: number[];
  onSaveToggle: (challengeId: number, isSaved: boolean) => void;
  onCompleteToggle: (challengeId: number, isCompleted: boolean) => void;
}

const ChallengeList = ({
  challenges,
  savedChallengeIds = [],
  completedChallengeIds = [],
  onSaveToggle,
  onCompleteToggle
}: ChallengeListProps) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Generated Challenges</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <i className="fas fa-filter mr-1"></i>
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <i className="fas fa-redo-alt mr-1"></i>
            Regenerate
          </Button>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No challenges generated yet. Fill out the form above to get started!</p>
        </div>
      ) : (
        <>
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isSaved={savedChallengeIds.includes(challenge.id)}
              isCompleted={completedChallengeIds.includes(challenge.id)}
              onSaveToggle={onSaveToggle}
              onCompleteToggle={onCompleteToggle}
              onViewDetails={() => handleOpenDetails(challenge)}
            />
          ))}

          <div className="flex justify-center mt-6">
            <Button variant="outline">
              <i className="fas fa-sync mr-2"></i>
              Load More Challenges
            </Button>
          </div>
        </>
      )}

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isSaved={savedChallengeIds.includes(selectedChallenge.id)}
          onSaveToggle={(isSaved) => onSaveToggle(selectedChallenge.id, isSaved)}
        />
      )}
    </div>
  );
};

export default ChallengeList;
