import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
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
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <input
          type="submit"
          value={newAccount ? "CREATE ACOOUNT" : "SIGN IN"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "SIGN IN" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
