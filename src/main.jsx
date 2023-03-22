import React from "react";
import ReactDOM from "react-dom/client";
import App from "components/App";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
console.log(firebase);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
