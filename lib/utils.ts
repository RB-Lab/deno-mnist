const shades = ["░", "▒", "▓", "█"];

/**
 * Returns a string that can be printed to console and looks like a digit, e.g.:
 * ```
 * const image = loadMnist().train[0].image;
 * console.log(printImage(downscaleImage(image))); // ->
 * ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ▒ ▒ ▒ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ▒ █ █ █ █ █ ░ ░ ░ ░
 * ░ ░ ░ ░ █ █ ░ ░ ░ █ ▓ ░ ░ ░
 * ░ ░ ░ ▓ █ ░ ░ ▓ █ █ ▒ ░ ░ ░
 * ░ ░ ░ ▒ █ █ █ ▓ █ ▓ ░ ░ ░ ░
 * ░ ░ ░ ░ ▒ ▒ ░ ░ █ ▒ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ░ ▓ █ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ░ █ ▓ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ▒ █ ░ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ █ ▓ ░ ░ ░ ░ ░ ░
 * ░ ░ ░ ░ ░ ░ ▒ ▒ ░ ░ ░ ░ ░ ░
 * ```
 */
export function printDigit(image: number[]) {
  const size = Math.sqrt(image.length);
  if (size % 1 !== 0) throw new Error("image is not square");
  const img: string[] = [];
  for (let i = 0; i < size; i++) {
    const row = image
      .slice(i * size, i * size + size)
      .map((v) => shades[Math.floor(v / 64)]);
    img.push(row.join(" "));
  }
  return img.join("\n");
}

/** Reduces size of 28×28 pixel image to 14×14 */
export function downscaleImage(image: number[]) {
  const newImg: number[] = [];
  for (let i = 0; i < 28; i += 2) {
    for (let j = 0; j < 28; j += 2) {
      const a = image[i * 28 + j];
      const b = image[i * 28 + j + 1];
      const c = image[(i + 1) * 28 + j];
      const d = image[(i + 1) * 28 + j + 1];
      newImg.push((a + b + c + d) / 4);
    }
  }
  return newImg;
}

/**
 * Fisher-Yates (aka Knuth) Shuffle.
 * https://stackoverflow.com/a/2450976/1105860
 */
export function shuffle<T>(array: T[]) {
  performance.mark("shuffle-start");
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/** Turns each image pixel from 0..255 to 0..1 */
export function normalize(image: number[]) {
  return image.map((v) => v / 255);
}
