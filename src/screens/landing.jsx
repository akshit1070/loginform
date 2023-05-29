import React, { useEffect, useState } from "react";
import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";
import axios from "../axios";
import { get } from "lodash";
import Modal from "react-modal";
import { FaBeer } from "react-icons/fa";
import validator from "validator";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "black",
    boxSizing: "border-box",
    width: "50vw",
    maxWidth: "500px",
  },
};

const Landing = () => {
  const wallet = useWallet();
  const [userName, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [addressStatus, setAddressStatus] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [userEmpty, setUserEmpty] = useState(true);
  const [emailEmpty, setEmailEmpty] = useState(true);
  const [addrEmpty, setaddrEmpty] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [publicAddress, setPublicAddress] = useState("");
  const [showSignupModal, setShowSignupModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let a=localStorage.getItem("againLogin");
   // console.log(a)

    if(a=="qw")
    {
     // console.log(a)
      localStorage.setItem("againLogin","ty");
      
    }
    else{
    if (!wallet.connected) {
      setAddressStatus("");
      return;
    }
    const addr = get(wallet, "account.address", "");
    setPublicAddress(addr);
    let options = {
      walletAddress: addr,
      socialType: "sui wallet",
    };

    axios
      .get("api/v1/identity/checkwalletexists", {
        params: {
          walletAddress: addr,
          socialType: options.socialType,
        },
      })
      .then(function (response) {
        setAddressStatus(response.data.value.code);
        if (response.data.value.code === "wallet_exists") {
          let options = {
            email: null,
            responseSocialloginDetails: [
              {
                loginType: 1,
                firstname: null,
                lastname: null,
                email: null,
                userName: null,
                profileImage: null,
                socialid: addr,
                socialType: "sui wallet",
              },
            ],
          };
          axios
            .post("api/v1/identity/sociallogin", options)
            .then(function (response) {
              //  console.log(response.data.value.code);
              setUserStatus(response.data.value.code);
              localStorage.setItem("userData", JSON.stringify(response.data));
              navigate("/home");
            })
            .catch(function (error) {
              console.log("sasa", error);
              //    alert ('error')
            });
          // setShowSignupModal(true);
        } else {
          setShowSignupModal(true);
          return;
        }
      })
      .catch(function (error) {
        console.error("sasa", error);
      });
    }
  }, [wallet.connected]);

  const checkUserNameExists = (evt) => {
    let user = evt.target.value;
    let options = {
      userName: user,
    };

    axios
      .post("api/v1/identity/checkuser", options)
      .then(function (response) {
        setUserStatus(response.data.value.code);
        if (response.data.value.code == "success") {
          setUserEmpty(false);
        } else {
          setUserEmpty(true);
        }
      })
      .catch(function (error) {
        console.error("sasa", error);
        //    alert ('error')
      });
  };

  const checkEmail = (evt) => {
    let email = evt.target.value;

    if (validator.isEmail(email)) {
      let options = {
        mail: email,
      };
      axios
        .post("api/v1/Identity/checkmail", options)
        .then(function (response) {
          setEmailStatus(response.data.value.code);
          if (response.data.value.code == "success") {
            setEmailEmpty(false);
          } else {
            setEmailEmpty(true);
          }
        })
        .catch(function (error) {
          console.error("sasa", error);
        });
    } else {
      setEmailStatus("Invalid Email");
    }
  };

  const handleSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();
    if (!emailEmpty && !userEmpty) {
      let options = {
        email: email,
        responseSocialloginDetails: [
          {
            loginType: 1,
            firstname: name,
            lastname: null,
            email: email,
            userName: userName,
            profileImage: null,
            socialid: publicAddress,
            socialType: "sui wallet",
          },
        ],
      };
      axios
        .post("api/v1/identity/sociallogin", options)
        .then(function (response) {
          console.log(response.data);
          localStorage.setItem("userData", JSON.stringify(response.data));
          setShowSignupModal(false);
          // window.location.href = "/home";
          navigate("/home");
          //  setuserstatus(response.data.value.code);
        })
        .catch(function (error) {
          console.log("sasa", error);
          setShowSignupModal(false);
        });
    } else {
      alert("wrong details");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Modal
        isOpen={showSignupModal}
        onRequestClose={() => {
          setShowSignupModal(false);
        }}
        style={customStyles}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              For New User
            </span>
            <span
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => {
                setShowSignupModal(false);
              }}
            >
              <FaBeer />
            </span>
          </div>
          <div>
            <input
              style={{
                display: "block",
                backgroundColor: "transparent",
                color: "black",
                outline: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                border: "2px solid rgba(0,0,0,0.5)",
                fontSize: "15px",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "30px",
              }}
              placeholder="Name"
              required={true}
              type={"text"}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {/* <span>{}</span> */}
          </div>
          <div>
            <input
              style={{
                display: "block",
                backgroundColor: "transparent",
                color: "black",
                outline: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                border: "2px solid rgba(0,0,0,0.5)",
                fontSize: "15px",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "20px",
              }}
              required={true}
              placeholder="Username"
              type={"text"}
              value={userName}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUserNameExists(e);
              }}
            />
            {userStatus && (
              <span
                style={
                  userStatus === "success"
                    ? { color: "green", padding: "5px" }
                    : { color: "red", padding: "5px" }
                }
              >
                {userStatus}
              </span>
            )}
          </div>
          <div>
            <input
              style={{
                display: "block",
                backgroundColor: "transparent",
                color: "black",
                outline: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                border: "2px solid rgba(0,0,0,0.5)",
                fontSize: "15px",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "20px",
              }}
              required={true}
              placeholder="Email"
              type={"email"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                checkEmail(e);
              }}
            />
            {emailStatus && (
              <span
                style={
                  emailStatus === "success"
                    ? { color: "green", padding: "5px" }
                    : { color: "red", padding: "5px" }
                }
              >
                {emailStatus}
              </span>
            )}
          </div>
          <button
            style={{
              marginTop: "30px",
              width: "100%",
              background: "green",
              color: "white",
            }}
            disabled={userEmpty}
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
      </Modal>
      <ConnectButton />
    </div>
  );
};

export default Landing;
