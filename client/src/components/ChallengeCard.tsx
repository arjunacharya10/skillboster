import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { type Challenge } from '@shared/schema';

interface ChallengeCardProps {
  challenge: Challenge;
  isSaved: boolean;
  isCompleted: boolean;
  onSaveToggle: (challengeId: number, isSaved: boolean) => void;
  onCompleteToggle: (challengeId: number, isCompleted: boolean) => void;
  onViewDetails: () => void;
}

const ChallengeCard = ({
  challenge,
  isSaved,
  isCompleted,
  onSaveToggle,
  onCompleteToggle,
  onViewDetails
}: ChallengeCardProps) => {
  const formatTime = (hours: number, minutes: number) => {
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const getFieldDisplayName = (field: string): string => {
    return field
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="challenge-card bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 card-shadow transition hover:shadow-lg hover:-translate-y-1">
      <div className="px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="bg-primary-100 text-primary-800 border-primary-200 mb-2">
              {getFieldDisplayName(challenge.field)}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 ml-2 mb-2">
              <i className="fas fa-clock mr-1"></i> {formatTime(challenge.timeHours, challenge.timeMinutes)}
            </Badge>
            <h3 className="text-lg font-medium text-gray-900 mt-1">{challenge.title}</h3>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`focus:outline-none ${isSaved ? 'text-primary-500 hover:text-gray-400' : 'text-gray-400 hover:text-primary-500'}`}
              title={isSaved ? 'Unsave Challenge' : 'Save Challenge'}
              onClick={() => onSaveToggle(challenge.id, !isSaved)}
            >
              <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
            </button>
            <button 
              className={`focus:outline-none ${isCompleted ? 'text-success-500 hover:text-gray-400' : 'text-gray-400 hover:text-success-500'}`}
              title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              onClick={() => onCompleteToggle(challenge.id, !isCompleted)}
            >
              <i className={`${isCompleted ? 'fas' : 'far'} fa-check-circle`}></i>
            </button>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">{challenge.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {challenge.tags && challenge.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500 capitalize">{challenge.expertiseLevel}</span>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={onViewDetails}
          className="text-primary-700 bg-primary-50 hover:bg-primary-100"
        >
          <i className="fas fa-info-circle mr-1"></i>
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ChallengeCard;
