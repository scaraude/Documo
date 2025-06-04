import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { API_ROUTES, ROUTES } from '@/shared/constants';
import { toast } from 'sonner';

interface ShareLinkButtonProps {
    requestId: string;
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareLinkButton({ requestId, variant = 'default', size = 'default' }: ShareLinkButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleShare = async () => {
        try {
            setIsLoading(true);

            // Generate share link
            const response = await fetch(API_ROUTES.EXTERNAL.SHARE_LINK(requestId), {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to generate share link');
            }

            const { token } = await response.json();

            // Construct the full URL
            const shareUrl = `${window.location.origin}${ROUTES.EXTERNAL.REQUEST(token)}`;

            // Copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            toast.success('Lien copié dans le presse-papiers');

            // Reset copy status after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
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
            className="gap-2"
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
