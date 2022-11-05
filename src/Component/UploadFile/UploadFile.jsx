import React, { useEffect, useState } from "react";
import UploadFileService from "../../Service/UploadFileService";
import PDFViewer from "../PDFViewer/PDFViewer";

const UploadFile = () => {
  const [filesList, setFilesList] = useState([]);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [selectedFileInfo, setSelectedFileInfo] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [showPdf, setShowPdf] = useState("");

  const fetchFiles = async () => {
    const response = await UploadFileService.getFiles();
    setFilesList(response.data);
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  const selectedFiles = (event) => {
    setSelectedFileInfo(undefined);
    setProgress(0);
    setMessage("");
    const fileInfo = event.target.files;
    if (
      fileInfo["0"].size < 1000000 &&
      fileInfo["0"].type === "application/pdf"
    ) {
      setSelectedFileInfo(event.target.files["0"]);
      setMessage("");
    } else {
      if (fileInfo["0"].type === "application/pdf") {
        setMessage("File size exceeded 1MB");
      } else {
        setMessage("File is not of type pdf");
      }
    }
  };
  const uploadFile = async () => {
    try {
      let currentFile = selectedFileInfo;
      setCurrentFile(currentFile);
      console.log(currentFile);
      const response = await UploadFileService.upload(currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      });
      setMessage(response.data.message);
      const getFilesResponse = await UploadFileService.getFiles();
      setFilesList(getFilesResponse.data);
    } catch (err) {
      console.log("error occured", err);
      setProgress(0);
      setMessage("Couldn't upload the file!!!");
      setCurrentFile(undefined);
    } finally {
      setSelectedFileInfo(undefined);
    }
  };

  const handleClick = (event, url) => {
    setShowPdf("");
    event.preventDefault();
    setShowPdf(url);
  };

  return (
    <div>
      {currentFile && progress > 0 && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <label className="btn btn-default">
        <input type="file" onChange={selectedFiles} />
      </label>

      <button
        className="btn btn-danger"
        disabled={!selectedFileInfo}
        onClick={uploadFile}
      >
        Upload
      </button>

      {message && (
        <div className="alert alert-light" role="alert">
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {filesList.length > 0 &&
            filesList.map((file, index) => (
              <li className="list-group-item" key={index}>
                <a
                  href={file.url}
                  onClick={(event) => handleClick(event, file.url)}
                >
                  {file.name}
                </a>
              </li>
            ))}
        </ul>
      </div>

      {showPdf && <PDFViewer PDF={showPdf} />}
    </div>
  );
};

export default UploadFile;
