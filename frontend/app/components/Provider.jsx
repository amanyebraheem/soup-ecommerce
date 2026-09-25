 "use client";

import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";

import { store } from "../redux/store";
import { loadUser } from "../redux/slices/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}