import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/constants';
import { toast } from 'sonner';
import { useExternalRequest } from '../hooks/useExternalRequest';

interface ShareLinkButtonProps {
    requestId: string;
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareLinkButton({ requestId, variant = 'outline', size = 'default' }: ShareLinkButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { generateShareLink } = useExternalRequest();

    const handleShare = async () => {
        try {
            generateShareLink.mutate({ requestId }, {
                onSuccess: async ({ token }) => {
                    const shareUrl = `${window.location.origin}${ROUTES.EXTERNAL.REQUEST(token)}`;
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success('Lien copié dans le presse-papiers');
                    setIsCopied(true);
                    // Reset copy status after 2 seconds
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 2000);
                },
                onError: () => {
                    toast.error('Erreur lors de la génération du lien de partage');
                },
            })

        } catch (error) {
            console.error('Error sharing link:', error);
            toast.error('Erreur lors de la génération du lien de partage');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleShare}
            disabled={isLoading}
            className="gap-2 hover:border-gray-400"
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4" />
                    Copié !
                </>
            ) : (
                <>
                    {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    ) : (
                        <LinkIcon className="h-4 w-4" />
                    )}
                    Partager le lien
                </>
            )}
        </Button>
    );
}
