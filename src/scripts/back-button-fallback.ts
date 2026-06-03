function handleBackButtonClick(e: Event) {
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
}

document.addEventListener("click", (e) => {
  const target = e.target instanceof Element ? e.target.closest("#back-button") : null;
  if (target instanceof HTMLAnchorElement && target.id === "back-button") {
    handleBackButtonClick(e);
  }
});
