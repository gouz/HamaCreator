import '../css/main.css';
import '../less/main.less';

const canvas = document.querySelector('#mockup');
const context = canvas.getContext('2d');
const img = document.createElement('img');
const tempCanvas = document.querySelector('#temp');
const tempContext = tempCanvas.getContext('2d');

const nbX = 1;
const nbY = 1;

let palette = [];
fetch('./list.json')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    for (let i = 0; i < json.palette.length; i++) {
      palette.push(json.palette[i].color);
    }
  });

const findColor = (rgb) => {
  let best = 768;
  let resColor = palette[0];
  for (let i = 0; i < palette.length; i++) {
    let t = 0;
    for (let j = 0; j < 3; j++) {
      t += Math.abs(
        rgb[j] - parseInt(palette[i].substring(j * 2 + 1, j * 2 + 3), 16)
      );
    }
    if (t < best) {
      best = t;
      resColor = palette[i];
    }
  }
  return resColor;
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
};

const redim = () => {
  tempCanvas.width = nbX * 29;
  tempCanvas.height = nbY * 29;
  canvas.width = nbX * 580;
  canvas.height = nbY * 580;
  let newWidth = img.width;
  let newHeight = img.height;
  newHeight *= tempCanvas.width / newWidth;
  newWidth = tempCanvas.width;
  if (newHeight > tempCanvas.height) {
    newWidth *= tempCanvas.height / newHeight;
    newHeight = tempCanvas.height;
  }
  tempContext.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    (tempCanvas.width - newWidth) / 2,
    (tempCanvas.height - newHeight) / 2,
    newWidth,
    newHeight
  );
};

const draw = () => {
  for (let x = 0; x < tempCanvas.width; x++)
    for (let y = 0; y < tempCanvas.height; y++) {
      const data = tempContext.getImageData(x, y, 1, 1).data;
      context.beginPath();
      context.arc(
        (10 + x * 20) / nbX,
        (10 + y * 20) / nbY,
        8 / nbX,
        0,
        2 * Math.PI
      );
      context.lineWidth = 5 / nbX;
      context.strokeStyle = findColor(data);
      context.stroke();
    }
};

img.addEventListener(
  'load',
  () => {
    clearCanvas();
    redim();
    draw();
  },
  false
);

canvas.addEventListener(
  'dragover',
  (e) => {
    e.preventDefault();
  },
  false
);

canvas.addEventListener(
  'drop',
  (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (
        typeof FileReader !== 'undefined' &&
        file.type.indexOf('image') != -1
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    e.preventDefault();
  },
  false
);
