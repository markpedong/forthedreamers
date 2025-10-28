import { AppleIcon, FacebookIcon, GoogleIcon, TikTokIcon } from '@/components/icons/oauth';
import { Button } from '@/components/ui/button';
import { signInSocial } from '@/lib/server-actions';

type Props = {};

const OauthButtons = (props: Props) => {
  const buttons = [
    { icon: GoogleIcon, text: 'Google', onClick: () => signInSocial('google') },
    { icon: AppleIcon, text: 'Apple' },
    { icon: FacebookIcon, text: 'Facebook' },
    { icon: TikTokIcon, text: 'TikTok' },
  ];
  return (
    <>
      {buttons.map((item, i) => {
        const Icon = item.icon;

        return (
          <Button key={i} variant='outline' className='h-11 cursor-pointer' onClick={item.onClick}>
            <Icon />
            <span className='ml-2'>{item.text}</span>
          </Button>
        );
      })}
    </>
  );
};

export default OauthButtons;
