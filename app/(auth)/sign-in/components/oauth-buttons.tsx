import { GoogleIcon } from '@/components/icons/oauth';
import { Button } from '@/components/ui/button';
import { socialSignIn } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type OauthButtonsProps = { next: '/profile' | '/dashboard' };

const OauthButtons = ({ next }: OauthButtonsProps) => {
  const mutation = useMutation({
    mutationFn: () => socialSignIn('google', next),
    onSuccess: result => {
      if (result.data?.url) window.location.assign(result.data.url);
    },
    onError: error => toast.error(error.message),
  });
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
