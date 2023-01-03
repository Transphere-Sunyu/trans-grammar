import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import Stats from "./Stats";
import {
  ArrowDownOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { Box, Center } from "@chakra-ui/react";

export default function InputBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [correctSentence, setCorrectSentence] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [correction, setCorrection] = useState(null);
  const [isCorrected, setIsCorrected] = useState(false);
  const [alerts, setAlerts] = useState(0);

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

      setCorrection(editObj);

      console.log(editObj);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Navigate to previous element

  const previousElement = () => {
    try {
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
  const handleClick = (e) => {
    if (e.target.hasAttribute("edit")) {
      const edit = e.target.getAttribute("edit");
      const type = e.target.getAttribute("type");
      const description = e.target.getAttribute("desc");

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

      // Set editor text state
      setInput(editorContent);
      setTyping(false);
    }
  }, 5000);


  useEffect(() => {
    if (input && !correctSentence) {
      
      if (!typing) {
        getSentence(input).then((res) => {
          const editorBox = document.getElementById("editor-box");

          // If user is typing
          // Prevent updating the text box innerHTML

         if(!loading){

          
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
    return e.type
  }

  const detectStopTyping = (e) => {
    // setTyping(false)
    console.log(e);
    return e.type

  }
  

  return (
    <div className="container">
      <div></div>

      <div id="editor-wrapper">
        <div className="flex-row">
          <div
            name="editor-box"
            rows="4"
            cols="50"
            id="editor-box"
            onClick={handleClick}
            onInput={() => {
              // setTyping(true);
              handleText();
            }}
            contentEditable={true}
          >
            <p></p>
          </div>
          <div className="right-container flex-box">
            <div>
              <div className="loading-wrapper center">
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
                <h3>Suggestions</h3>

                <br />
                <br />
              </div>
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
                  <p>{correction?.description}</p>
                </div>
              )}
            </div>
            <div className="nav-icons flex-row">
              <LeftCircleOutlined
                onClick={previousElement}
                style={{ fontSize: 27, cursor: "pointer" }}
              />
              <RightCircleOutlined
                onClick={nextElement}
                style={{ fontSize: 27, cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <Editor
        editorState={editorState}
        wrapperClassName="editor"
        editorClassName="editor-body"
        onChange={ onEditorChange}

      /> */}
      <br />
      <br />
      <Stats category={"Correctness"} value={correctSentence} count={alerts} />
    </div>
  );
}
