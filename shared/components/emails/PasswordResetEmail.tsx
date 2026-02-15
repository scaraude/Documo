import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface PasswordResetEmailProps {
  organizationName?: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  organizationName = 'Utilisateur',
  resetUrl = 'https://documo.app/reset/abc123',
}) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://documo.app');

  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>Réinitialisez votre mot de passe Documo</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header avec logo */}
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" style={logoTable}>
              <tr>
                <td style={logoTd}>
                  <Img
                    src={`${baseUrl}/documo-icon.webp`}
                    width="40"
                    height="40"
                    alt="Documo"
                    style={logoImg}
                  />
                </td>
                <td style={logoTextTd}>
                  <Text style={logoText}>Documo</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Contenu principal */}
          <Section style={content}>
            <Heading style={h2}>Réinitialisation de mot de passe</Heading>
            <Text style={text}>Bonjour {organizationName},</Text>
            <Text style={text}>
              Nous avons reçu une demande de réinitialisation de mot de passe
              pour votre compte Documo. Cliquez sur le bouton ci-dessous pour
              créer un nouveau mot de passe.
            </Text>
          </Section>

          {/* Bouton CTA */}
          <Section style={buttonSection}>
            <Button style={button} href={resetUrl}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>

          {/* Lien alternatif */}
          <Section style={linkSection}>
            <Text style={smallText}>
              Si le bouton ne fonctionne pas, copiez ce lien :
            </Text>
            <Link style={link} href={resetUrl}>
              {resetUrl}
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Informations de sécurité */}
          <Section style={infoSection}>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>⏱️</Text>
              </Column>
              <Column>
                <Text style={infoText}>
                  Ce lien expire dans <strong>1 heure</strong>
                </Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>🔒</Text>
              </Column>
              <Column>
                <Text style={infoText}>
                  Ne partagez jamais ce lien avec personne
                </Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>ℹ️</Text>
              </Column>
              <Column>
                <Text style={infoText}>
                  Si vous n&apos;avez pas fait cette demande, ignorez cet email
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={signature}>
              Cordialement,
              <br />
              L&apos;équipe Documo
            </Text>

            <Text style={brandFooter}>
              Propulsé par <strong>Documo</strong> — L&apos;échange de documents
              à l&apos;ère moderne
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Brand Book Documo - Palette de couleurs
const colors = {
  bleuDocumo: '#2B7AE8',
  bleuProfond: '#1A5BB5',
  bleuClair: '#E8F1FC',
  noirDoux: '#1A1A2E',
  texteSecondaire: '#4A4A5A',
  texteTertiaire: '#8E8E9E',
  fondClair: '#F4F5F7',
  blanc: '#FFFFFF',
  bordure: '#E5E7EB',
  erreur: '#FF3B30',
};

const main = {
  backgroundColor: colors.fondClair,
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: colors.blanc,
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const header = {
  backgroundColor: colors.erreur,
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const logoTable = {
  margin: '0 auto',
};

const logoTd = {
  verticalAlign: 'middle' as const,
};

const logoTextTd = {
  verticalAlign: 'middle' as const,
  paddingLeft: '12px',
};

const logoImg = {
  borderRadius: '8px',
  display: 'block' as const,
};

const logoText = {
  color: colors.blanc,
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1',
};

const content = {
  padding: '32px 32px 24px',
};

const h2 = {
  color: colors.noirDoux,
  fontSize: '22px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 16px 0',
};

const text = {
  color: colors.texteSecondaire,
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const buttonSection = {
  padding: '0 32px 24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: colors.erreur,
  borderRadius: '8px',
  color: colors.blanc,
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const linkSection = {
  padding: '0 32px 24px',
};

const smallText = {
  color: colors.texteTertiaire,
  fontSize: '13px',
  lineHeight: '1.4',
  margin: '0 0 8px 0',
};

const link = {
  color: colors.erreur,
  fontSize: '13px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: colors.bordure,
  borderStyle: 'solid',
  borderWidth: '1px 0 0 0',
  margin: '0 32px',
};

const infoSection = {
  padding: '24px 32px',
};

const infoRow = {
  marginBottom: '12px',
};

const infoIconColumn = {
  width: '32px',
  verticalAlign: 'top' as const,
};

const infoIcon = {
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.4',
};

const infoText = {
  color: colors.texteSecondaire,
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '0',
};

const footerSection = {
  padding: '24px 32px 32px',
  backgroundColor: colors.fondClair,
};

const signature = {
  color: colors.texteSecondaire,
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 20px 0',
};

const brandFooter = {
  color: colors.texteTertiaire,
  fontSize: '11px',
  lineHeight: '1.4',
  margin: '0',
  textAlign: 'center' as const,
  paddingTop: '16px',
  borderTop: `1px solid ${colors.bordure}`,
};

export default PasswordResetEmail;
