import React, { useEffect, useState } from "react";
import IndexRouter from "components/Router";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { authService } from "fBase";

const App = () => {
  //state
  // app이 초기화 되기 전
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // auth가 setUserObj에 바꾸면, user넣기
        // 로그인 한 user를 받을 수 있음.
        // userObj를 Router를 통해 전달
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
        setUserObj("");
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    const user = authService.currentUser;
    //user를 새로고침
    setUserObj({ ...user });
  };

  return (
    <div>
      {init ? (
        <IndexRouter
          userObj={userObj}
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        "Initializing..."
      )}
    </div>
  );
};

export default App;
