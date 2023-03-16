import React from "react";
import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../../context/context";
import { privateRoutes, publicRoutes } from "../../router/router";

const AppRouter = () => {
  const { isAuth }: any = useContext(AuthContext);

  return isAuth ? (
    <Routes>
      {privateRoutes.map((route) => (
        <Route element={route.element} path={route.path} key={route.path} />
      ))}
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map((route) => (
        <Route element={route.element} path={route.path} key={route.path} />
      ))}
    </Routes>
  );
};

export default AppRouter;
