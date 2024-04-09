import React, { useEffect, useState } from "react";
import { auth } from "../../api/firebaseConfig";
import "./Header.css";
function Header({
  setVisibleUploadModal,
  setVisibleCreateFolderModal,
  navigationsState,
  }){
  // let user = JSON.parse(localStorage.getItem("localUser"));
  const [users, setUsers] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((e) => {
      setUsers(e);
    });
  }, []); 
  return (
    <div>
      <div className="header-side container">
        <h1>{users?.displayName}'s Files</h1>
        <div className="buttons">
          <button
            className="create"
            onClick={() => setVisibleCreateFolderModal(true)}
          >
            Create
          </button>
          <button
            className="upload"
            onClick={() => setVisibleUploadModal(true)}
          >
            Upload
          </button>
        </div>
      </div>
      {/* <hr style={{ marginTop: "10px" }} /> */}
      {navigationsState ? <></> : <></>}
    </div>
  );
}

export default Header;
