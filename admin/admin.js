// Guardian

if (
  sessionStorage.getItem("login") !== "true" &&
  sessionStorage.getItem("rol") !== "admin"
) {
  window.location.href = "../index.html";
}
