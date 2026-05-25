document.addEventListener("astro:page-load", () => {
  const backButton = document.querySelector("#back-button");
  if (!(backButton instanceof HTMLAnchorElement)) return;

  backButton.addEventListener("click", (e) => {
    const stored = sessionStorage.getItem("backUrl");
    if (stored) return; // let normal link navigation happen

    if (window.history && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
    // otherwise allow default href (usually home)
  });
});
