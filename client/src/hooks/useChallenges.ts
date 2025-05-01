import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export const useChallenges = () => {
  const [savedChallengeIds, setSavedChallengeIds] = useState<number[]>([]);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load saved challenges on mount
  useEffect(() => {
    const fetchSavedChallenges = async () => {
      try {
        const response = await fetch('/api/saved-challenges');
        if (!response.ok) throw new Error('Failed to fetch saved challenges');
        
        const data = await response.json();
        
        // Extract saved and completed challenge IDs
        const savedIds = data.map((item: any) => item.challengeId);
        const completedIds = data
          .filter((item: any) => item.isCompleted)
          .map((item: any) => item.challengeId);
        
        setSavedChallengeIds(savedIds);
        setCompletedChallengeIds(completedIds);
      } catch (error) {
        console.error('Error fetching saved challenges:', error);
      }
    };

    fetchSavedChallenges();
  }, []);

  // Save challenge mutation
  const saveMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      await apiRequest('POST', `/api/challenges/${challengeId}/save`);
      return challengeId;
    },
    onSuccess: (challengeId) => {
      setSavedChallengeIds(prev => [...prev, challengeId]);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-challenges'] });
      toast({
        title: "Challenge saved",
        description: "The challenge has been added to your saved list",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unsave challenge mutation
  const unsaveMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      await apiRequest('DELETE', `/api/challenges/${challengeId}/save`);
      return challengeId;
    },
    onSuccess: (challengeId) => {
      setSavedChallengeIds(prev => prev.filter(id => id !== challengeId));
      setCompletedChallengeIds(prev => prev.filter(id => id !== challengeId));
      queryClient.invalidateQueries({ queryKey: ['/api/saved-challenges'] });
      toast({
        title: "Challenge removed",
        description: "The challenge has been removed from your saved list",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark challenge as complete mutation
  const completeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      // Save the challenge first if it's not already saved
      if (!savedChallengeIds.includes(challengeId)) {
        await apiRequest('POST', `/api/challenges/${challengeId}/save`);
      }
      
      await apiRequest('PATCH', `/api/challenges/${challengeId}/complete`, {
        isCompleted: true
      });
      
      return challengeId;
    },
    onSuccess: (challengeId) => {
      if (!savedChallengeIds.includes(challengeId)) {
        setSavedChallengeIds(prev => [...prev, challengeId]);
      }
      setCompletedChallengeIds(prev => [...prev, challengeId]);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-challenges'] });
      toast({
        title: "Challenge completed",
        description: "Great job! The challenge has been marked as complete.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to complete challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark challenge as incomplete mutation
  const incompleteMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      await apiRequest('PATCH', `/api/challenges/${challengeId}/complete`, {
        isCompleted: false
      });
      
      return challengeId;
    },
    onSuccess: (challengeId) => {
      setCompletedChallengeIds(prev => prev.filter(id => id !== challengeId));
      queryClient.invalidateQueries({ queryKey: ['/api/saved-challenges'] });
      toast({
        title: "Challenge status updated",
        description: "The challenge has been marked as incomplete.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update challenge status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    savedChallengeIds,
    completedChallengeIds,
    saveChallenge: (challengeId: number) => saveMutation.mutate(challengeId),
    unsaveChallenge: (challengeId: number) => unsaveMutation.mutate(challengeId),
    markChallengeComplete: (challengeId: number) => completeMutation.mutate(challengeId),
    markChallengeIncomplete: (challengeId: number) => incompleteMutation.mutate(challengeId),
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
    isMarking: completeMutation.isPending || incompleteMutation.isPending,
  };
};
