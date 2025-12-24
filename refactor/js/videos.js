import { VIDEO_MARKERS } from "./config.js";

export function setupVideoMarkers(elements) {
  const display = elements.videoDisplay;
  if (!display) return;

  // Detect mobile (works better than max-device-width alone)
  const isMobile =
    window.matchMedia("(max-width: 812px)").matches ||
    window.matchMedia("(max-device-width: 812px)").matches;

  // Reset content
  display.innerHTML = "";

  // ✅ Close button (real DOM element)
  const closeBtn = document.createElement("button");
  closeBtn.className = "videos-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close videos");
  closeBtn.textContent = "×";

  closeBtn.addEventListener("click", () => {
    // stop playback by removing iframes
    display.innerHTML = "";
    // hide overlay/container
    display.style.display = "none";
    // unlock page scroll (mobile)
    document.body.classList.remove("no-scroll");
  });

  display.appendChild(closeBtn);

  // ✅ Build items
  VIDEO_MARKERS.forEach((video, index) => {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-item");

    const iframe = document.createElement("iframe");
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
    iframe.title = `Video ${index + 1}`;
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    const caption = document.createElement("p");
    caption.classList.add("video-caption");
    caption.textContent = video.caption;

    videoContainer.appendChild(iframe);
    videoContainer.appendChild(caption);
    display.appendChild(videoContainer);
  });

  // ✅ Show (do once)
  if (isMobile) {
    display.style.display = "block"; // reels scroll uses block
    document.body.classList.add("no-scroll");
  } else {
    display.style.display = "flex";  // keep your desktop layout
    document.body.classList.remove("no-scroll");
  }
}
