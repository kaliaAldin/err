import { VIDEO_MARKERS } from './config.js';

export function setupVideoMarkers(elements){
  elements.videoDisplay.innerHTML = '';

  VIDEO_MARKERS.forEach((video, index) => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-item');

    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
    iframe.title = `Video ${index + 1}`;
    iframe.frameBorder = '0';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    const caption = document.createElement('p');
    caption.classList.add('video-caption');
    caption.textContent = video.caption;

    videoContainer.appendChild(iframe);
    videoContainer.appendChild(caption);

    elements.videoDisplay.appendChild(videoContainer);
    elements.videoDisplay.style.display = "flex";
  });
}
