import React, { useState, useRef, useEffect } from "react";
import { searchUserByName } from "../../services/userService";

export default function SearchBar( onSelectUser ) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef(null);

  const handleSearch = async () => {
    try {
      const users = await searchUserByName(query);
      setResults(users);
      setShowResults(true);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      setResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          onFocus={() => setShowResults(true)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {showResults && (
        <ul style={styles.list}>
          {results.length === 0 ? (
            <li style={styles.noResults}>No users found</li>
          ) : (
            results.map((user) => (
              <li 
                key={user.uid} 
                style={styles.item}
                onClick={() =>{
                  if (onSelectUser) onSelectUser(user);
                  setShowResults(false);
                  setQuery(user.firstName + " "+user.lastName);
                }}
              >
                {user.firstName} {user.lastName}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    maxWidth: 400,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  searchRow: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 2px 6px rgba(37, 99, 235, 0.6)",
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
  error: {
    color: "red",
    marginTop: 8,
  },
  list: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    border: "1px solid #ddd",
    borderRadius: 4,
    maxHeight: 250,
    overflowY: "auto",
    backgroundColor: "#fff",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    zIndex: 1000,
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  noResults: {
    padding: 10,
    color: "#666",
    fontStyle: "italic",
  },
};
