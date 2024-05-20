import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
