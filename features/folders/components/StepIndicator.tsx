import { ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components';

export type FolderFormStep = 'selectType' | 'fillForm' | 'sendRequests';

interface StepIndicatorProps {
  currentStep: FolderFormStep;
  canGoBack: boolean;
  onGoBack: () => void;
}

interface StepConfig {
  id: FolderFormStep;
  label: string;
  number: number;
}

const steps: StepConfig[] = [
  { id: 'selectType', label: 'Sélectionner le type', number: 1 },
  { id: 'fillForm', label: 'Créer le dossier', number: 2 },
  { id: 'sendRequests', label: 'Envoyer des demandes', number: 3 },
];

const getStepStatus = (step: StepConfig, currentStep: FolderFormStep) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const stepIndex = steps.findIndex(s => s.id === step.id);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'upcoming';
};

const getStepClasses = (status: string) => {
  const baseClasses = 'flex items-center justify-center w-8 h-8 rounded-full';

  switch (status) {
    case 'completed':
      return `${baseClasses} bg-green-600 text-white`;
    case 'current':
      return `${baseClasses} bg-blue-600 text-white`;
    default:
      return `${baseClasses} bg-gray-300 text-gray-500`;
  }
};

const getTextClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'font-medium text-green-600';
    case 'current':
      return 'font-medium text-blue-600';
    default:
      return 'font-medium text-gray-500';
  }
};

export const StepIndicator = ({
  currentStep,
  canGoBack,
  onGoBack,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, currentStep);

          return (
            <div key={step.id} className="flex items-center space-x-4">
              <div className={getStepClasses(status)}>
                {status === 'completed' ? '✓' : step.number}
              </div>
              <span className={getTextClasses(status)}>{step.label}</span>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>

      {canGoBack && (
        <Button variant="outline" onClick={onGoBack}>
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          Retour
        </Button>
      )}
    </div>
  );
};
