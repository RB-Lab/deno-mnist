import { gunzipFile } from "https://deno.land/x/compress@v0.4.4/gzip/mod.ts";

/**
 * Loads MNIST from data archives, unpacks it on the first run and caches it. Data is organized in
 * pairs of images and labels, which in turn are split up into training (60,000) and test sets
 * (10,000). More on which data and how it is ordered on original Yann LeCun's page:
 * http://yann.lecun.com/exdb/mnist/
 */
export async function loadMnist() {
  const [trainImages, trainLabels, testImages, testLabels] = await Promise.all([
    readImages("train-images-idx3-ubyte"),
    readLabels("train-labels-idx1-ubyte"),
    readImages("t10k-images-idx3-ubyte"),
    readLabels("t10k-labels-idx1-ubyte"),
  ]);
  return {
    train: trainImages.images.map((image, i) => ({
      image,
      label: trainLabels.labels[i],
    })),
    test: testImages.images.map((image, i) => ({
      image,
      label: testLabels.labels[i],
    })),
  };
}

async function readImages(filename: string) {
  const content = await getContent(filename);
  // read 4 bytes as a 32-bit integer
  const magicNumber = content.slice(0, 4).reduce((a, b) => a * 256 + b);
  const numImages = content.slice(4, 8).reduce((a, b) => a * 256 + b);
  const numRows = content.slice(8, 12).reduce((a, b) => a * 256 + b);
  const numCols = content.slice(12, 16).reduce((a, b) => a * 256 + b);
  const images = [...Array(numImages)].map((_, i) => {
    const start = 16 + i * numRows * numCols;
    const image = content.slice(start, start + numRows * numCols);
    return [...image];
  });
  return {
    magicNumber,
    numImages,
    numRows,
    numCols,
    images,
  };
}

async function readLabels(filename: string) {
  const content = await getContent(filename);
  const magicNumber = content.slice(0, 4).reduce((a, b) => a * 256 + b);
  const numLabels = content.slice(4, 8).reduce((a, b) => a * 256 + b);
  const labels = [...content.slice(8)];
  return { magicNumber, numLabels, labels: labels };
}

async function getContent(filename: string) {
  const unpackedFile = new URL(`../data/${filename}`, import.meta.url).pathname;
  const zipFile = new URL(`../data/${filename}.gz`, import.meta.url).pathname;
  try {
    Deno.statSync(unpackedFile);
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) throw e;
    await gunzipFile(zipFile, unpackedFile);
  }
  return Deno.readFile(unpackedFile);
}
