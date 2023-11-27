import { Container } from "react-bootstrap";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Toaster />
      <main style={{ width: "90vw", margin: "0 auto" }}>
        <div style={{ width: "100%" }}>
          <Outlet />
        </div>
      </main>
    </>
  );
};
export default App;
