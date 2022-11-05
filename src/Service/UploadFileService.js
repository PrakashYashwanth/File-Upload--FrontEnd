import AxiosService from "./AxiosService";

class UploadFileService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return AxiosService.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return AxiosService.get("/files");
  }
}

export default new UploadFileService();
