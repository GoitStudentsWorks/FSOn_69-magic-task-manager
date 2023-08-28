import { useDispatch } from 'react-redux';
import { useEffect, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './layout/Layout';
import { PrivateRoute } from 'helpers/PrivateRoute';
import { RestrictedRoute } from 'helpers/RestrictedRoute';
import { getCurrentUser } from 'redux/auth/auth-operation';
import Loader from './loader/Loader';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = lazy(() => import('../pages/home/Home'));
const Welcome = lazy(() => import('../pages/welcome/Welcome'));
const Auth = lazy(() => import('../pages/auth/Auth'));
const LoginForm = lazy(() => import('./LoginForm/LoginForm'));
const ScreensPage = lazy(() => import('./ScreensPage/ScreensPage'));
const NotFound = lazy(() => import('../pages/notFound/NotFound'));

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        loader: Loader,
        children: [
          {
            path: '/',
            element: (
              <PrivateRoute redirectTo="/welcome" component={<HomePage />} />
            ),
            loader: Loader,
            children: [
              {
                path: '/:boardName',
                element: <ScreensPage />,
                loader: Loader,
              },
            ],
          },
          {
            path: '/welcome',
            element: <RestrictedRoute redirectTo="/" component={<Welcome />} />,
            loader: Loader,
          },
          {
            path: '/auth',
            element: <RestrictedRoute redirectTo="/" component={<Auth />} />,
            loader: Loader,
            children: [
              {
                path: '/auth/:id',
                element: (
                  <RestrictedRoute redirectTo="/" component={<LoginForm />} />
                ),
                loader: Loader,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
        loader: Loader,
      },
    ],
    {
      basename: '/FSOn_69-magic-task-manager/',
    }
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer hideProgressBar />
    </>
  );
};
