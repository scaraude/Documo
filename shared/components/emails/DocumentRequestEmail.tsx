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

interface DocumentRequestEmailProps {
  recipientEmail: string;
  organizationName?: string;
  requestedDocuments: string[];
  uploadUrl: string;
  expirationDate: string;
  folderName: string;
}

export const DocumentRequestEmail = ({
  recipientEmail = 'destinataire@exemple.fr',
  organizationName = 'Acme Corp',
  requestedDocuments = ["Pièce d'identité", 'Justificatif de domicile', 'RIB'],
  uploadUrl = 'https://documo.app/upload/abc123',
  expirationDate = '15 mars 2026',
  folderName = 'Dossier de location',
}: DocumentRequestEmailProps) => {
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
      <Preview>
        {organizationName} vous demande des documents - {folderName}
      </Preview>
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
            <Heading as="h2" style={h2}>
              Bonjour,
            </Heading>

            <Text style={text}>
              <strong>{organizationName}</strong> vous demande de fournir des
              documents pour le dossier <strong>{folderName}</strong>.
            </Text>

            {/* Liste des documents avec icônes */}
            <Section style={documentListContainer}>
              <Text style={documentListTitle}>Documents demandés</Text>
              <Section style={documentList}>
                {requestedDocuments.map((document, index) => (
                  <Row
                    key={document}
                    style={
                      index === requestedDocuments.length - 1
                        ? documentRowLast
                        : documentRow
                    }
                  >
                    <Column style={iconColumn}>
                      <Text style={documentIcon}>📄</Text>
                    </Column>
                    <Column style={documentTextColumn}>
                      <Text style={documentItem}>{document}</Text>
                    </Column>
                    <Column style={statusColumn}>
                      <Text style={pendingBadge}>En attente</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Section>

            <Text style={text}>
              Transmettez vos documents de manière sécurisée en cliquant sur le
              bouton ci-dessous.
            </Text>
          </Section>

          {/* Bouton CTA */}
          <Section style={buttonSection}>
            <Button style={button} href={uploadUrl}>
              Transmettre mes documents
            </Button>
          </Section>

          {/* Lien alternatif */}
          <Section style={linkSection}>
            <Text style={smallText}>
              Si le bouton ne fonctionne pas, copiez ce lien :
            </Text>
            <Link style={link} href={uploadUrl}>
              {uploadUrl}
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Informations importantes */}
          <Section style={infoSection}>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>⏱️</Text>
              </Column>
              <Column>
                <Text style={infoText}>
                  Expire le <strong>{expirationDate}</strong>
                </Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>🔒</Text>
              </Column>
              <Column>
                <Text style={infoText}>Documents chiffrés et sécurisés</Text>
              </Column>
            </Row>
            <Row style={infoRow}>
              <Column style={infoIconColumn}>
                <Text style={infoIcon}>✨</Text>
              </Column>
              <Column>
                <Text style={infoText}>
                  Une fois transmis, plus besoin de les renvoyer
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

            <Text style={disclaimer}>
              Cet email a été envoyé à {recipientEmail}.
              <br />
              Si vous avez reçu cet email par erreur, vous pouvez
              l&apos;ignorer.
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
  succes: '#34C759',
  attention: '#FF9500',
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
  backgroundColor: colors.bleuDocumo,
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
  margin: '0 0 20px 0',
};

const documentListContainer = {
  margin: '24px 0',
};

const documentListTitle = {
  color: colors.noirDoux,
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 12px 0',
};

const documentList = {
  backgroundColor: colors.fondClair,
  borderRadius: '8px',
  padding: '8px 0',
};

const documentRow = {
  padding: '12px 16px',
  borderBottom: `1px solid ${colors.bordure}`,
};

const documentRowLast = {
  padding: '12px 16px',
};

const iconColumn = {
  width: '32px',
  verticalAlign: 'middle' as const,
};

const documentIcon = {
  fontSize: '16px',
  margin: '0',
  lineHeight: '1',
};

const documentTextColumn = {
  verticalAlign: 'middle' as const,
};

const documentItem = {
  color: colors.noirDoux,
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '1.4',
};

const statusColumn = {
  width: '80px',
  textAlign: 'right' as const,
  verticalAlign: 'middle' as const,
};

const pendingBadge = {
  backgroundColor: colors.attention,
  color: colors.blanc,
  fontSize: '11px',
  fontWeight: '600',
  padding: '4px 8px',
  borderRadius: '4px',
  margin: '0',
  display: 'inline-block',
};

const buttonSection = {
  padding: '0 32px 24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: colors.bleuDocumo,
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
  color: colors.bleuDocumo,
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

const disclaimer = {
  color: colors.texteTertiaire,
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
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
