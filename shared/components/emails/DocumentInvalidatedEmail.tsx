import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface DocumentInvalidatedEmailProps {
  organizationName?: string;
  folderName: string;
  documentLabel: string;
  reason: string;
  uploadUrl: string;
}

export const DocumentInvalidatedEmail = ({
  organizationName = 'Documo',
  folderName,
  documentLabel,
  reason,
  uploadUrl,
}: DocumentInvalidatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Document a corriger - nouvelle transmission requise</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Document a corriger</Heading>

          <Text style={text}>
            Votre document <strong>{documentLabel}</strong> pour le dossier{' '}
            <strong>{folderName}</strong> n&apos;a pas pu etre valide.
          </Text>

          <Section style={reasonBox}>
            <Text style={reasonTitle}>Motif</Text>
            <Text style={reasonText}>{reason}</Text>
          </Section>

          <Text style={text}>
            Merci de transmettre une nouvelle version via le lien securise
            ci-dessous.
          </Text>

          <Section style={buttonWrapper}>
            <Button style={button} href={uploadUrl}>
              Reenvoyer le document
            </Button>
          </Section>

          <Text style={small}>
            Si le bouton ne fonctionne pas, utilisez ce lien:
            <br />
            {uploadUrl}
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            Message envoye par {organizationName} via Documo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f4f5f7',
  fontFamily: 'Arial, sans-serif',
  padding: '24px 0',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '28px',
};

const heading = {
  color: '#1a1a2e',
  fontSize: '22px',
  margin: '0 0 16px 0',
};

const text = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px 0',
};

const reasonBox = {
  backgroundColor: '#fff4f4',
  border: '1px solid #fecaca',
  borderRadius: '6px',
  padding: '14px',
  marginBottom: '16px',
};

const reasonTitle = {
  color: '#991b1b',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
};

const reasonText = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const buttonWrapper = {
  margin: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2b7ae8',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 18px',
};

const small = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};
