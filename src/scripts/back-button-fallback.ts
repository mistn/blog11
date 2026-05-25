document.addEventListener("astro:page-load", () => {
  const backButton = document.querySelector("#back-button");
  if (!(backButton instanceof HTMLAnchorElement)) return;

  backButton.addEventListener("click", (e) => {
    const stored = sessionStorage.getItem("backUrl");
    const hasPostMemory = Boolean(sessionStorage.getItem("postLinkMemory"));
    const canGoBack = window.history && window.history.length > 1;

    if (hasPostMemory && canGoBack) {
      e.preventDefault();
      sessionStorage.setItem("skipViewTransition", "1");
      document.documentElement.classList.add("skip-view-transition");
      const doBack = () => window.history.back();
      if (typeof document.startViewTransition === "function") {
        try {
          document.startViewTransition(doBack);
          return;
        } catch {
          // fallthrough
        }
      }
      doBack();
      return;
    }
    if (stored) return; // let normal link navigation happen

    if (canGoBack) {
      e.preventDefault();
      // Use view transition API when available to avoid flash on navigation
      sessionStorage.setItem("skipViewTransition", "1");
      document.documentElement.classList.add("skip-view-transition");
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
