import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const [orgName, setOrgName] = useState("");
  const [org, setOrg] = useState(null);

  const searchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/github/${username}`
      );
      setUser(response.data);
    } catch {
      alert("User not found");
    }
  };

  const searchOrg = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/github/org/${orgName}`
      );
      setOrg(response.data);
    } catch {
      alert("Organization not found or rate limit exceeded");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>GitHub Connector</h1>
      <section style={{ marginBottom: "40px" }}>
        <h2>Search Users</h2>
        <input
          type="text"
          placeholder="GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={searchUser}>Search User</button>

        {user && (
          <div style={{ marginTop: "20px" }}>
            <h3>{user.name}</h3>
            <img src={user.avatar} width="150" alt="avatar" />
            <p>{user.bio}</p>
            <p>Followers: {user.followers}</p>
          </div>
        )}
      </section>

      <hr />
      <section style={{ marginTop: "40px" }}>
        <h2>Search Organizations</h2>
        <input
          type="text"
          placeholder="GitHub organization"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <button onClick={searchOrg}>Search Org</button>

        {org && (
          <div style={{ marginTop: "20px" }}>
            <h3>{org.name}</h3>
            <img src={org.avatar} width="150" alt="org-avatar" />
            <p>{org.description}</p>
            <p>Followers: {org.followers} | Total Public Repos: {org.publicReposCount}</p>
            {org.blog && <p>Website: <a href={org.blog} target="_blank" rel="noreferrer">{org.blog}</a></p>}

            <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
              <div>
                <h4>Recent Repositories</h4>
                <ul>
                  {org.repos.map((repo) => (
                    <li key={repo.id}>
                      <a href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a> 
                      <span style={{ marginLeft: "5px" }}>{repo.stars}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Members</h4>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {org.members.map((member) => (
                    <li key={member.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <img src={member.avatar} width="30" alt="member" style={{ borderRadius: "50%" }} />
                      <a href={member.url} target="_blank" rel="noreferrer">{member.username}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;