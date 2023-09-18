import axios from "axios";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserInfoContext from "./userInfo";
import { saveAs } from "file-saver";

export default function CMUOAuthCallback() {
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState();
  const [state, setState] = useState({
    name: "",
    Id: 0,
    faculty: "",
    price2: 888,
  });

  const handleChange = ({ target: { value, name } }) =>
    setState({ [name]: value });

  async function signIn(authorizationCode) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/cmuOAuth`,
        //process.env.REACT_APP_CMU_OAUTH_GET_TOKEN_URL,
        {},
        {
          params: {
            code: authorizationCode,
            redirect_uri: process.env.REACT_APP_CMU_OAUTH_REDIRECT_URL,
            client_id: process.env.REACT_APP_CMU_OAUTH_CLIENT_ID,
            client_secret: process.env.REACT_APP_CMU_OAUTH_CLIENT_SECRET,
            grant_type: "authorization_code",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        setMessage("Cannot connect to API Server. Please try again later.");
      } else if (!err.response.data.ok) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Unknown error occurred. Please try again later.");
      }
    }
  }

  const createAndDownloadPdf = () => {
    axios
      .post("/create-pdf", state)
      .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });

        saveAs(pdfBlob, `${user.student_id}.pdf`);
      });
  };

  useEffect(() => {
    if (!code) return;
    // const setUser = async (data) => {
    //   setUserInfo(data)
    // }
    const fetchData = async () => {
      const resp = await signIn(code);
      if (resp) {
        setUser(resp);

        console.log(resp);
        // if (resp.cmuitaccount) navigate("/");
      }
    };

    fetchData();
    if (user)
      setState({
        name: `${user.firstname_TH} ${user.lastname_TH}`,
        Id: user.student_id,
        faculty: user.organization_name_TH,
      });
  }, [code, navigate, user]);

  return (
    <div>
      
      <button onClick={() => navigate("/")}>Go Back</button>
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
      /> */}
      {user && <button onClick={createAndDownloadPdf}>Download PDF</button>}
    </div>
  );
}
