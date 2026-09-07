import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setWishlistIds } from '@/redux/reducers/wishlistData';
import { toggleWishlist } from '@/redux/reducers/wishlistData';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((state) => state.wishlistData.ids);
  const pendingIds = useAppSelector((state) => state.wishlistData.ids);

  return {
    ids,
    pending: pendingIds.length > 0,
    isPending: (id: string) => pendingIds.includes(id),
    toggle: (id: string) => {
      const wanted = !ids.includes(id);
      dispatch(toggleWishlist(id));
    },
    setIds: (ids: string[]) => {
      dispatch(setWishlistIds(ids));
    },
  };
};
