import React from "react";
import { Box, Flex } from "@chakra-ui/react";

// Assumes array of two children are passed
const PageContentLayout = ({ children, maxWidth }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth={maxWidth || "860px"}>
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0]}
        </Flex>
        {/* Right Content */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          width={"350px"}
        >
          {children && children[1]}
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;
