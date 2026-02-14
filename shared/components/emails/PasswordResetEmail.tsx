import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface PasswordResetEmailProps {
  organizationName?: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  organizationName,
  resetUrl,
}) => (
  <Html>
    <Head />
    <Preview>Réinitialisez votre mot de passe Documo</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={h1}>Documo</Heading>
        </Section>

        <Section style={heroSection}>
          <Heading style={h2}>Réinitialisation de mot de passe</Heading>
          <Text style={text}>
            {organizationName
              ? `Bonjour ${organizationName}, `
              : 'Bonjour, '}
          </Text>
          <Text style={text}>
            Nous avons reçu une demande de réinitialisation de mot de passe pour
            votre compte Documo. Si vous êtes à l&apos;origine de cette demande,
            cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={resetUrl}>
            Réinitialiser mon mot de passe
          </Button>
        </Section>

        <Section style={linkSection}>
          <Text style={smallText}>
            Si le bouton ci-dessus ne fonctionne pas, vous pouvez copier et
            coller ce lien dans votre navigateur :
          </Text>
          <Link style={link} href={resetUrl}>
            {resetUrl}
          </Link>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            Ce lien de réinitialisation expire dans 1 heure. Si vous n&apos;avez
            pas demandé de réinitialisation de mot de passe, vous pouvez ignorer
            cet email en toute sécurité. Votre mot de passe ne sera pas modifié.
          </Text>
          <Text style={footerText}>
            Pour votre sécurité, ne partagez jamais ce lien avec personne.
          </Text>
          <Text style={footerText}>
            Cordialement,
            <br />
            L&apos;équipe Documo
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoSection = {
  padding: '0 48px',
  textAlign: 'center' as const,
  backgroundColor: '#dc2626', // Red color for reset email to indicate security action
  paddingTop: '32px',
  paddingBottom: '32px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0',
};

const heroSection = {
  padding: '0 48px',
  paddingTop: '40px',
  paddingBottom: '40px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 20px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
};

const buttonSection = {
  padding: '0 48px',
  textAlign: 'center' as const,
  paddingBottom: '40px',
};

const button = {
  backgroundColor: '#dc2626', // Red button for security action
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const linkSection = {
  padding: '0 48px',
  paddingBottom: '40px',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 10px 0',
};

const link = {
  color: '#dc2626', // Red link to match theme
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footerSection = {
  padding: '0 48px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 10px 0',
};
