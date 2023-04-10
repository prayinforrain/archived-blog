(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
      setGiscusTheme("light");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
      setGiscusTheme("dark");
    } else {
      initTheme(state);
      setGiscusTheme(state);
    }
  };

  lamp.addEventListener("click", () =>
    toggleTheme(localStorage.getItem("theme"))
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });

  function setGiscusTheme(newTheme) {
    const giscus_light =
      "https://cdn.jsdelivr.net/gh/prayinforrain/prayinforrain.github.io@main/static/styles/_giscus.css";
    const giscus_dark =
      "https://cdn.jsdelivr.net/gh/prayinforrain/prayinforrain.github.io@main/static/styles/_giscus_dark.css";
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: newTheme === "dark" ? giscus_dark : giscus_light,
          },
        },
      },
      "https://giscus.app"
    );
  }
})();
