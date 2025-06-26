import { useState } from 'react';
import { Users, Send, Plus, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@/shared/components';
import { FolderType } from '@/features/folder-types/types';
import { Folder } from '../types';

interface RequestsStepProps {
  folder: Folder;
  selectedType: FolderType;
  isLoading: boolean;
  onSendRequests: (emails: string[]) => Promise<void>;
  onSkip: () => void;
}

interface EmailInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  disabled?: boolean;
}

const EmailInput = ({
  emails,
  onChange,
  disabled = false,
}: EmailInputProps) => {
  const addEmail = () => {
    onChange([...emails, '']);
  };

  const removeEmail = (index: number) => {
    onChange(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    onChange(emails.map((email, i) => (i === index ? value : email)));
  };

  return (
    <div className="space-y-3">
      {emails.map((email, index) => (
        <div key={index} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={e => updateEmail(index, e.target.value)}
            placeholder="email@exemple.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled}
          />
          {emails.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEmail(index)}
              className="text-red-600 hover:text-red-700"
              disabled={disabled}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addEmail}
        disabled={disabled}
        type="button"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une personne
      </Button>
    </div>
  );
};

export const RequestsStep = ({
  folder,
  selectedType,
  isLoading,
  onSendRequests,
  onSkip,
}: RequestsStepProps) => {
  const [emails, setEmails] = useState<string[]>(['']);

  const handleSendRequests = async () => {
    const validEmails = emails
      .map(email => email.trim())
      .filter(email => email !== '' && email.includes('@'));

    await onSendRequests(validEmails);
  };

  const hasValidEmails = emails.some(
    email => email.trim() !== '' && email.includes('@')
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Dossier créé avec succès !
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Votre dossier <strong>{folder.name}</strong> a été créé. Vous pouvez
            maintenant envoyer des demandes de documents aux personnes
            concernées.
          </p>
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">
              Documents qui seront demandés :
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedType.requiredDocuments.map((doc, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-blue-700 border-blue-300"
                >
                  {doc.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Envoyer des demandes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Ajoutez les adresses email des personnes à qui vous voulez envoyer
            une demande de documents.
          </p>

          <EmailInput
            emails={emails}
            onChange={setEmails}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onSkip} disabled={isLoading}>
          Passer cette étape
        </Button>
        <Button
          onClick={handleSendRequests}
          disabled={isLoading || !hasValidEmails}
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? 'Envoi...' : 'Envoyer les demandes'}
        </Button>
      </div>
    </div>
  );
};
