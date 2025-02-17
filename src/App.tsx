import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";

function App() {
  console.log("App component rendering");
  
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div style={{ minHeight: "100vh", background: "#1a1a1a", color: "white" }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
