import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/Welcome";
import { SignIn } from "./pages/SignIn";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Transactions } from "./pages/Transactions";
import { AddTransaction } from "./pages/AddTransaction";
import { Analytics } from "./pages/Analytics";
import { Budget } from "./pages/Budget";
import { Categories } from "./pages/Categories";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "transactions", Component: Transactions },
      { path: "add", Component: AddTransaction },
      { path: "analytics", Component: Analytics },
      { path: "budget", Component: Budget },
      { path: "categories", Component: Categories },
      { path: "profile", Component: Profile },
    ],
  },
]);
