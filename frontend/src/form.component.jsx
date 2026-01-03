import { useRef, useState } from "react";

const Form = () => {
  const contentRef = useRef(null);
  const ttlRef = useRef(null);
  const viewsRef = useRef(null);
  const [resultUrl, setResultUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      content: contentRef.current.value,
      ttl_seconds: ttlRef.current.value
        ? Number(ttlRef.current.value)
        : undefined,
      max_views: viewsRef.current.value
        ? Number(viewsRef.current.value)
        : undefined,
    };

    try {
      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setResultUrl(data.url);
      } else {
        alert(data.error || "Failed to create paste");
      }
    } catch (err) {
      console.error("Error creating paste:", err);
      alert("Server error, check backend logs");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="paste-form">
        <label htmlFor="content">Paste Content</label>
        <textarea ref={contentRef} id="content" name="content" required />

        <label htmlFor="ttl_seconds">Expire After (seconds)</label>
        <input
          ref={ttlRef}
          id="ttl_seconds"
          name="ttl_seconds"
          type="number"
          min="1"
        />

        <label htmlFor="max_views">Max Views</label>
        <input
          ref={viewsRef}
          id="max_views"
          name="max_views"
          type="number"
          min="1"
        />

        <button type="submit">Create Paste</button>
      </form>

      {resultUrl && (
        <div className="paste-link">
          <p>Paste created! Share this link:</p>
          <div className="link-box">
            <a href={resultUrl} target="_blank" rel="noopener noreferrer">
              {resultUrl}
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(resultUrl);
                alert("Link copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
