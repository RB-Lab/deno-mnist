// Copyright 2022-2022 RB-Lab (Roman Bekkiev). All rights reserved. MIT license.

import {
  readAll,
  readerFromStreamReader,
} from "https://deno.land/std@0.129.0/streams/conversion.ts";
import { path } from "https://deno.land/x/compress@v0.4.4/deps.ts";
import { gunzip } from "https://deno.land/x/compress@v0.4.4/gzip/mod.ts";
export { readAll } from "https://deno.land/std@0.168.0/streams/read_all.ts";
export { readerFromStreamReader } from "https://deno.land/std@0.168.0/streams/reader_from_stream_reader.ts";
export * as path from "https://deno.land/std@0.168.0/path/mod.ts";

export interface LoadMnistOptions {
  /**
   * Where to store unzipped mnist data.
   * By default a folder .mnist_data with .gitignore [*] in it will be crated
   */
  cacheDir?: string;
}

/**
 * Loads MNIST from data archives, unpacks it on the first run and caches it. Data is organized in
 * pairs of images and labels, which in turn are split up into training (60,000) and test sets
 * (10,000). More on which data and how it is ordered on original Yann LeCun's page:
 * http://yann.lecun.com/exdb/mnist/
 */
export async function loadMnist(options?: LoadMnistOptions) {
  const cacheDir = options?.cacheDir || path.join(Deno.cwd(), ".mnist_data");
  const hide = options?.cacheDir === undefined;
  const [trainImages, trainLabels, testImages, testLabels] = await Promise.all([
    readImages(await getContent("train-images-idx3-ubyte", cacheDir, hide)),
    readLabels(await getContent("train-labels-idx1-ubyte", cacheDir, hide)),
    readImages(await getContent("t10k-images-idx3-ubyte", cacheDir, hide)),
    readLabels(await getContent("t10k-labels-idx1-ubyte", cacheDir, hide)),
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

function readImages(content: Uint8Array) {
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

function readLabels(content: Uint8Array) {
  const magicNumber = content.slice(0, 4).reduce((a, b) => a * 256 + b);
  const numLabels = content.slice(4, 8).reduce((a, b) => a * 256 + b);
  const labels = [...content.slice(8)];
  return { magicNumber, numLabels, labels: labels };
}

async function getContent(filename: string, cacheDir: string, hide: boolean) {
  const unzippedFile = path.join(cacheDir, filename);
  try {
    Deno.statSync(unzippedFile);
  } catch (e) {
    const zippedFile = new URL(`../data/${filename}.gz`, import.meta.url);
    if (!(e instanceof Deno.errors.NotFound)) throw e;
    const fetched = await fetch(zippedFile);
    if (!fetched.body) throw new Error(`Unable to fetch ${filename}`);
    const reader = fetched.body.getReader();
    const zipped = await readAll(readerFromStreamReader(reader));
    const unzipped = gunzip(zipped);
    await Deno.mkdir(cacheDir, { recursive: true });
    if (hide) {
      // make git to ignore the folder content
      const encoder = new TextEncoder();
      await Deno.writeFile(
        path.join(cacheDir, ".gitignore"),
        encoder.encode("*\n"),
        { create: true }
      );
    }
    await Deno.writeFile(unzippedFile, unzipped, { create: true });
    return unzipped;
  }
  return Deno.readFile(unzippedFile);
}
