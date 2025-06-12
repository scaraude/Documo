import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Preview,
} from '@react-email/components';

interface DocumentRequestEmailProps {
  recipientEmail: string;
  requesterName?: string;
  requestedDocuments: string[];
  uploadUrl: string;
  expirationDate: string;
  folderName: string;
}

export const DocumentRequestEmail = ({
  recipientEmail,
  requesterName = "L'équipe Document Transfer",
  requestedDocuments,
  uploadUrl,
  expirationDate,
  folderName,
}: DocumentRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Demande de documents - {folderName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={title}>📄 Document Transfer App</Heading>
          </Section>
          
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              Bonjour,
            </Heading>
            
            <Text style={paragraph}>
              {requesterName} vous demande de fournir des documents pour le dossier <strong>&ldquo;{folderName}&rdquo;</strong>.
            </Text>
            
            <Text style={paragraph}>
              Voici la liste des documents requis :
            </Text>
            
            <Section style={documentList}>
              {requestedDocuments.map((document, index) => (
                <Text key={index} style={documentItem}>
                  • {document}
                </Text>
              ))}
            </Section>
            
            <Text style={paragraph}>
              Pour télécharger vos documents de manière sécurisée, cliquez sur le bouton ci-dessous :
            </Text>
            
            <Section style={buttonContainer}>
              <Button style={button} href={uploadUrl}>
                Télécharger mes documents
              </Button>
            </Section>
            
            <Text style={paragraph}>
              Si le bouton ne fonctionne pas, vous pouvez également copier et coller ce lien dans votre navigateur :
            </Text>
            <Text style={linkText}>{uploadUrl}</Text>
            
            <Hr style={divider} />
            
            <Section style={infoBox}>
              <Text style={infoTitle}>ℹ️ Informations importantes :</Text>
              <Text style={infoText}>
                • Cette demande expire le <strong>{expirationDate}</strong>
              </Text>
              <Text style={infoText}>
                • Vos documents seront chiffrés et sécurisés
              </Text>
              <Text style={infoText}>
                • Une fois téléchargés, vous n&apos;aurez plus jamais à les envoyer
              </Text>
              <Text style={infoText}>
                • Seules les personnes autorisées pourront accéder à vos documents
              </Text>
            </Section>
            
            <Hr style={divider} />
            
            <Text style={footer}>
              Merci pour votre confiance,<br />
              L&apos;équipe Document Transfer App
            </Text>
            
            <Text style={disclaimer}>
              Cet email a été envoyé à <strong>{recipientEmail}</strong>. 
              Si vous avez reçu cet email par erreur, veuillez l&apos;ignorer.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#2563eb',
  padding: '32px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
};

const title = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px',
};

const greeting = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const documentList = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
};

const documentItem = {
  color: '#1f2937',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
  fontWeight: '500',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  cursor: 'pointer',
};

const linkText = {
  color: '#2563eb',
  fontSize: '14px',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f8fafc',
  padding: '8px',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  margin: '8px 0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const infoBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
};

const infoTitle = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 16px 0',
};

const disclaimer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};

export default DocumentRequestEmail;