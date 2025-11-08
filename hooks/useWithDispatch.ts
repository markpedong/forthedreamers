import { getSession, signOut as sessionSignOut } from "@/lib/server-actions";
import { setSessionData } from "@/redux/features/appSlice";
import { useAppDispatch } from "@/redux/store";

const useWithDispatch = () => {
  const dispatch = useAppDispatch()

  const updateSession = async () => {
    const session = await getSession();

    dispatch(setSessionData(session));
  }

  const signOut = async () => {
    await sessionSignOut();
    await dispatch(setSessionData(null));
  }

  return { updateSession, signOut };
}


export default useWithDispatch;