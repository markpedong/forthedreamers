import type { FC, PropsWithChildren } from 'react';
import AuthPage from '../../components/auth-page';

const SellerPageWrapper: FC<PropsWithChildren> = ({ children }) => (
  <AuthPage>{children}</AuthPage>
);

export default SellerPageWrapper;
