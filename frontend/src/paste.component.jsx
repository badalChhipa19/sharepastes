import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPaste = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPaste = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/pastes/${id}`);
        const data = await res.json();

        if (res.ok) {
          setPaste(data);
        } else {
          setError(data.message || "Paste not found or expired");
        }
      } catch (err) {
        console.error("Error fetching paste:", err);
        setError("Server error, please try again later");
      }
    };

    fetchPaste();
  }, [id]);

  return (
    <div className="paste-view">
      <h1>View Paste</h1>
      {error && <p className="error">{error}</p>}
      {paste && (
        <div className="paste-box">
          <pre>{paste.content}</pre>
          <p>
            Remaining views:{" "}
            {paste.remaining_views !== null
              ? paste.remaining_views
              : "Unlimited"}
          </p>
          <p>
            Expires at:{" "}
            {paste.expires_at
              ? new Date(paste.expires_at).toLocaleString()
              : "Never"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewPaste;
