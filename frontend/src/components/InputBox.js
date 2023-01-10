import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import Stats from "./Stats";
import {
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Box, Center, Flex,

  Button,
  useDisclosure,
  Spacer,
  
} from "@chakra-ui/react";
import { MdOutlineTranslate } from "react-icons/md";
import { FiCheckSquare } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'

export default function InputBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [correctSentence, setCorrectSentence] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [correction, setCorrection] = useState(null);
  const [isCorrected, setIsCorrected] = useState(false);
  const [alerts, setAlerts] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [showPopover,setShowPopover] =  useState(false)



  // Sets the cursor to the end of the text
  const setCarat = (element) => {
    // Place cursor at the end of a content editable div
    if (
      element.type !== "textarea" &&
      element.getAttribute("contenteditable") === "true"
    ) {
      element.focus();
      window.getSelection().selectAllChildren(element);
      window.getSelection().collapseToEnd();
    } else {
      // Place cursor at the end of text areas and input elements
      element.focus();
      element.select();
      window.getSelection().collapseToEnd();
    }
  };

  // Merge two sentences

  function merge(str, str2) {
    var a = str.split(" ");
    str2.split(" ").forEach(function (i, index) {
      var len = a.filter(function (item) {
        return item == i;
      }).length;
      if (len == 0) a.push(i);
    });
    return a.join(" ");
  }

  // Navigate to the next element

  const nextElement = () => {
    try {
      setShowPopover(false);

      // Get element Id from correction state
      // Get element node from correction id prop

      const elementNode = document.getElementById(correction?.id);
      console.log(elementNode);

      const edit = elementNode.nextElementSibling.getAttribute("edit");
      const type = elementNode.nextElementSibling.getAttribute("type");
      const description = elementNode.nextElementSibling?.getAttribute("desc");
      const value = elementNode.nextElementSibling.innerText;
      const id = elementNode.nextElementSibling.id;
      const editObj = {
        edit: edit,
        type: type,
        text: value,
        id: id,
        description: description,
      };

      // Correction object

      setCorrection(editObj);

      console.log(editObj);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Navigate to previous element

  const previousElement = () => {
    try {

      setShowPopover(false);

      // Get element Id from correction state
      // Get element node from correction id prop

      const elementNode = document.getElementById(correction?.id);
      const description =
        elementNode.previousElementSibling?.getAttribute("desc");

      const edit = elementNode.previousElementSibling.getAttribute("edit");
      const type = elementNode.previousElementSibling.getAttribute("type");
      const value = elementNode.previousElementSibling.innerText;
      const id = elementNode.previousElementSibling.id;
      const editObj = {
        edit: edit,
        type: type,
        text: value,
        id: id,
        description: description,
      };

      setCorrection(editObj);

      console.log(editObj);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSentence = async (sentence) => {
    try {
      setLoading(true);
      const res = await fetch(`https://grandetails.com/api/sentence`, {
        method: "post",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentences: [sentence] }),
      });
      const payload = await res.json();
      const correctedSentence = JSON.parse(payload).corrected_sentence;
      console.log(correctedSentence);
      setCorrectSentence(true);
      // setInput(correctedSentence)
      console.log(input);

      setLoading(false);

      return correctedSentence;
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  // Check if text has an edit attribute
  const clickOnText = (e) => {
    if (e.target.hasAttribute("edit")) {
      const edit = e.target.getAttribute("edit");
      const type = e.target.getAttribute("type");
      const description = e.target.getAttribute("desc");

      let popover = document.getElementById('popover')

      // Change position of the popover
      // According to the highlighted text
      // Offset the top with the font size + 4px
      popover.style.top = e.target.offsetTop + 25 + 'px'
      popover.style.left = e.target.offsetLeft + 'px'


      const value = e.target.innerText;
      const id = e.target.id;
      const editObj = {
        edit: edit,
        type: type,
        text: value,
        id: id,
        description: description,
      };

      setCorrection(editObj);
      setShowPopover(true)

      console.log(editObj);
    }
  };

  // Replace wrong text with the edit text
  // by ID

  const handleEditText = (e) => {
    try {
      const editor = document.getElementById("editor-box");

      const editorContent = editor.innerText;

      const element = document.getElementById(correction.id);
      element.innerText = correction.edit;

      setIsCorrected(true);

      // Remove 'type' attribute
      // This will unhighlight the edited text
      element.removeAttribute("edit");
      element.removeAttribute("type");
      setCorrection(null);
      setShowPopover(false);
      // Get number of spans
      // Number of span tags represent
      // errored sections
      // This value is used to show alerts

      const highlightedSections = document.querySelectorAll("[edit]");

      // Subtract 2 from  highlightedSections to account
      // for react icons span tags

      setAlerts(highlightedSections.length);
    } catch (error) {
      console.log(error.message);
    }
  };
  // Debounce Input text
  // Update input text
  const handleText = debounce(() => {
    
    const editor = document.getElementById("editor-box");

    const editorContent = editor.innerText;
    setCorrectSentence(false);

    if (editorContent && editorContent !== "\n") {
      totalWordCount()
      // Set editor text state
      setInput(editorContent);
      setTyping(false);
    }
  }, 4000);

  // Count total words in the editor
  const totalWordCount = () => {
    let s = document.getElementById("editor-box").innerText;

    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");
    setWordCount(s.split(" ").length);
  };

  // Ignore correction
  // This removes the selected correction object from the correction state
 
  const ignoreCorrection = () => {
      const element = document.getElementById(correction.id);

      setIsCorrected(true);

      // Remove 'type' attribute
      // This will unhighlight the edited text
      element.removeAttribute("edit");
      element.removeAttribute("type");
      setShowPopover(false);
      // Get number of spans
      // Number of span tags represent
      // errored sections
      // This value is used to show alerts

      const highlightedSections = document.querySelectorAll("[edit]");

      // Subtract 2 from  highlightedSections to account
      // for react icons span tags

      setAlerts(highlightedSections.length);

  }

  useEffect(() => {
    if (input && !correctSentence) {
      if (!typing) {
        getSentence(input).then((res) => {
          const editorBox = document.getElementById("editor-box");

          // If user is typing
          // Prevent updating the text box innerHTML

          if (!loading) {
            editorBox.innerHTML = res;
          }

          var tag = document.getElementById("editor-box");
          setCarat(tag);
        });
      }
    }

    return () => {
      console.log("unmounted");
    };
  }, [input, isCorrected]);

  useEffect(() => {
    // Get number of spans
    // Number of span tags represent
    // errored sections
    // This value is used to show alerts

    const highlightedSections = document.querySelectorAll("[edit]");

    // Subtract 2 from  highlightedSections to account
    // for react icons span tags

    setAlerts(highlightedSections.length);
  }, [correctSentence]);

  useEffect(() => {
    if (alerts === 0) {
      handleText();
    }

    return () => {
      console.log("alerts unmounted");
    };
  }, [alerts]);

  // useEffect(() => {
  //   document.addEventListener('keydown',detectTyping,true)

  //   return () => {
  //     console.log('keystroke unmounted')
  //   }
  // }, [])

  // useEffect(() => {
  //   document.addEventListener('keyup',detectStopTyping,true)

  //   return () => {
  //     console.log('keystroke unmounted')
  //   }
  // }, [])

  const detectTyping = (e) => {
    // setTyping(true)
    console.log(e);
    return e.type;
  };

  const detectStopTyping = (e) => {
    // setTyping(false)
    console.log(e);
    return e.type;
  };

  return (
    <Box className="container">
      <div></div>

      <Box border={"solid"} borderColor={"#F3843F"} id="editor-wrapper">
        <div className="flex-row">
          <Box w={"100%"}  position={"relative"} h={"100%"}>
            <Box id="popover" display={ showPopover ? 'box' : 'none'} zIndex={100} w={'40%'} h={'fit-content'} bg={'#fff'} position={'absolute'} borderRadius={12} border={'solid'} overflow={'hidden'} borderWidth={2} >
              <Box p={'4%'}>
              {correction && correction?.type && (
                <div>
                  <Flex>
                  <div className="align-center">
                    <div className="status-dot"></div>
                    <small>{correction.type}</small>
                  
                  </div>
                  <Spacer/>
                  <Flex onClick={() => setShowPopover(false)} cursor={'pointer'}>
                  <AiOutlineClose />
                  </Flex>
                  </Flex>
                  <p className="description">{correction?.description}</p>

                  <Flex flexDirection={"column"}>
                    
                    <h4
                      className="edit-text"
                      type={correction?.type}
                      onClick={handleEditText}
                    >
                      {correction?.edit}
                    </h4>
                  </Flex>
                </div>
              )}
              
              </Box>
              <Button w={'100%'} p={'4%'} bg={`#000`} leftIcon={<FiCheckSquare/>} color={'#fff'} onClick={() => ignoreCorrection()} >Ignore correction</Button>

            </Box>
            <div
              name="editor-box"
              rows="4"
              cols="50"
              id="editor-box"
              onClick={clickOnText}
              onInput={() => {
                // setTyping(true);

                handleText();
              }}
              contentEditable={true}
            >

              <p></p>
            </div>
            <Box
              bg={"#fff"}
              w={"100%"}
              position={"absolute"}
              bottom={0}
              left={0}
              right={0}
              top={"auto"}
            >
              <Flex justifyContent={"space-evenly"} p={"3%"}>
                <Stats
                  titleColor={`#FF5B5B`}
                  icon={
                    <ExclamationCircleOutlined
                      color="#FF5B5B"
                      style={{
                        fontSize: "24px",
                        marginRight: "7%",
                        color: "#FF5B5B",
                      }}
                    />
                  }
                  category={"Issues"}
                  value={correctSentence}
                  desc={`${alerts} ${alerts === 1 ? "alert" : "alerts"} found`}
                />
                <Stats
                  titleColor={`#24AE4A`}
                  icon={
                    <MdOutlineTranslate
                      color="#24AE4A"
                      style={{ fontSize: "34px", marginRight: "7%" }}
                    />
                  }
                  category={"Word Count"}
                  value={correctSentence}
                  desc={`${wordCount} ${wordCount === 1 ? "word" : "words"}`}
                />
              </Flex>
            </Box>
          </Box>
          <Box
            padding={"2%"}
            borderLeft={"solid"}
            borderColor={"#F3843F"}
            w={"45%"}
            className="flex-box"
          >
            <div>
              <Flex alignItems={"center"} className="loading-wrapper ">
                <h3>Suggestions</h3>
                <Box width={30} height={30}>
                  <TailSpin
                    height="30"
                    width="30"
                    color="#f3843f"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass="loader"
                    visible={loading}
                  />
                </Box>

                <br />
                <br />
              </Flex>
              {correction && correction?.type && (
                <div>
                  <div className="align-center">
                    <div className="status-dot"></div>
                    <small>{correction.type}</small>
                  </div>
                  <Center flexDirection={"column"}>
                    <h4 className="wrong-text">{correction?.text}</h4>
                    <ArrowDownOutlined />
                    <h4
                      className="edit-text"
                      type={correction?.type}
                      onClick={handleEditText}
                    >
                      {correction?.edit}
                    </h4>
                  </Center>
                  <p className="description">{correction?.description}</p>
                </div>
              )}
            </div>
            <Flex
              justifyContent={"space-evenly"}
              alignItems={"flex-end"}
              className="nav-icons flex-row"
            >
              <Box
                border={"solid"}
                borderWidth={2}
                borderColor={"#000"}
                w={"auto"}
                borderRadius={6}
                p={7}
              >
                <LeftOutlined
                  onClick={previousElement}
                  style={{ fontSize: 27, cursor: "pointer", fontSize: 24 }}
                />
              </Box>
              <Box
                border={"solid"}
                borderWidth={2}
                borderColor={"#000"}
                borderRadius={6}
                p={7}
              >
                <RightOutlined
                  onClick={nextElement}
                  style={{ fontSize: 27, cursor: "pointer", fontSize: 24 }}
                />
              </Box>
            </Flex>
          </Box>
        </div>
      </Box>
      {/* <Editor
        editorState={editorState}
        wrapperClassName="editor"
        editorClassName="editor-body"
        onChange={ onEditorChange}

      /> */}
      <br />
      <br />
    </Box>
  );
}
