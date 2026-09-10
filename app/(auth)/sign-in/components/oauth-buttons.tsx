import { GoogleIcon, FacebookIcon } from '@/components/icons/oauth';
import { Button } from '@/components/ui/button';
import { useSocialSignInMutation } from '@/services/useMutation';

type OauthButtonsProps = { next: '/profile' | '/dashboard' };

const OauthButtons = ({ next }: OauthButtonsProps) => {
  const mutation = useSocialSignInMutation(next);
  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full rounded-xl bg-background font-medium shadow-xs"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <GoogleIcon />
      <span>{mutation.isPending ? 'Opening Google...' : 'Sign in with Google'}</span>
    </Button>
  );
};

const FacebookButton = () => (
  <Button
    type="button"
    variant="outline"
    className="h-12 w-full rounded-xl bg-background font-medium shadow-xs"
  >
    <FacebookIcon />
    <span>Sign in with Facebook</span>
  </Button>
);

export { OauthButtons, FacebookButton };
export default OauthButtons;
