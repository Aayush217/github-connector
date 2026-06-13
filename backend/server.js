require("dotenv").config(); 
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const token = process.env.PAT_TOKEN;
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  },
};

app.get("/api/github/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const response = await axios.get(`https://api.github.com/users/${username}`, config);
    const user = response.data;

    res.json({
      name: user.name,
      username: user.login,
      followers: user.followers,
      avatar: user.avatar_url,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ message: "User not found" });
  }
});

app.get("/api/github/org/:orgname", async (req, res) => {
  const orgname = req.params.orgname;

  try {
    const [orgRes, reposRes, membersRes] = await Promise.all([
      axios.get(`https://api.github.com/orgs/${orgname}`, config),
      axios.get(`https://api.github.com/orgs/${orgname}/repos?per_page=10&sort=updated`, config),
      axios.get(`https://api.github.com/orgs/${orgname}/members?per_page=10`, config)
    ]);

    const org = orgRes.data;
    const repos = reposRes.data;
    const members = membersRes.data;

    res.json({
      name: org.name || org.login,
      description: org.description,
      followers: org.followers,
      avatar: org.avatar_url,
      blog: org.blog,
      publicReposCount: org.public_repos,
      repos: repos.map((repo) => ({ id: repo.id, name: repo.name, url: repo.html_url, stars: repo.stargazers_count })),
      members: members.map((member) => ({ id: member.id, username: member.login, avatar: member.avatar_url, url: member.html_url })),
    });

  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log(`Token blocked, Retrying anonymously...`);
      
      try {
        const [orgRes, reposRes, membersRes] = await Promise.all([
          axios.get(`https://api.github.com/orgs/${orgname}`),
          axios.get(`https://api.github.com/orgs/${orgname}/repos?per_page=10&sort=updated`),
          axios.get(`https://api.github.com/orgs/${orgname}/public_members?per_page=10`)
        ]);

        const org = orgRes.data;
        const repos = reposRes.data;
        const members = membersRes.data;

        return res.json({
          name: org.name || org.login,
          description: org.description,
          followers: org.followers,
          avatar: org.avatar_url,
          blog: org.blog,
          publicReposCount: org.public_repos,
          repos: repos.map((repo) => ({ id: repo.id, name: repo.name, url: repo.html_url, stars: repo.stargazers_count })),
          members: members.map((member) => ({ id: member.id, username: member.login, avatar: member.avatar_url, url: member.html_url })),
        });

      } catch (fallbackError) {
         console.error("Fallback failed:", fallbackError.message);
         return res.status(500).json({ message: "Organization not found" });
      }
    }
    console.error(error.message);
    res.status(500).json({ message: "Organization not found" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});