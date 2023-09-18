import React, { Component, useContext, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "./App.css";
import UserInfoContext from "./userInfo";

const Home = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [state, setState] = useState({
    name: `${userInfo.firstname_TH} ${userInfo.lastname_TH}`,
    receiptId: userInfo.student_id,
    price1: 0,
    price2: 0,
  });

  const handleChange = ({ target: { value, name } }) =>
    setState({ [name]: value });

  const createAndDownloadPdf = () => {
    axios
      .post("/create-pdf", state)
      .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });

        saveAs(pdfBlob, "newPdf.pdf");
      });
  };

  return (
    <div className="App">
      <a href={process.env.REACT_APP_NEXT_PUBLIC_CMU_OAUTH_URL}>
        <div>Sign in</div>
      </a>
      {/* <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={this.handleChange}
        />
        <input
          type="number"
          placeholder="Receipt ID"
          name="receiptId"
          onChange={this.handleChange}
        /> */}
      {/* <input
        type="number"
        placeholder="Price 1"
        name="price1"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Price 2"
        name="price2"
        onChange={handleChange}
      />
      <button onClick={createAndDownloadPdf}>Download PDF</button> */}
    </div>
  );
};

export default Home;
