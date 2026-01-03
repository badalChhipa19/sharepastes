import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./form.component";
import ViewPaste from "./paste.component";
import NotFound from "./404.component";

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

