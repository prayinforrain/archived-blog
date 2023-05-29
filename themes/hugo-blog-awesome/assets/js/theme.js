(() => {
    "use strict";
    const LS_THEME_KEY = "theme";
    const THEMES = {
        LIGHT: "light",
        DARK: "dark",
        AUTO: "auto",
    };

    const body = document.body;
    const config = body.getAttribute("data-theme");

    const getThemeState = () => {
        const lsState = localStorage.getItem(LS_THEME_KEY);
        if (lsState) return lsState;

        let state;
        switch (config) {
            case THEMES.DARK:
                state = THEMES.DARK;
                break;
            case THEMES.LIGHT:
                state = THEMES.LIGHT;
                break;
            case THEMES.AUTO:
            default:
                state = window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? THEMES.DARK
                    : THEMES.LIGHT;
                break;
        }
        return state;
    };

    const initTheme = (state) => {
        if (state === THEMES.DARK) {
            document.documentElement.classList.add(THEMES.DARK);
            document.documentElement.classList.remove(THEMES.LIGHT);
        } else if (state === THEMES.LIGHT) {
            document.documentElement.classList.remove(THEMES.DARK);
            document.documentElement.classList.add(THEMES.LIGHT);
        }
    };

    // apply giscus theme
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

    // init theme ASAP, then do the rest.
    initTheme(getThemeState());
    requestAnimationFrame(() => body.classList.remove("notransition"));

    const toggleTheme = () => {
        const state = getThemeState();
        if (state === THEMES.DARK) {
            localStorage.setItem(LS_THEME_KEY, THEMES.LIGHT);
            initTheme(THEMES.LIGHT);
            setGiscusTheme("light");
        } else if (state === THEMES.LIGHT) {
            localStorage.setItem(LS_THEME_KEY, THEMES.DARK);
            initTheme(THEMES.DARK);
            setGiscusTheme("dark");
        }
    };

    window.addEventListener("DOMContentLoaded", () => {
        // Theme switch
        const lamp = document.getElementById("mode");

        lamp.addEventListener("click", () => toggleTheme());

        // Blur the content when the menu is open
        const cbox = document.getElementById("menu-trigger");
        cbox.addEventListener("change", function () {
            const area = document.querySelector(".wrapper");
            if (this.checked) return area.classList.add("blurry");
            area.classList.remove("blurry");
        });
    });
})();
