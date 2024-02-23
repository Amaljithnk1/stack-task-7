import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faCode,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [isInCodeBlock, setIsInCodeBlock] = useState(false);

  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSelection = () => {
      // Check if the cursor is inside the code block
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      setIsInCodeBlock(range.commonAncestorContainer.parentElement.tagName === "PRE");
    };

    document.addEventListener("selectionchange", handleSelection);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);

  const handleFormatting = (format) => {
    if (format === "insertHTML" && !isInCodeBlock) {
      const codeBlock = '<pre style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;"></pre>';
      document.execCommand(format, false, codeBlock);
    } else {
      document.execCommand(format, false, null);
    }

    setActiveFormats((prevFormats) => {
      const newFormats = new Set(prevFormats);
      newFormats.has(format) ? newFormats.delete(format) : newFormats.add(format);
      return newFormats;
    });
  };

  const handleInsertVideo = () => {
    const videoUrl = prompt("Enter the video URL:");
    if (videoUrl) {
      const videoEmbed = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
      document.execCommand("insertHTML", false, videoEmbed);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      if (questionTitle && questionBody && questionTags) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody,
              questionTags,
              userPosted: User.result.name,
              userId: User.result._id,
            },
            navigate
          )
        );
      } else {
        alert("Please enter all the fields");
      }
    } else {
      alert("Login to ask a question");
    }
  };
  
const handleEnter = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const newNode = document.createElement("div");

    if (e.shiftKey && isInCodeBlock) {
      range.insertNode(document.createElement("br"));
      setIsInCodeBlock(false); 
      
    } else if (isInCodeBlock) {
      // If Enter inside the code block, add a newline
      newNode.innerHTML = "<br>";
      range.deleteContents();
      range.insertNode(newNode);
      range.setStartAfter(newNode);
      range.setEndAfter(newNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If Enter outside the code block, add a paragraph
      newNode.innerHTML = "<p><br></p>";
      range.deleteContents();
      range.insertNode(newNode);
      range.setStartAfter(newNode.firstChild);
      range.setEndAfter(newNode.firstChild);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};


  

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>

        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>Be specific and imagine you’re asking a question to another person</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>Include all the information someone would need to answer your question </p>
              <div
                contentEditable="true"
                id="ask-ques-body"
                onChange={(e) => setQuestionBody(e.target.value)}
                onKeyPress={handleEnter}
              ></div>
              <div className="editor-toolbar">
                <button
                  type="button"
                  onClick={() => handleFormatting("bold")}
                  className={activeFormats.has("bold") ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatting("italic")}
                  className={activeFormats.has("italic") ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faItalic} />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatting("insertHTML")}
                  className={activeFormats.has("insertHTML") ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faCode} />
                </button>
                <button
                  type="button"
                  onClick={handleInsertVideo}
                  className={activeFormats.has("video") ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faVideo} />
                </button>
              </div>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => setQuestionTags(e.target.value.split(" "))}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>
          </div>
          <input type="submit" value="Review your question" className="review-btn" />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
