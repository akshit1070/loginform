import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";


const Home = () => {
  const wallet = useWallet();

  const [userId, setUserId] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);
    console.log(parsedUserData);
    const userIdFromLocal = get(parsedUserData, "value.data.username", "");
    setUserId(get(parsedUserData, "value.data.username", ""));
    setEmailVerified(
      get(parsedUserData, "value.data.mailVerificationRequired", false)
    );
  }, []);

  const handleClick = async ()=>{
     localStorage.removeItem('userData');
     localStorage.setItem("againLogin","qw");
     wallet.disconnect();

     navigate("/");


  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      <span>{`Welcome ${userId}!`}</span>
      <span
        style={{ position: "absolute", top: "10px", right: "30px" }}
      >{`Email is ${!emailVerified ? "Verified" : "Unverified"}`}</span>
      <button onClick={handleClick}  >LOGOUT</button>
    </div>
  );
};

export default Home;
