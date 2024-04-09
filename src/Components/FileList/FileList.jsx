/** @format */

import React, { useState } from "react";
import "./FileList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faFolder,
  faTrash,
  faEllipsis,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteFiles } from "../../firebaseLogics/config.js";

function FileList({ filesD, foldersD }) {
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const handleTogle = (id) => {
    if (id === visibleDropdown) {
      setVisibleDropdown("");
      return;
    }
    setVisibleDropdown(id);
  };
  const [copySuccess, setCopySuccess] = useState(false);
  const dispatch = useDispatch();

  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      alert("Succsesfuly copiyed  Validity Period is 2 days");
    } catch (err) {
      console.error("Failed to copy link: ", err);
      setCopySuccess(false);
    }
  };
  console.log(copySuccess);
  return (
    <div className="fileTable">
      <table class="table">
        <tbody>
          {foldersD?.map((el) => (
            <tr className="folder" style={{ marginBottom: "10px" }}>
              <td>
                <Link
                  to={`/home/folder/${el.id}`}
                  style={{ width: "100%", color: "black" }}
                >
                  <FontAwesomeIcon icon={faFolder} /> {el.name}
                </Link>
              </td>
            </tr>
          ))}
          {filesD?.map((el) => (
            <tr className="file" key={el.id}>
              <td>
                <a
                  style={{ color: "#000" }}
                  href={el?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFile} /> {el.filename}
                </a>
              </td>
              <td>
                <span className="elipsis" onClick={() => handleTogle(el.id)}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </span>
                <div
                  className={`icons ${
                    visibleDropdown === el.id ? "active" : ""
                  }`}
                >
                  <a href={el?.url} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </a>
                  <span onClick={() => copyToClipboard(el?.url)}>
                    <FontAwesomeIcon icon={faCopy} />
                    Copy Link
                  </span>
                  <span
                    onClick={() =>
                      dispatch(deleteFiles({ name: el.name, id: el.id }))
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;
