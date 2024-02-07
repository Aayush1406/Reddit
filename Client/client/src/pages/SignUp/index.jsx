import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Text,
  Button,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";

import { ReactComponent as RedditIcon } from "./reddit.svg";

import splash from "./splash.jpg";
import { useAuth } from "../../providers/auth";
import OtpVerification from "./OtpVerification";
import { sendEmailOtp } from "../../services/otp";

const pageColumns = {
  display: "flex",
  alignItems: "center",
  overflowX: "hidden",
  minHeight: "100vh",
  overflowY: "hidden",
  background: "#fff",
};

const SignUp = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationKey, setVerificationKey] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (auth.session) {
      navigate("/");
    }
  }, [auth.session, navigate]);

  const handleChange = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const sendOtp = () => {
    setError("");

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(username)) {
      setError("Invalid email.");
      return;
    }

    setBtnLoading(true);

    console.log("---------------------------------------");
    console.log("Sending an OTP to email: " + username);

    sendEmailOtp(username)
      .then(({ data, status, error }) => {
        if (error) {
          setError("Failed verifying email: " + error);
        } else if (status === 200 && data?.verificationKey) {
          console.log("---------------------------------------");
          console.log("Verification key is received: " + data.verificationKey);

          setVerificationKey(data.verificationKey);
          setActiveStep(2);
        }
      })
      .catch(() => {
        setError("Something went wrong! Try again.");
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  return (
    <div style={pageColumns}>
      <div
        style={{
          width: "400px",
        }}
      >
        <img
          style={{
            height: "100vh",
            minHeight: "450px",
            backgroundRepeat: "no-repeat",
            width: "100%",
            backgroundSize: "cover",
          }}
          alt=""
          src={splash}
        />
      </div>
      <div style={{ ...pageColumns, width: "400px" }}>
        <div
          style={{
            padding: "24px",
            marginBottom: "10px",
            width: "100%",
            display: "block",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              padding: 7,
              display: "inline-block",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            <RedditIcon fontSize="large" style={{ color: "#fff" }} />
          </div>
          <FormControl isInvalid={!!error}>
            {activeStep === 1 && (
              <>
                <Text
                  sx={{
                    marginBottom: "18px",
                  }}
                  fontSize="2xl"
                >
                  Sign Up
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Input
                    name="username"
                    placeholder="Username (email)"
                    value={username}
                    variant="flushed"
                    id="username-input"
                    onChange={handleChange}
                    sx={{ marginBottom: "12px" }}
                    type="email"
                  />
                  <Input
                    name="password"
                    placeholder="Password"
                    value={password}
                    type="password"
                    variant="flushed"
                    id="password-input"
                    onChange={handleChange}
                  />
                </div>
                <FormErrorMessage>{error}</FormErrorMessage>
                <div
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <Button
                    variant="solid"
                    onClick={sendOtp}
                    isLoading={btnLoading}
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
            {activeStep === 2 && (
              <OtpVerification
                email={username}
                verificationKey={verificationKey}
                username={username}
                password={password}
              />
            )}
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
