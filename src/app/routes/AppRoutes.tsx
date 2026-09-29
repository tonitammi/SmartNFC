import { Routes, Route } from 'react-router';
import { MainPage } from '../pages/main/MainPage.tsx';
import { RequireAuthWrapper } from '@src/features/auth/components/RequireAuthWrapper.tsx';
import { DashboardPage } from '../pages/dashboard/DashboardPage.tsx';
import { LoginPage } from '../pages/auth/LoginPage.tsx';
import { TermsPage } from '../pages/app/legal/TermsPage.tsx';
import { SignUpPage } from '../pages/auth/SignUpPage.tsx';
import { DashboardLayout } from '@/src/layouts/DashboardLayout.tsx';
import { UsersPage } from '../pages/dashboard/organization-users/UsersPage.tsx';
import { OrganizationsPage } from '../pages/dashboard/OrganizationsPage.tsx';
import { OrganizationSyncLayout } from '@src/layouts/OrganizationSyncLayout.tsx';
import { CreateTagPage } from '../pages/dashboard/tags/CreateTagPage.tsx';
import { TagsPage } from '../pages/dashboard/tags/TagsPage.tsx';
import { CreateContentPage } from '../pages/dashboard/content/CreateContentPage.tsx';
import { ContentPage } from '../pages/dashboard/content/ContentPage.tsx';
import { TagPage } from '../pages/dashboard/tags/TagPage.tsx';
import { TagContentPage } from '../pages/app/content/TagContentPage.tsx';
import { EditContentPage } from '../pages/dashboard/content/EditContentPage.tsx';
import { ContentEntriesPage } from '../pages/dashboard/content/ContentEntriesPage.tsx';
import { EditTagPage } from '../pages/dashboard/tags/EditTagPage.tsx';
import { NotFoundPage } from '../pages/error/NotFoundPage.tsx';
import { UnauthorizedPage } from '../pages/error/UnauthorizedPage.tsx';
import { NFCToolsPage } from '../pages/dashboard/nfc/NFCToolsPage.tsx';
import { InviteUsersPage } from '../pages/dashboard/organization-users/InviteUsersPage.tsx';
import { InvitationsPage } from '../pages/dashboard/organization-users/InvitationsPage.tsx';
import { PrivacyPage } from '../pages/app/legal/PrivacyPage.tsx';
import { NotImplementedPage } from '../pages/NotImplementedPage.tsx';
import { UserSettingsPage } from '../pages/settings/UserSettingsPage.tsx';
import { AppLayout } from '@/src/layouts/AppLayout.tsx';
import { MediaBrowserPage } from '../pages/dashboard/media/MediaBrowserPage.tsx';
import { ChangeLogPage } from '../pages/app/changes/ChangeLogPage.tsx';
import { MyInvitationsPage } from '../pages/invitations/MyInvitationsPage.tsx';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route index path="/" element={<MainPage />} />
        
        {/* AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/changelog/:version?" element={<ChangeLogPage />} />

          <Route path="/not-implemented" element={<NotImplementedPage />} />

          {/* Errors */}
          <Route path="/error">
            <Route path="not-found" element={<NotFoundPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* App (Optional auth) */}
          <Route path="/app">
            <Route path="content">
              <Route path=":tagId" element={<TagContentPage />} />
            </Route>
            <Route path="not-implemented" element={<NotImplementedPage />} />
          </Route>
        </Route>

          
        {/* Authenticated routes */}

        {/* DashboardLayout */}
        <Route element={<RequireAuthWrapper requireRole={{ acceptedRoles: 'user' }} />}>  
          {/* <Route  */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard">
              <Route index element={<OrganizationsPage />} />

              {/* Require auth / no organization) */}
              <Route path="settings">
                <Route path="user" element={<UserSettingsPage />} />
              </Route>

              <Route path="my-invitations" element={<MyInvitationsPage />} />

              <Route path="not-implemented" element={<NotImplementedPage />} />

              {/* Organization pages (current organization guaranteed) */}
              <Route path=":orgId" element={<OrganizationSyncLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="not-implemented" element={<NotImplementedPage />} />

                <Route path="tags">
                  <Route index element={<TagsPage />} />
                  <Route path="create/:mode?" element={<CreateTagPage />} />
                  <Route path="edit/:tagId" element={<EditTagPage />} />
                  <Route path=":tagId" element={<TagPage />} />
                </Route>

                <Route path="content">
                  <Route index element={<ContentEntriesPage />} />
                  <Route path="create/" element={<CreateContentPage />} />
                  <Route path="edit/:contentId" element={<EditContentPage />} />
                  <Route path=":contentId" element={<ContentPage />} />
                </Route>

                <Route path="nfc">
                  <Route index element={<NFCToolsPage />} />
                </Route>
                
                <Route path="users">
                  <Route index element={<UsersPage />} />
                  <Route path="invitations" element={<InvitationsPage />} />
                  <Route path="invite" element={<InviteUsersPage />} />
                </Route>

                <Route path="media">
                  <Route index element={<MediaBrowserPage />} />
                </Route>
                
                <Route path="not-implemented" element={<NotImplementedPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Not found */}
        <Route path="*" element={<NotFoundPage/>} />
      </Route>
    </Routes>
  );
};