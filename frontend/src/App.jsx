import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/form.component";
import ViewPaste from "./components/paste.component";
import NotFound from "./components/404.component";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/p/:id" element={<ViewPaste />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

