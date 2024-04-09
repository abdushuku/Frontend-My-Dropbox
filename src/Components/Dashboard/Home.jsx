/** @format */

import React, { useEffect, useState } from "react";
import FileList from "../FileList/FileList";
import "./Home.css";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import UploadFIleModal from "../CreateFolderModel/folder";
import CreateFolder from "../CreateFolderModel/newFolder";
import { useDispatch, useSelector } from "react-redux";
import { allFiles,  userFolder } from "../../firebaseLogics/config";
import Loader from "../Loader/Loader";
function Home() {
  let user = JSON.parse(localStorage.getItem("localUser"));
  const { filesData, foldersData, postLoading } = useSelector(
    (state) => state.files
  );
  const [visibleUploadModal, setVisibleUploadModal] = useState(false);
  const [visibleCreateFolderModal, setVisibleCreateFolderModal] =
    useState(false);

  var dispatch = useDispatch();
  useEffect(() => {
    dispatch(userFolder(user?.uid));
    dispatch(allFiles(user?.uid));
  }, [postLoading]);
  const foldersD = foldersData?.filter((x) => x.folderId === 1);
  const filesD = filesData.filter((x) => x.folderId === 1);
  return (
    <>
      {postLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Header
            navigationsState={false}
            setVisibleUploadModal={setVisibleUploadModal}
            setVisibleCreateFolderModal={setVisibleCreateFolderModal}
          />
          <div className='HomePage '>
            <div className='container'>
              <FileList filesD={filesD} foldersD={foldersD} />
            </div>
          </div>
          <CreateFolder
            folderID={1}
            visible={visibleCreateFolderModal}
            setVisible={setVisibleCreateFolderModal}
          />
          <UploadFIleModal
            folderID={1}
            visible={visibleUploadModal}
            setVisible={setVisibleUploadModal}
          />
        </>
      )}
    </>
  );
}

export default Home;
