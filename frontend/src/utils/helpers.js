// Helper functions to convert a file to a data URL as well as handling YouTube URL links

// helper: file -> data URL
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
};

// helper: turn whatever the user pasted into an actual youtube embed url
export const toYoutubeEmbed = (url) => {
  if (!url) return '';

  const trimmed = url.trim();
  // already an embed link
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // normal watch link: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // short link: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  return trimmed;
};