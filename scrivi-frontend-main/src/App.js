import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Button,
  Spacer,
  Box,
  Textarea,
  Spinner,
  IconButton,
  Grid,
  VStack,
  UnorderedList,
  ListItem,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  OrderedList,
} from "@chakra-ui/react";
import { CloseIcon, QuestionIcon } from "@chakra-ui/icons";

import { post } from "axios";
// import useLocalStorageState from './hooks/useLocalStorage';

const StatBox = ({ number, label, color }) => {
  return (
    <Box
      bg={`${color}.100`}
      color={`${color}.800`}
      w="100%"
      borderRadius="lg"
      px={4}
      py={3}
      direction="column"
      items="center"
      justify="center"
    >
      <Text fontSize="4xl">{number}</Text>
      <Text fontSize="lg">{label}</Text>
    </Box>
  );
};

const Result = ({ result, closeResult }) => {
  const sentimentColor = (label) => {
    if (label === "NEUTRAL") return "gray";
    else if (label === "POSITIVE") return "green";
    else return "red";
  };
  return (
    <>
      <Box
        h="100vh"
        w="100vw"
        bg="blackAlpha.700"
        position="fixed"
        style={{ zIndex: "50" }}
        onClick={closeResult}
      />
      <Flex
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
          zIndex: "100",
        }}
        direction="column"
        bg="white"
        h="80vh"
        w="80vw"
        borderRadius="lg"
        borderWidth="4px"
        borderColor="orange.300"
        px={10}
        py={6}
      >
        <IconButton
          icon={<CloseIcon />}
          ml="auto"
          mb={12}
          display="block"
          onClick={closeResult}
          style={{ flexShrink: "0" }}
        />

        <Box style={{ overflowY: "auto", overflowX: "hidden" }} px={4}>
          <VStack spacing={12} mb={8}>
            <Grid w="full" templateColumns="repeat(3, 1fr)" gap={6}>
              <StatBox
                number={result.stats.sentences}
                label={"Sentences"}
                color="blue"
              />
              <StatBox
                number={result.stats.words}
                label={"Words"}
                color="teal"
              />
              <StatBox
                number={result.stats.stopword_count}
                label={"Stop words"}
                color="red"
              />
            </Grid>
            <Box
              boxShadow="sm"
              borderRadius="lg"
              px={8}
              py={4}
              bg={`${sentimentColor(result.sentiment[1])}.100`}
              width="full"
            >
              <Text fontSize="lg">
                Your text is {result.sentiment[1].toLowerCase()}
              </Text>
            </Box>
            <Box
              w="full"
              bg={`cyan.100`}
              color={`cyan.900`}
              w="100%"
              borderRadius="lg"
              px={8}
              py={8}
            >
              {result.stats.sentences >= 5 ? (
                <>
                  <Text fontSize="xl">
                    A rough summary extracted from your text -
                  </Text>
                  <UnorderedList pl={6} mt={3} spacing={2}>
                    {Object.keys(result.tfidf)
                      .sort((a, b) => result.tfidf[b] - result.tfidf[a])
                      .slice(
                        0,
                        Math.max(1, Math.round(result.stats.sentences * 0.2))
                      )
                      .map((sent) => (
                        <ListItem>
                          <Text fontSize="lg">{sent}</Text>
                        </ListItem>
                      ))}
                  </UnorderedList>
                </>
              ) : (
                <Text fontSize="xl">
                  Sorry, your text is too small to generate a summary. It should
                  be minimum of 5 sentences.
                </Text>
              )}
              <Text></Text>
            </Box>
            <Box
              w="full"
              bg={`pink.100`}
              color={`pink.800`}
              w="100%"
              borderRadius="lg"
              px={8}
              py={8}
            >
              <Text fontSize="xl">Words you used the most</Text>
              <UnorderedList pl={6} mt={3} spacing={2}>
                {Object.keys(result.stats.word_count)
                  .sort(
                    (a, b) =>
                      result.stats.word_count[b] * result.tf_words[b] -
                      result.stats.word_count[a] * result.tf_words[a]
                  )
                  .slice(0, 5)
                  .map((k) => (
                    <ListItem>
                      <Text fontSize="lg">
                        {k[0].toUpperCase() + k.slice(1)}
                      </Text>
                    </ListItem>
                  ))}
              </UnorderedList>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

function App() {
  const [textVal, setTextVal] = useState("");
  const [textAnalysis, setTextAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  useEffect(() => {
    if (loading) {
      console.log("loading is:", loading);
      post("https://scrivi-backend.herokuapp.com/analyse", { text: textVal })
        .then((res) => res.data)
        .then((data) => {
          setTextAnalysis(data);
          setLoading(false);
        });
    }
  }, [loading]);

  function analyseText() {
    setLoading(true);
  }

  return (
    <Box h="100vh" bg="gray.50">
      <Drawer
        placement={"right"}
        onClose={() => setOpenDrawer(false)}
        isOpen={openDrawer}
      >
        <DrawerOverlay>
          <DrawerContent bg={"orange.100"}>
            <DrawerHeader
              borderBottomWidth="1px"
              borderColor="orange.400"
              mb={6}
            >
              What is{" "}
              <Text as="span" color="orange.700">
                scrivi
              </Text>
            </DrawerHeader>
            <DrawerBody>
              <Text>
                Scrivi is a simple text editor, crafted to help you write better
                and gain insights on your writing. It's perfect for when you're
                writing blogs, articles, or even emails.
              </Text>
              <Text mt={6}>
                It does a few things for you -
                <OrderedList mt={4} spacing={2} pl={2}>
                  <ListItem>Generates stats about your text.</ListItem>
                  <ListItem>
                    Extracts the important points, so you know the right things
                    are being focused on.
                  </ListItem>
                  <ListItem>
                    Detects whether your text is positive, neutral, or negative.
                  </ListItem>
                  <ListItem>Tells you which words you used the most.</ListItem>
                  <ListItem>
                    Few more exciting features are on the way 🥳
                  </ListItem>
                </OrderedList>
              </Text>
              <Text mt={12}>Oh, and scrivi means "write" in Italian 🇮🇹</Text>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {loading && (
        <Flex
          h="100vh"
          w="100vw"
          bg="blackAlpha.700"
          align="center"
          justify="center"
          position="fixed"
          style={{ zIndex: 50 }}
        >
          <Spinner
            style={{ zIndex: 100 }}
            size="xl"
            color="white"
            thickness="4px"
          />
        </Flex>
      )}
      {Boolean(Object.keys(textAnalysis).length) && (
        <Result
          result={textAnalysis}
          closeResult={() => setTextAnalysis(false)}
        />
      )}
      <Flex
        justify="between"
        align="center"
        px="24"
        py="4"
        background="orange.100"
      >
        <Text fontSize="xl" color="orange.800">
          scrivi
        </Text>
        <Spacer />
        <Button
          colorScheme="orange"
          variant="ghost"
          onClick={() => setOpenDrawer(true)}
          rightIcon={<QuestionIcon />}
        >
          what is scrivi
        </Button>
      </Flex>
      <Flex mt="10" mx="24" justify="space-between" align="center">
        <Text fontSize="2xl" colorScheme="orange">
          your next big article is waiting, start writing with Scrivi.
        </Text>
        <Button colorScheme="orange" onClick={analyseText} boxShadow="lg">
          Analyze text
        </Button>
      </Flex>
      <Box
        mt="8"
        mx="24"
        h="70vh"
        bg="white"
        boxShadow="base"
        borderRadius="lg"
      >
        <Textarea
          h="100%"
          fontSize={18}
          focusBorderColor="orange.200"
          resize="none"
          placeholder="write here..."
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
        />
      </Box>
    </Box>
  );
}

export default App;
