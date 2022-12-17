# MNIST on Deno land 🦕

Famous MNIST dataset ported to Deno land.

## Usage

This package downloads the MNIST dataset, unpacks it and stores on users's machine. To load the
dataset:

```ts
import { loadMnist } from "https://deno.land/x/mnist@v1.1.0/mod.ts";
const mnist = await loadMnist();
```

Dataset is split up in two parts: train data (60,000 images) and test data (10,000) images. These
arrays are, in turn ordered so that first part contains easier to recognize images, than the second
part. Why is it so described on [Yann LeCun's original page][1]. So, yo probably want to shuffle
those images first, for that there is a shuffle util:

```ts
import { loadMnist, shuffle } from "https://deno.land/x/mnist@v1.1.0/mod.ts";
const mnist = await loadMnist();

const trainData = shuffle(mnist.train);
```

Each image array consist of pairs – `image` and it's `label`. Image is an array of 784 (28×28)
integers from 0 to 255. 0 represents clear paper, 255 – the deepest (black) ink. You can normalize
these images to values between 0 and 1 using `normalize()` utility function:

```ts
const trainData = shuffle(mnist.train).map(d => {label: d.label, image: normalize(d.image)});
```

Label is, of course, the digit that is encoded in the array. You can look at what that digit looks
like using `printDigit` function, e.g.:

```ts
console.log(printDigit(mnist.test[3378].image));
console.log(mnist.test[3378].label);
```

Will output:

```
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ▓ ▓ ░ ░ ░ ░ ░ ░ ░ ▒ ▓ ▓ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ▓ █ █ █ █ █ █ █ █ █ ▓ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ █ █ █ █ █ █ ▓ █ █ █ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ▒ █ ▓ ░ ░ ░ ░ ░ ░ ▒ █ █ ▓ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ▓ █ ▓ ░ ░ ░ ░ ░ ░ █ █ ▓ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ▓ █ ▒ ░ ░ ░ ░ ░ ▓ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ▒ █ ░ ░ ░ ░ ░ ░ █ █ ▒ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▒ █ ▓ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ▒ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▒ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ▒ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▒ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▓ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ ▓ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▒ █ ▒ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ▒ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ █ ▒ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
7
```

The only useful function that is left in utils is `downscaleImage` it wil turn 784 (28×28) array into
196 (14×14) array:

```ts
console.log(downscaleImage(mnist.test[3378].image).length); // -> 196
console.log(printDigit(downscaleImage(mnist.test[3378].image)));
```

Down-scaled output is:

```
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ▒ ▓ ▒ ▒ ▓ █ ▓ ░ ░ ░
░ ░ ░ ░ ▓ ▓ ▓ ▓ ▓ █ ▒ ░ ░ ░
░ ░ ░ ░ █ ▒ ░ ░ ▓ ▓ ░ ░ ░ ░
░ ░ ░ ░ ▒ ░ ░ ░ █ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ ▓ ▓ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ░ █ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ▒ ▓ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ ▓ ▒ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ █ ░ ░ ░ ░ ░ ░ ░
░ ░ ░ ░ ░ ░ █ ░ ░ ░ ░ ░ ░ ░
```

Data is packed in gzip files and will be unpacked on first run, so don't forget to add
`--allow-read` and `--allow-write` flags when you first run your program that uses the dataset.

[1]: http://yann.lecun.com/exdb/mnist/

### Available options

There's only one option `cacheDir` which tells the loader where to store the unpacked dataset. By
default it creates `.mnist_data` folder with `.gitignore` file in it, which ignores the folder
content. You can change this behavior, e.g.:

```ts
import { loadMnist } from "https://deno.land/x/mnist@v1.1.0/mod.ts";
const mnist = await loadMnist({ cacheDir: "/some/other/path" });
```

Note that in case you defined the folder yourself, the loader won't make `.gitignore` in it.
