import { config } from '@src/config/config';

export type GetInviteURLOptionalParams = {
  email?: string; 
  inviterEmail?: string;
  orgName?: string;
};

export const getInviteURL = (
  id: string, 
  params: GetInviteURLOptionalParams = {}
) => {
  const appUrl = config.app.url;
  let url = `${appUrl}?bypassAuthCheck=true&invitationId=${id}`;

  if (params.email) url += `&email=${params.email}`;
  if (params.inviterEmail) url += `&inviterEmail=${params.inviterEmail}`;
  if (params.orgName) url += `&orgName=${params.orgName}`;

  return url;
}; 