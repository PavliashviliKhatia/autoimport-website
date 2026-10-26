// Shrinks a photo in the browser before upload (keeps requests small and fast)
export function shrink(file, max = 1100, q = 0.72) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)), cv = document.createElement("canvas");
      cv.width = im.width * k; cv.height = im.height * k;
      cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
      res(cv.toDataURL("image/jpeg", q).split(",")[1]);
    };
    im.onerror = () => rej(new Error("Could not read photo"));
    im.src = URL.createObjectURL(file);
  });
}
