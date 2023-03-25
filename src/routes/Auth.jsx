import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import styled from "styled-components";

const AuthTemplateBlock = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled.div`
  width: 330px;
`;

const SocialBtnBlock = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
`;

const SocialBtn = styled.button`
  height: 40px;
  border-radius: 20px;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin-bottom: 10px;
`;

const SocialImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
const Auth = () => {
  const auth = getAuth();

  const onSocialClick = async (e) => {
    let provider = "";
    const {
      target: { name },
    } = e;
    // SignIn using a popup
    if (name === "google") {
      provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else if (name === "github") {
      provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    }
  };
  return (
    <AuthTemplateBlock>
      <img src="image/twitter.png" height="40px" width="40px" />
      <LoginForm>
        <AuthForm />
        <SocialBtnBlock>
          <SocialBtn onClick={onSocialClick} name="google">
            <SocialImage src="image/google.png" />
            Continue with Google
          </SocialBtn>
          <SocialBtn onClick={onSocialClick} name="github">
            <SocialImage src="image/github.png" />
            Continue with Github
          </SocialBtn>
        </SocialBtnBlock>
      </LoginForm>
    </AuthTemplateBlock>
  );
};

export default Auth;
