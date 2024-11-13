import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Datas,
  History,
  Profile
} from "./scenes";
import NewTab from "./scenes/new";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/datas" element={<Datas />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new" element={<NewTab />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
