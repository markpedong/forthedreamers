import { FacebookIcon, GoogleIcon } from '@/components/icons/oauth';
import { Button } from '@/components/reusable/button';
import { useSocialSignInMutation } from '@/services/useMutation';

type OauthButtonsProps = { next: '/profile' | '/dashboard' };

const OauthButtons = ({ next }: OauthButtonsProps) => {
  const mutation = useSocialSignInMutation(next);
  const provider = mutation.isPending ? mutation.variables : null;

  return (
    <div className="space-y-3">
      {[
        { id: 'google' as const, label: 'Sign in with Google', icon: <GoogleIcon /> },
        { id: 'facebook' as const, label: 'Sign in with Facebook', icon: <FacebookIcon /> },
      ].map(option => (
        <Button
          key={option.id}
          type="button"
          variant="outline"
          className="h-12 w-full justify-center rounded-xl bg-background font-medium shadow-xs"
          loading={provider === option.id}
          icon={option.icon}
          title={option.label}
          disabled={mutation.isPending || option.id === 'facebook'}
          onClick={() => mutation.mutate(option.id)}
        />
      ))}
    </div>
  );
};

export default OauthButtons;
