import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Challenge } from '@shared/schema';

interface ChallengeDetailModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onSaveToggle: (isSaved: boolean) => void;
}

const ChallengeDetailModal = ({
  challenge,
  isOpen,
  onClose,
  isSaved,
  onSaveToggle
}: ChallengeDetailModalProps) => {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{challenge.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary-100 text-primary-800 border-primary-200">
            {getFieldDisplayName(challenge.field)}
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <i className="fas fa-clock mr-1"></i> {formatTime(challenge.timeHours, challenge.timeMinutes)}
          </Badge>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 capitalize">
            {challenge.expertiseLevel}
          </Badge>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Challenge Description</h4>
          <p className="text-sm text-gray-600">{challenge.description}</p>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Requirements</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {challenge.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
        
        {challenge.resources && challenge.resources.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Resources</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {challenge.resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Skills Developed</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {challenge.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <DialogFooter className="mt-6 gap-2">
          <Button variant="default">
            Start Challenge
          </Button>
          <Button 
            variant="outline"
            onClick={() => onSaveToggle(!isSaved)}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark mr-2`}></i>
            {isSaved ? 'Unsave' : 'Save for Later'}
          </Button>
          <Button 
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeDetailModal;
