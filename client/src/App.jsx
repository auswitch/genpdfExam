import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import CMUOAuthCallback from "./cmuOAuthCallback";
import UserInfoContext  from "./userInfo";

function App() {
    const [userInfo, setUserInfo] = useState(null);
  return (
    <UserInfoContext.Provider
      value={{
        userInfo: { ...userInfo },
        setUserInfo: setUserInfo,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cmuOAuthCallback" element={<CMUOAuthCallback />} />
        </Routes>
      </Router>
    </UserInfoContext.Provider>
  );
}

export default App;
