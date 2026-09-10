import { FacebookIcon, GoogleIcon } from '@/components/icons/oauth';
import { Button } from '@/components/ui/button';
import { useSocialSignInMutation } from '@/services/useMutation';

type OauthButtonsProps = { next: '/profile' | '/dashboard' };

const OauthButtons = ({ next }: OauthButtonsProps) => {
  const mutation = useSocialSignInMutation(next);
  const provider = mutation.isPending ? mutation.variables : null;

  return (
    <>
      {[
        { id: 'google' as const, label: 'Sign in with Google', icon: <GoogleIcon /> },
        { id: 'facebook' as const, label: 'Sign in with Facebook', icon: <FacebookIcon /> },
      ].map(option => (
        <Button
          key={option.id}
          type="button"
          variant="outline"
          className="h-12 w-full justify-center rounded-xl bg-background font-medium shadow-xs"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(option.id)}
        >
          {option.icon}
          <span>{provider === option.id ? `Opening ${option.id}...` : option.label}</span>
        </Button>
      ))}
    </>
  );
};

export default OauthButtons;
