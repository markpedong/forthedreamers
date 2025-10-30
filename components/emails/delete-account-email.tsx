import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Tailwind,
} from '@react-email/components';

const DeleteAccountEmail = ({ userName, url }: { userName: string; url: string }) => {
  return (
    <Html lang='en' dir='ltr'>
      <Tailwind>
        <Head />
        <Body className='bg-gray-100 font-sans py-[40px]'>
          <Container className='bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]'>
            {/* Header */}
            <Section className='text-center mb-[32px]'>
              <Heading className='text-[28px] font-bold text-red-600 m-0 mb-[8px]'>
                Confirm Account Deletion
              </Heading>
              <Text className='text-[16px] text-gray-600 m-0'>
                We need to verify this important action
              </Text>
            </Section>

            {/* Main Content */}
            <Section className='mb-[32px]'>
              <Text className='text-[16px] text-gray-800 mb-[16px] m-0'>Hello {userName},</Text>

              <Text className='text-[16px] text-gray-700 mb-[16px] m-0 leading-[24px]'>
                We received a request to delete your account. This is a permanent action that cannot
                be undone.
              </Text>

              {/* Warning Box */}
              <Section className='bg-red-50 border border-red-200 rounded-[8px] p-[24px] mb-[24px]'>
                <Text className='text-[16px] text-red-800 font-semibold mb-[12px] m-0'>
                  ⚠️ Important Warning
                </Text>
                <Text className='text-[14px] text-red-700 mb-[0px] m-0 leading-[20px]'>
                  Deleting your account will permanently remove:
                </Text>
                <Text className='text-[14px] text-red-700 mt-[8px] mb-[0px] m-0 leading-[20px]'>
                  • All your personal data and preferences
                  <br />
                  • Your account history and settings
                  <br />
                  • Any saved content or information
                  <br />• Access to all associated services
                </Text>
              </Section>

              <Text className='text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]'>
                If you're sure you want to proceed with deleting your account, please click the
                button below to confirm. If you didn't request this deletion, you can safely ignore
                this email.
              </Text>

              {/* Action Buttons */}
              <Section className='text-center mb-[24px]'>
                <Button
                  href={url}
                  className='bg-red-600 text-white px-[32px] py-[14px] rounded-[6px] text-[16px] font-medium no-underline box-border mb-[12px] mr-[12px]'
                >
                  Yes, Delete My Account
                </Button>
              </Section>

              <Text className='text-[14px] text-gray-600 mb-[16px] m-0 leading-[20px] text-center'>
                This confirmation link will expire in 24 hours for your security.
              </Text>

              <Text className='text-[14px] text-gray-600 mb-[16px] m-0 leading-[20px]'>
                If you're having issues with your account or considering deletion for other reasons,
                our support team is here to help. Sometimes we can resolve problems without needing
                to delete your account.
              </Text>
            </Section>

            <Hr className='border-gray-200 my-[32px]' />

            {/* Footer */}
            <Section className='text-center'>
              <Text className='text-[12px] text-gray-500 mb-[8px] m-0'>
                Need help? Contact our support team anytime.
              </Text>
              <Text className='text-[12px] text-gray-400 mb-[16px] m-0'>
                123 Business Street, Suite 100
                <br />
                Business City, BC 12345
              </Text>
              <Text className='text-[12px] text-gray-400 m-0'>
                © {new Date().getFullYear()} Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DeleteAccountEmail;
