const canvas = document.querySelector('#mockup');
const context = canvas.getContext('2d');
const img = document.createElement('img');
const tempCanvas = document.querySelector('#temp');
const tempContext = tempCanvas.getContext('2d');

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
};

img.addEventListener(
  'load',
  () => {
    clearCanvas();
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
    // parse each pixel
    for (let x = 0; x < tempCanvas.width; x++)
      for (let y = 0; y < tempCanvas.height; y++) {
        const data = tempContext.getImageData(x, y, 1, 1).data;
        context.beginPath();
        context.arc(5 + x * 10, 5 + y * 10, 4, 0, 2 * Math.PI);
        context.lineWidth = 3;
        context.strokeStyle = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;
        context.stroke();
      }
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
