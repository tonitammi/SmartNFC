import { useAuthContext } from '../../auth/context/useAuthContext';
import { UserAgentInfo } from '@/src/components/utils/UserAgentInfo';

export const UserSettings = () => {
  const user = useAuthContext();

  console.log('user', user);

  return (
    <>
      <UserAgentInfo />
    </>
  );
};