import { redirect } from 'next/navigation';

const AnalyticsPage = () => {
  redirect('/dashboard?range=12m');
};

export default AnalyticsPage;
