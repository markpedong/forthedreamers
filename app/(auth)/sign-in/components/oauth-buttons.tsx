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
      className="h-11 w-full"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {' '}
      <GoogleIcon />{' '}
      <span className="ml-2"> {mutation.isPending ? 'Opening Google...' : 'Continue with Google'} </span>{' '}
    </Button>
  );
};
export default OauthButtons;
