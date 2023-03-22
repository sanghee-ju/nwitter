import React, { useEffect, useState } from "react";
import IndexRouter from "components/Router";
import firebase from "firebase/compat/app";
import { authService } from "fBase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  //state
  // app이 초기화 되기 전
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <div>
      {init ? <IndexRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </div>
  );
};

export default App;
