import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import {createBrowserRouter, createRoutesFromElements, redirect, Route, RouterProvider} from 'react-router-dom';
import {AppRoute} from './components/app/types.ts';
import Layout from './pages/layout/layout.tsx';
import MainPage from './pages/main/main.tsx';
import FavoritesPage from './pages/favorites/favorites.tsx';
import OfferPage from './pages/offer/offer.tsx';
import Error404 from './pages/error404/error404.tsx';
import LoginPage from './pages/login/login.tsx';
import {Provider} from 'react-redux';
import {store} from './store/store.ts';
import {apiSlice} from './store/reducers/api/api.ts';

export const selectIsAuth = (): boolean => {
  let isAuth = false;
  const userAuth = apiSlice.endpoints.getAuthStatus.select()(store.getState());
  const { data, isError } = userAuth;
  if (!isError && data) {
    isAuth = true;
  }
  return isAuth;
};

const loader = (page: AppRoute): Response | null => {
  const isAuth = selectIsAuth();
  if (!isAuth && page === AppRoute.Favorites) {
    return redirect(AppRoute.Login);
  }
  return null;
};

const router =
  createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App/>}>
        <Route path={AppRoute.Index} element={<Layout isMainPage/>}>
          <Route index element={<MainPage/>}></Route>
        </Route>
        <Route path={AppRoute.Index} element={<Layout/>}>
          <Route path={AppRoute.Favorites} loader={() => loader(AppRoute.Favorites)} element={<FavoritesPage/>}>
          </Route>
          <Route path={AppRoute.Offers} element={<OfferPage/>}></Route>
          <Route path={AppRoute.Unknown} element={<Error404/>}></Route>
        </Route>
        <Route path={AppRoute.Index} element={<Layout isLoginPage/>}>
          <Route path={AppRoute.Login} loader={() => loader(AppRoute.Login)} element={<LoginPage/>}>
          </Route>
        </Route>
      </Route>
    )
  );

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  </React.StrictMode>
);
