import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from '../auth/RequireAuth';
import { AppShell } from '../components/layout/AppShell';
import { ActivitiesPage } from '../features/activities/ActivitiesPage';
import { ActivityDetailsPage } from '../features/activities/ActivityDetailsPage';
import { NewActivityPage } from '../features/activities/NewActivityPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { AccessDeniedPage } from '../features/errors/AccessDeniedPage';
import { NotFoundPage } from '../features/errors/NotFoundPage';
import { ActivityInsightPage } from '../features/insights/ActivityInsightPage';
import { InsightsPage } from '../features/insights/InsightsPage';

export const router = createBrowserRouter([
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/activities', element: <ActivitiesPage /> },
      { path: '/activities/new', element: <NewActivityPage /> },
      { path: '/activities/:activityId', element: <ActivityDetailsPage /> },
      { path: '/activities/:activityId/insight', element: <ActivityInsightPage /> },
      { path: '/insights', element: <InsightsPage /> },
      { path: '/access-denied', element: <AccessDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
