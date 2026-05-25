document.addEventListener("astro:page-load", () => {
  const backButton = document.querySelector("#back-button");
  if (!(backButton instanceof HTMLAnchorElement)) return;

  backButton.addEventListener("click", (e) => {
    const stored = sessionStorage.getItem("backUrl");
    if (stored) return; // let normal link navigation happen

    if (window.history && window.history.length > 1) {
      e.preventDefault();
      // Use view transition API when available to avoid flash on navigation
      const doBack = () => window.history.back();
      if (typeof document.startViewTransition === "function") {
        try {
          document.startViewTransition(doBack);
          return;
        } catch {
          // fallthrough to direct back
        }
      }

      doBack();
    }
    // otherwise allow default href (usually home)
  });
});
