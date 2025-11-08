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
    localStorage.clear()
    sessionStorage.clear()

    await sessionSignOut();
    await deleteAllCookies();
    await revalidatePath(pathname);

  }

  return { updateSession, signOut };
}


export default useWithDispatch;