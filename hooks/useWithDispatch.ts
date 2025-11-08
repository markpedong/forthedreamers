import { getSession } from "@/lib/server-actions";
import { setSessionData } from "@/redux/features/appSlice";
import { useAppDispatch } from "@/redux/store";

const useWithDispatch = () => {
  const dispatch = useAppDispatch()

  const updateSession = async () => {
    const session = await getSession();

    dispatch(setSessionData(session));
  }

  return { updateSession };
}


export default useWithDispatch;