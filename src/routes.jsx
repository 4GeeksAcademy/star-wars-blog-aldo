// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: toda la navegación arranca aquí.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      {/* Ruta dinámica: categoria (people | vehicles | planets) + id */}
      <Route path="/single/:category/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
    </Route>
  )
);