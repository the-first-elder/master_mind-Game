import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Game from "./pages/Game";

function NoMatch() {
  return (
    <div className=" flex flex-col items-center justify-center text-4xl min-h-screen">
      <h2>404: Page Not Found</h2>
      <p>Uh oh! Wrong page 😞</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "*",
    element: <NoMatch />,
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/game",
    element: <Game />,
  }
  // {
  //   path: "/about",
  //   element: <><Header /><About /></>,
  // },
]);

const App = () => {
  return (
    <div className="bg-[#333862] px-10 py-5">
      <Header/ >
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
};

export default App;
