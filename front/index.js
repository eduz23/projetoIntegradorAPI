const API = window.location.hostname === "localhost"
  ? "http://127.0.0.1:3000"
  : "https://projetointegradorapi-ks3p.onrender.com";

  console.log("login js carregou");

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  console.log("form:", form);

  form.addEventListener("submit", async (e) => {
    console.log("submit disparou");
    e.preventDefault();
  });

});