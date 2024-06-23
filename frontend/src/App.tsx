import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Game from "./pages/Game";

function NoMatch() {
  return (
    <div className=" flex flex-col items-center justify-center mt-24 text-4xl">
      <h2>404: Page Not Found</h2>
      <p>Uh oh! Wrong page 😞</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "*",
    element: <><Header /><NoMatch /></>,
  },
  {
    path: "/",
    element: <><Header /><Homepage /></>,
  },
  {
    path: "/game",
    element: <><Header /><Game /></>,
  }
  // {
  //   path: "/about",
  //   element: <><Header /><About /></>,
  // },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
};

export default App;
