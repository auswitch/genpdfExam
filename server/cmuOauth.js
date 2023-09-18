const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

const getCMUBasicInfoAsync = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

router.post("/", async (req, res) => {
  try {
    //validate code
    if (typeof req.query.code !== "string") {
      return res
        .status(400)
        .send({ ok: false, message: "Invalid authorization code" });
    }
    //get access token
    const response = await axios.post(
      "https://oauth.cmu.ac.th/v1/GetToken.aspx",
      {},
      {
        params: {
          code: req.query.code,
          redirect_uri: req.query.redirect_uri,
          client_id: req.query.client_id,
          client_secret: req.query.client_secret,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!response) {
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get OAuth access token" });
    }
    //get basic info
    const response2 = await getCMUBasicInfoAsync(response.data.access_token);
    if (!response2) {
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get cmu basic info" });
    }
    return res.send(response2);
  } catch (err) {
    if (!err.response) {
      return res.send({
        ok: false,
        message: "Cannot connect to API Server. Please try again later.",
      });
    } else if (!err.response.data.ok) return err.response.data;
    else return err;
  }
});

module.exports = router;
