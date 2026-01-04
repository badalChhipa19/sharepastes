const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <a href="/" className="home-link">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
