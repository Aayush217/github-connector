import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

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

  return (
    <div>
      <h1>GitHub Connector</h1>

      <input
        type="text"
        placeholder="GitHub username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <button onClick={searchUser}>
        Search
      </button>

      {user && (
        <div>
          <h2>{user.name}</h2>

          <img
            src={user.avatar}
            width="150"
            alt="avatar"
          />

          <p>{user.bio}</p>

          <p>
            Followers: {user.followers}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;