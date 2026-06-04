const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/github/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = response.data;

    res.json({
      name: user.name,
      username: user.login,
      followers: user.followers,
      avatar: user.avatar_url,
      bio: user.bio
    });

  } catch (error) {
    res.status(500).json({
      message: "User not found"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});