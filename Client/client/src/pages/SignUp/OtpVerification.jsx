import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  PinInput,
  PinInputField,
  HStack,
  Text,
  FormErrorMessage,
  Button,
  FormControl,
} from "@chakra-ui/react";
import { verifyEmailOtp } from "../../services/otp";
import { signUpWorkflow } from "../../services/signUp";
import { useAuth } from "../../providers/auth";

const OtpVerification = ({ email, verificationKey, username, password }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const [delay, setDelay] = useState(5 * 60);

  const [minutes, seconds] = useMemo(
    () => [Math.floor(delay / 60), Math.floor(delay % 60)],
    [delay]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(delay - 1);
    }, 1000);

    if (delay === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  });

  const handleOtpSubmit = async () => {
    setError("");
    setBtnLoading(true);

    try {
      const { status, error } = await verifyEmailOtp(verificationKey, otp);
      if (error || status !== 200) {
        setError("OTP verification failed");
        setBtnLoading(false);
        return;
      }

      console.log("---------------------------------------");
      console.log("OTP is valid!!!");
      console.log("Initiating sign up workflow!!");

      const { serverDhPubKey, serverRsaPubKey, sharedSecret, userId } =
        await signUpWorkflow(username, password, verificationKey);

      auth.initializeSession(
        {
          userId,
          rsaPubKey: serverRsaPubKey,
          dhPubKey: serverDhPubKey,
          sharedSecret,
        },
        () => {
          navigate("/");
        }
      );
    } catch (err) {
      setError("Something went wrong! Try again. ");
      setBtnLoading(false);
    }
  };

  return (
    <div>
      <Text
        sx={{
          marginBottom: "10px",
        }}
        fontSize="2xl"
      >
        Verification
      </Text>
      <Text sx={{ paddingBottom: "16px" }}>
        An OTP has been sent to <b>{email}</b>. Valid till {minutes}:{seconds}
      </Text>
      <FormControl isInvalid={!!error}>
        <HStack sx={{ marginBottom: "12px" }}>
          <PinInput
            type="number"
            otp
            onChange={(val) => {
              setOtp(val);
            }}
            isInvalid={!!error}
          >
            <PinInputField autoFocus />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        <FormErrorMessage sx={{ margin: "14px 0px" }}>{error}</FormErrorMessage>
        <Button
          variant="solid"
          onClick={handleOtpSubmit}
          isLoading={btnLoading}
          isDisabled={otp.length < 6}
        >
          Verify
        </Button>
      </FormControl>
    </div>
  );
};

export default OtpVerification;
