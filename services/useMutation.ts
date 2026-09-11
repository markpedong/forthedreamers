'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  addCartItem,
  addCategory,
  changePassword,
  checkoutCart,
  createAddress,
  createProduct,
  createReview,
  createSupportTicket,
  deleteAddress,
  deleteProduct,
  deleteUser,
  linkSocial,
  removeCartItem,
  resendVerification,
  resetPassword,
  sellerSignUp,
  sendSupportMessage,
  sendForgotPassword,
  setDefaultAddress,
  setUserBanned,
  setWishlist,
  signIn,
  signOut,
  signUp,
  socialSignIn,
  toggleProductStatus,
  updateAddress,
  updateCartQuantity,
  updateProduct,
  updateProfile,
  updateSellerShipping,
  uploadProductImages,
} from '@/lib/http';
import type { ProductFormData, TProduct } from '@/lib/types';
import { clearUserData, setUserData } from '@/redux/reducers/userData';
import { setCurrentProfileTab } from '@/redux/reducers/appData';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { cartCountQueryKey, ordersQueryKey, productReviewsQueryKey, wishlistQueryKey } from './useQuery';
import { supportTicketsQueryKey, wishlistItemsQueryKey } from './useQuery';
import type { SupportTicketResult } from '@/lib/http';

export const useSignInMutation = (portal: 'customer' | 'dashboard') => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) => signIn({ ...input, portal }),
    onSuccess: result => {
      dispatch(setUserData(result.data!));
      toast.success(portal === 'dashboard' ? 'Logged in successfully!' : 'Sign in successfully!', {
        duration: portal === 'dashboard' ? 3000 : 2000,
      });
      router.replace(portal === 'dashboard' ? '/dashboard' : '/profile');
    },
    onError: error => toast.error(error.message, { duration: 5000 }),
  });
};

export const useSignOutMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries();
      dispatch(clearUserData());
      router.replace('/sign-in');
    },
    onError: error => toast.error(error.message || 'Unable to sign out. Please try again.'),
  });
};

export const useSignUpMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (_result, input) => {
      toast.success('Account created successfully!', { duration: 3000 });
      sessionStorage.setItem('pending-verification-email', input.email);
      // The persisted tab outlives the session; a fresh signup should land on personal info.
      dispatch(setCurrentProfileTab('profile'));
      router.replace('/profile');
      // The profile page is a Server Component; without this the router serves the render it
      // cached before the signup cookie existed, so the page shows signed-out until a manual reload.
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useSellerSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: sellerSignUp,
    onSuccess: result => {
      toast.success(result.message);
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useUpdateSellerShippingMutation = () =>
  useMutation({
    mutationFn: updateSellerShipping,
    onSuccess: result => toast.success(result.message),
    onError: error => toast.error(error.message),
  });

export const useSocialSignInMutation = (next: '/profile' | '/dashboard') =>
  useMutation({
    mutationFn: (provider: 'google' | 'facebook') => socialSignIn(provider, next),
    onSuccess: result => {
      if (result.data?.url) window.location.assign(result.data.url);
    },
    onError: error => toast.error(error.message),
  });

export const useForgotPasswordMutation = ({
  redirectTo,
  onSuccess,
  successMessage = 'Reset link sent successfully!',
  duration,
}: {
  redirectTo?: string;
  onSuccess?: () => void;
  successMessage?: string;
  duration?: number;
} = {}) =>
  useMutation({
    mutationFn: (email: string) => sendForgotPassword(email, redirectTo),
    onSuccess: () => {
      toast.success(successMessage, { duration });
      onSuccess?.();
    },
    onError: error => toast.error(error.message),
  });

export const useResetPasswordMutation = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (password: string) => resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successfully!', { duration: 3000 });
      router.push('/sign-in');
    },
    onError: error => toast.error(error.message),
  });
};

export const useResendVerificationMutation = ({
  message,
  description,
  duration,
}: {
  message: string;
  description?: string;
  duration?: number;
}) =>
  useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast.success(message, { description, duration }),
    onError: error => toast.error(error.message, { duration }),
  });

export const useChangePasswordMutation = (onSuccess: () => void) =>
  useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      onSuccess();
    },
    onError: error => toast.error(error.message),
  });

export const useLinkSocialMutation = () =>
  useMutation({
    mutationFn: (provider: string) => linkSocial(provider, '/profile?accountLinked=true&tab=security'),
    onSuccess: result => {
      if (result.data?.url) window.location.assign(result.data.url);
    },
    onError: error => toast.error(error.message),
  });

export const useUpdateProfileMutation = ({
  successMessage,
  description,
  onSuccess,
  onError,
}: {
  successMessage: string;
  description?: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: result => {
      if (result.data?.user) dispatch(setUserData(result.data.user));
      toast.success(successMessage, { description });
      onSuccess?.();
    },
    onError: error => {
      onError?.();
      toast.error(error.message);
    },
  });
};

export type AddressMutationInput = {
  operation: 'create' | 'update' | 'delete' | 'default';
  input: unknown;
};

export const useAddressMutation = (onSaved: (operation: AddressMutationInput['operation']) => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ operation, input }: AddressMutationInput) => {
      if (operation === 'create') return createAddress(input);
      if (operation === 'update') return updateAddress(input);
      if (operation === 'delete') return deleteAddress(input as string);
      return setDefaultAddress(input as string);
    },
    onSuccess: (_result, { operation }) => {
      toast.success(
        operation === 'create'
          ? 'Address added'
          : operation === 'update'
            ? 'Address updated'
            : operation === 'delete'
              ? 'Address deleted'
              : 'Default address updated'
      );
      onSaved(operation);
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useAddCategoryMutation = (onSuccess: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: result => {
      toast.success(result.message);
      onSuccess();
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useDeleteProductMutation = (onSuccess: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: result => {
      toast.success(result.message);
      onSuccess();
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useToggleProductStatusMutation = (rollback: (input: { id: string; active: boolean }) => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: toggleProductStatus,
    onError: (error, input) => {
      rollback(input);
      toast.error(error.message);
    },
    onSettled: () => router.refresh(),
  });
};

export const useSaveProductMutation = (onSuccess: (product: TProduct, type: 'CREATE' | 'EDIT') => void) => {
  return useMutation({
    mutationFn: ({ data, type }: { data: ProductFormData; type: 'CREATE' | 'EDIT' }) =>
      type === 'EDIT' ? updateProduct(data) : createProduct(data),
    onSuccess: (result, { type }) => {
      toast.success(result.message);
      onSuccess(result.data!, type);
    },
    onError: error => toast.error(error.message),
  });
};

export const useUploadProductImagesMutation = () =>
  useMutation({
    mutationFn: uploadProductImages,
    onError: error => toast.error(error.message),
  });

export const useSetUserBannedMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) => setUserBanned(userId, banned),
    onSuccess: (_result, { banned }) => {
      toast.success(`User has been ${banned ? 'banned' : 'unbanned'}`);
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useDeleteUserMutation = (onSuccess: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully!', { duration: 2000 });
      onSuccess();
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useUpdateCartMutation = () => useMutation({ mutationFn: updateCartQuantity });
export const useRemoveCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: result => {
      if (result.data) queryClient.setQueryData(cartCountQueryKey, result.data.count);
    },
  });
};

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAppSelector(state => state.userData.data);

  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number; buyNow: boolean }) =>
      addCartItem({ variantId, quantity }),
    onMutate: () => {
      if (!user) return;
      const previousCount = queryClient.getQueryData<number>(cartCountQueryKey);
      if (previousCount !== undefined) queryClient.setQueryData(cartCountQueryKey, previousCount + 1);
      return { previousCount };
    },
    onSuccess: (result, { buyNow }) => {
      if (result.data) queryClient.setQueryData(cartCountQueryKey, result.data.count);
      if (buyNow) router.push('/checkout');
    },
    onError: (error, _variables, context) => {
      if (context?.previousCount !== undefined) queryClient.setQueryData(cartCountQueryKey, context.previousCount);

      if (error.message === 'Please sign in first') {
        toast.error("You're not signed in. Sign in to add items to your cart.", {
          action: { label: 'Sign in', onClick: () => router.push('/sign-in') },
        });
        return;
      }

      toast.error(error.message);
    },
  });
};

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutCart,
    onSuccess: result => {
      void queryClient.invalidateQueries({ queryKey: cartCountQueryKey });
      if (result.data) window.location.assign(`/checkout/success?orderId=${result.data.orderGroupId}`);
    },
    onError: error => toast.error(error.message),
  });
};

export const useCreateReviewMutation = (slug: string, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: unknown) => createReview(slug, input),
    onSuccess: () => {
      onSuccess();
      toast.success('Review submitted');
      void queryClient.invalidateQueries({ queryKey: productReviewsQueryKey(slug) });
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
};

export const useWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, wanted }: { id: string; wanted: boolean }) => setWishlist(id, wanted),
    onMutate: async ({ id, wanted }) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });
      const previous = queryClient.getQueryData<string[]>(wishlistQueryKey);
      queryClient.setQueryData<string[]>(wishlistQueryKey, old => {
        if (wanted) return old ? [...old, id] : [id];
        return old ? old.filter(item => item !== id) : [];
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(wishlistQueryKey, context.previous);
      toast.error(_error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      void queryClient.invalidateQueries({ queryKey: wishlistItemsQueryKey });
    },
  });
};

export const useCreateSupportTicketMutation = (onSuccess: (ticket: SupportTicketResult) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportTicket,
    onSuccess: result => {
      toast.success(result.message ?? 'Support ticket created');
      void queryClient.invalidateQueries({ queryKey: supportTicketsQueryKey });
      onSuccess(result.data!);
    },
    onError: error => toast.error(error.message),
  });
};

export const useSupportMessageMutation = (ticketId: string, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => sendSupportMessage({ ticketId, message }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketsQueryKey });
      onSuccess();
    },
    onError: error => toast.error(error.message),
  });
};
