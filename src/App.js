import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UploadFile from "./Component/UploadFile/UploadFile";

function App() {
  return (
    <div className="container" style={{ width: "600px" }}>
      <div style={{ margin: "20px" }}>
        <h1>Please select a file to upload</h1>
      </div>

      <UploadFile />
    </div>
  );
}

export default App;
