import { getSession, revalidatePath, signOut as sessionSignOut } from "@/lib/server-actions";
import { setSessionData } from "@/redux/features/appSlice";
import { useAppDispatch } from "@/redux/store";
import { deleteAllCookies } from "@/utils/cookies";
import { usePathname } from "next/navigation";

const useWithDispatch = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname();

  const updateSession = async () => {
    const session = await getSession();

    dispatch(setSessionData(session));
  }

  const signOut = async () => {
    dispatch(setSessionData(null));

    // Call Supabase signOut first and await it before clearing local storage
    try {
      await sessionSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }

    // Clear local storage after Supabase session is invalidated
    localStorage.clear();
    sessionStorage.clear();

    await deleteAllCookies();
    await revalidatePath(pathname);
  }

  return { updateSession, signOut };
}


export default useWithDispatch;