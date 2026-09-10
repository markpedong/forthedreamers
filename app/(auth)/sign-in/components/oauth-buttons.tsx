import { GoogleIcon } from '@/components/icons/oauth';
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

export default OauthButtons;
