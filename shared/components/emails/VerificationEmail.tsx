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
import * as React from 'react';

interface VerificationEmailProps {
  firstName: string;
  verificationUrl: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  firstName,
  verificationUrl,
}) => (
  <Html>
    <Head />
    <Preview>Verify your email address for Document Transfer App</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={h1}>Document Transfer App</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h2}>Welcome, {firstName}!</Heading>
          <Text style={text}>
            Thank you for creating an account with Document Transfer App. To complete your registration and start using our secure document sharing platform, please verify your email address.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
        </Section>

        <Section style={linkSection}>
          <Text style={smallText}>
            If the button above doesn't work, you can copy and paste this link into your browser:
          </Text>
          <Link style={link} href={verificationUrl}>
            {verificationUrl}
          </Link>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
          </Text>
          <Text style={footerText}>
            Best regards,<br />
            The Document Transfer App Team
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
  backgroundColor: '#2563eb',
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
  backgroundColor: '#2563eb',
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
  color: '#2563eb',
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