import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "./routes";

function App() {
  return (
    <main>
      <RouterProvider router={routes} />
      <Toaster richColors position="top-right" />
    </main>
  );
}

export default App;
