/** @format */

import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import CreateFolder from "../CreateFolderModel/newFolder";
import UploadFIleModal from "../CreateFolderModel/folder";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allFiles, user, userFolder } from "../../firebaseLogics/config";
import FileList from "../FileList/FileList";
import "../Dashboard/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLeftLong,faRightLong} from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/Loader";

const Folder = () => {
  let user = JSON.parse(localStorage.getItem("localUser"));
  const { filesData, foldersData, postLoading } = useSelector(
    (state) => state.files
  );
  const [visibleUploadModal, setVisibleUploadModal] = useState(false);
  const [visibleCreateFolderModal, setVisibleCreateFolderModal] =
    useState(false);
  const params = useParams();
  var dispatch = useDispatch();
  useEffect(() => {
    dispatch(userFolder(user?.uid));
    dispatch(allFiles(user?.uid));
  }, [postLoading]);
  const foldersD = foldersData?.filter((x) => x.folderId === params.id);
  const filesD = filesData.filter((x) => x.folderId === params.id);
  var navigate = useNavigate();

  return (
    <>
      {postLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Header
            navigationsState={true}
            setVisibleUploadModal={setVisibleUploadModal}
            setVisibleCreateFolderModal={setVisibleCreateFolderModal}
          />
          <div className='container'>
            <span style={{}}>
              <FontAwesomeIcon
                icon={faLeftLong}
                style={{ fontSize: "30px" }}
                onClick={() => navigate(-1)}
              />
            </span>
          </div>

          <div className='HomePage '>
            <div className='container'>
              <FileList filesD={filesD} foldersD={foldersD} />
            </div>
          </div>
          <CreateFolder
            folderID={params.id}
            visible={visibleCreateFolderModal}
            setVisible={setVisibleCreateFolderModal}
          />
          <UploadFIleModal
            folderID={params.id}
            visible={visibleUploadModal}
            setVisible={setVisibleUploadModal}
          />
        </>
      )}
    </>
  );
};

export default Folder;
