import { useEffect, useState } from "react";

// ============================================
// TEST BACKEND - Backend testing component
// ============================================

const TestBackend = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/test`)
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error(err));
  }, []);

  return <div>{data ? data : "Loading..."}</div>;
};

export default TestBackend;
