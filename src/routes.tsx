import { createHashRouter } from "react-router-dom";

import LoginPage from "./Pages/LoginPage";
import TodoPage from "./Pages/TodoPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import TodoList from "./components/TodoListSection";

export const routes = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/todo',
    element: <TodoPage />,
  },
]);
