import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { workFields, expertiseLevels } from '@shared/schema';

const formSchema = z.object({
  field: z.enum(workFields),
  expertiseLevel: z.enum(expertiseLevels),
  timeHours: z.coerce.number().min(0).max(24),
  timeMinutes: z.coerce.number().min(0).max(59),
  focusArea: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ChallengeFormProps {
  onChallengesGenerated: (challenges: any[]) => void;
}

const ChallengeForm = ({ onChallengesGenerated }: ChallengeFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: undefined,
      expertiseLevel: undefined,
      timeHours: 0,
      timeMinutes: 30,
      focusArea: '',
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest('POST', '/api/challenges/generate', {
        ...data,
        count: 3 // Generate 3 challenges by default
      });
      return res.json();
    },
    onSuccess: (data) => {
      onChallengesGenerated(data);
      toast({
        title: "Challenges generated!",
        description: `${data.length} challenges have been created for you.`,
      });
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate challenges",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    generateMutation.mutate(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
              Field of Work
            </Label>
            <Select
              onValueChange={(value) => setValue('field', value as any)}
              defaultValue={watch('field')}
            >
              <SelectTrigger id="field" className="w-full">
                <SelectValue placeholder="Select a field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-development">Software Development</SelectItem>
                <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                <SelectItem value="design">Design (UI/UX/Graphic)</SelectItem>
                <SelectItem value="marketing">Digital Marketing</SelectItem>
                <SelectItem value="content-creation">Content Creation</SelectItem>
                <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                <SelectItem value="finance">Finance & Accounting</SelectItem>
                <SelectItem value="education">Education & Teaching</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="project-management">Project Management</SelectItem>
              </SelectContent>
            </Select>
            {errors.field && (
              <p className="text-sm text-red-500 mt-1">{errors.field.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Level of Expertise
            </Label>
            <Select
              onValueChange={(value) => setValue('expertiseLevel', value as any)}
              defaultValue={watch('expertiseLevel')}
            >
              <SelectTrigger id="expertiseLevel" className="w-full">
                <SelectValue placeholder="Select expertise..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {errors.expertiseLevel && (
              <p className="text-sm text-red-500 mt-1">{errors.expertiseLevel.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Available Time
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeHours" className="block text-xs text-gray-500 mb-1">
                  Hours
                </Label>
                <Input
                  id="timeHours"
                  type="number"
                  min="0"
                  max="24"
                  {...register('timeHours')}
                  placeholder="0"
                />
                {errors.timeHours && (
                  <p className="text-sm text-red-500 mt-1">{errors.timeHours.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="timeMinutes" className="block text-xs text-gray-500 mb-1">
                  Minutes
                </Label>
                <Input
                  id="timeMinutes"
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  {...register('timeMinutes')}
                  placeholder="30"
                />
                {errors.timeMinutes && (
                  <p className="text-sm text-red-500 mt-1">{errors.timeMinutes.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-1">
              Specific Focus Area (Optional)
            </Label>
            <Input
              id="focusArea"
              type="text"
              {...register('focusArea')}
              placeholder="e.g., React.js, Data Visualization, Email Campaigns..."
            />
            {errors.focusArea && (
              <p className="text-sm text-red-500 mt-1">{errors.focusArea.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full flex justify-center py-6 px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Challenges
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChallengeForm;
