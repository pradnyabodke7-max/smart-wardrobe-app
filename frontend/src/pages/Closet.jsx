function Closet() {
  const name = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome, {name}! 🎉</h1>
      <p>Your closet page will be built here next.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Closet;