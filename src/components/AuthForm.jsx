import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";

const AuthFormTemplateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignInForm = styled.form`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: tomato;
`;

const FormInput = styled.input`
  height: 40px;
  border-radius: 40px;
  border: none;
  outline: none;
  padding-left: 10px;
  margin-bottom: 10px;
`;

const FormSubmit = styled.input`
  height: 40px;
  border-radius: 40px;
  border: none;
  outline: none;
  padding-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #1d9bf0;
  color: white;

  &:hover {
    opacity: 0.9;
    transition: 0.3s;
  }
`;

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  let data = "";
  const auth = getAuth();
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        //create account
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        //log in
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
      console.log(data);
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("Unvalid Email :( Try Again");
      } else {
        setError(error.message);
      }
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  return (
    <AuthFormTemplateBlock>
      <SignInForm onSubmit={onSubmit}>
        <FormInput
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <FormSubmit
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
      </SignInForm>
      <div style={{ color: "tomato" }}>{error}</div>
      <div
        onClick={toggleAccount}
        style={{ marginBottom: "10px", color: "#1d9bf0", cursor: "pointer" }}
      >
        {newAccount ? "Sign In" : "Create Account"}
      </div>
    </AuthFormTemplateBlock>
  );
};

export default AuthForm;
