import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

type Props = { user?: string; url?: string; newEmail?: string };

const ChangeEmailMail = ({ newEmail, url, user }: Props) => {
  return (
    <Html lang='en' dir='ltr'>
      <Head />
      <Preview>Confirm your email address change</Preview>
      <Tailwind>
        <Body className='bg-gray-100 font-sans py-[40px]'>
          <Container className='bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto'>
            {/* Header */}
            <Section>
              <Heading className='text-[24px] font-bold text-gray-900 mb-[24px] text-center'>
                Confirm Email Change
              </Heading>
            </Section>

            {/* Main Content */}
            <Section>
              <Text className='text-[16px] text-gray-700 mb-[16px] leading-[24px]'>Hi {user},</Text>
              <Text className='text-[16px] text-gray-700 mb-[16px] leading-[24px]'>
                We received a request to change your email address to:
              </Text>
              <Text className='text-[16px] font-medium text-gray-900 mb-[24px] leading-[24px]'>
                {newEmail}
              </Text>
              <Text className='text-[16px] text-gray-700 mb-[24px] leading-[24px]'>
                To complete this change, please click the button below to confirm your new email
                address.
              </Text>

              {/* Confirm Button */}
              <Section className='text-center mb-[32px]'>
                <Button
                  href={url}
                  className='bg-green-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border'
                >
                  Confirm Email Change
                </Button>
              </Section>

              <Text className='text-[14px] text-gray-600 mb-[16px] leading-[20px]'>
                This link will expire in 24 hours for security reasons.
              </Text>
              <Text className='text-[14px] text-gray-600 mb-[24px] leading-[20px]'>
                If you didn't request this email change, please ignore this email or contact our
                support team immediately.
              </Text>
            </Section>

            {/* Footer */}
            <Section className='border-t border-gray-200 pt-[24px]'>
              <Text className='text-[12px] text-gray-500 text-center m-0'>
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className='text-[12px] text-gray-500 text-center m-0'>
                123 Business Street, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ChangeEmailMail;
