"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/test")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>teeeesdtttttttttt</h1>
      <ul>
        {data.data.map((test) => (
          <li key={test.id}>
            <h2>{test.Title}</h2>
            <p>{test.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
