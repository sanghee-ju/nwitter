import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";

const Auth = () => {
  const auth = getAuth();

  const onSocialClick = async (e) => {
    let provider = "";
    let result = "";
    const {
      target: { name },
    } = e;
    // SignIn using a popup
    if (name === "google") {
      provider = new GoogleAuthProvider();
      result = await signInWithPopup(auth, provider);
    } else if (name === "github") {
      provider = new GithubAuthProvider();
      result = await signInWithPopup(auth, provider);
    }
  };
  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
