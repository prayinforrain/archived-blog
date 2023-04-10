const body = document.body;

const initTheme = (state) => {
  let defaultTheme = "light";
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    defaultTheme = "dark";
  }
  if (state === "dark") {
    body.setAttribute("data-theme", "dark");
  } else if (state === "light") {
    body.removeAttribute("data-theme");
  } else {
    localStorage.setItem("theme", defaultTheme);
  }
};

initTheme(localStorage.getItem("theme"));

setTimeout(() => body.classList.remove("notransition"), 75);
