import { getCurrentUserData } from '@/lib/services/auth';
import UserHydrator from './user-hydrator';

const AuthHydration = async () => <UserHydrator user={await getCurrentUserData()} />;

export default AuthHydration;
