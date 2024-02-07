import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import Directory from "./Directory";
// import RightContent from "./RightContent";
// import SearchInput from "./SearchInput";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Flex
      bg="white"
      height="60px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <Image src="/icons/secureddit-logo.svg" height="55px" />
        <div
          style={{
            paddingBottom: "6px",
          }}
        >
          <Image src="/icons/secureddit.svg" height="85px" />
        </div>
      </Flex>
      {/* {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} /> */}
    </Flex>
  );
};

export default Navbar;
