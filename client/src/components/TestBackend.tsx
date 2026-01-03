import { useEffect, useState } from "react";

// ============================================
// TEST BACKEND - Backend testing utility
// ============================================

const TestBackend = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error(err));
  }, []);

  return <div>{data ? data : "Loading..."}</div>;
};

export default TestBackend;
