export const extractYouTubeVideoId = (url: string) => {
  // https://youtu.be/E2H9SygVDtI
  // https://www.youtube.com/embed/E2H9SygVDtI

  const urlParts = url.split('/');
  const id = urlParts[urlParts.length - 1];

  return id;
};

export const getYouTubeEmbedURL = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * @param width Width in pixels
 * @returns Height
 */
export const calculate169Height = (width: number): number => {
  return Math.round(width * (9 / 16));
};