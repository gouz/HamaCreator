import '../css/main.css';
import '../less/main.less';

const $canvas = document.querySelector('#mockup');
const context = $canvas.getContext('2d');
const img = document.createElement('img');
const $tempCanvas = document.querySelector('#temp');
const tempContext = $tempCanvas.getContext('2d');

const $horizontal = document.querySelector('#horizontal');
const $vertical = document.querySelector('#vertical');

let nbX = 1;
let nbY = 1;

let palette = [];
let fullPalette = {};
let instructionsCollection = {};
const $palette = document.querySelector('#palette');

const $spinner = document.querySelector('#spinner');

const $instructions = document.querySelector('#instructions');

const codes =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-*/$!?';

let toggled = true;
let grid;

fetch('./list.json')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    $palette.innerHTML = '';
    for (let i = 0; i < json.palette.length; i++) {
      fullPalette[json.palette[i].color] = json.palette[i];
      fullPalette[json.palette[i].color].code = codes.charAt(i);
      palette.push(json.palette[i].color);
      $palette.innerHTML += `
        <label title="${json.palette[i].label}">
          <input class="color-picked" type="checkbox" value="${json.palette[i].color}" checked />
          <span class="border">
            <span class="color" style="background-color: ${json.palette[i].color};"></span>
            <span class="number">${json.palette[i].num}</span>
            </span>
          <span class="sr-only">${json.palette[i].label}</span>
        </label>
      `;
    }
    $palette.innerHTML += `<button id="toggle">Aucun</button>`;

    document.querySelector('#toggle').addEventListener(
      'click',
      () => {
        document.querySelectorAll('.color-picked').forEach((e) => {
          e.checked = toggled;
          e.click();
        });
        if (!toggled) {
          document.querySelector('#toggle').innerHTML = 'Aucun';
        } else {
          document.querySelector('#toggle').innerHTML = 'Tous';
        }
        toggled = !toggled;
      },
      false
    );

    document.querySelectorAll('.color-picked').forEach((e) => {
      e.addEventListener(
        'click',
        () => {
          if (e.checked) palette.push(e.value);
          else palette.splice(palette.indexOf(e.value), 1);
        },
        false
      );
    });
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
  context.clearRect(0, 0, $canvas.width, $canvas.height);
  tempContext.clearRect(0, 0, $tempCanvas.width, $tempCanvas.height);
};

const redrawCanvas = () => {
  if (nbX > nbY) {
    $canvas.width = 580;
    $canvas.height = (580 * nbY) / nbX;
  } else {
    $canvas.width = (580 * nbX) / nbY;
    $canvas.height = 580;
  }
  $instructions.innerHTML = '';
};

const redim = () => {
  $tempCanvas.width = nbX * 29;
  $tempCanvas.height = nbY * 29;
  let newWidth = img.width;
  let newHeight = img.height;
  newHeight *= $tempCanvas.width / newWidth;
  newWidth = $tempCanvas.width;
  if (newHeight > $tempCanvas.height) {
    newWidth *= $tempCanvas.height / newHeight;
    newHeight = $tempCanvas.height;
  }
  tempContext.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    ($tempCanvas.width - newWidth) / 2,
    ($tempCanvas.height - newHeight) / 2,
    newWidth,
    newHeight
  );
};

const draw = () => {
  if (palette.length) {
    grid = '';
    for (let y = 0; y < $tempCanvas.height; y++) {
      for (let x = 0; x < $tempCanvas.width; x++) {
        const data = tempContext.getImageData(x, y, 1, 1).data;
        if (data[3] != 0) {
          // no transparent
          context.beginPath();
          let div = nbX;
          if (nbY > nbX) div = nbY;
          context.arc(
            (10 + x * 20) / div,
            (10 + y * 20) / div,
            8 / div,
            0,
            2 * Math.PI
          );
          context.lineWidth = 5 / div;
          const col = findColor(data);
          context.strokeStyle = col;
          if (typeof instructionsCollection[col] === 'undefined')
            instructionsCollection[col] = 0;
          instructionsCollection[col]++;
          grid += `<i style="color: ${fullPalette[col].color}">${fullPalette[col].code}</i>`;
          context.stroke();
        } else grid += '&nbsp;';
      }
      grid += '<br />';
    }
  } else {
    alert('Pas de coloris sélectionné');
  }
};

const generateInstructions = () => {
  if (grid != '') {
    let stats = [];
    let nb = 0;
    for (const key in instructionsCollection) {
      stats.push(
        `(${fullPalette[key].num}) ${fullPalette[key].label} [<span class="key" style="color: ${fullPalette[key].color}">${fullPalette[key].code}</span>] : ${instructionsCollection[key]}`
      );
      nb += instructionsCollection[key];
    }
    stats.sort();
    $instructions.innerHTML = `
      <p>Nombre de perles à utiliser (${nb})</p>
      <ul>
        <li>${stats.join('</li><li>')}</li>
      </ul>
      <p>Instructions</p>
      <p class="key">${grid}</p>
    `;
  } else $instructions.innerHTML = '';
};

img.addEventListener(
  'load',
  () => {
    clearCanvas();
    redim();
    draw();
    generateInstructions();
    $spinner.style.display = 'none';
  },
  false
);

$canvas.addEventListener(
  'dragover',
  (e) => {
    e.preventDefault();
  },
  false
);

$canvas.addEventListener(
  'drop',
  (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (
        typeof FileReader !== 'undefined' &&
        file.type.indexOf('image') != -1
      ) {
        $instructions.innerHTML = '';
        $spinner.style.display = 'block';
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

$horizontal.addEventListener(
  'input',
  () => {
    nbX = $horizontal.value;
    redrawCanvas();
  },
  false
);

$vertical.addEventListener(
  'input',
  () => {
    nbY = $vertical.value;
    redrawCanvas();
  },
  false
);
