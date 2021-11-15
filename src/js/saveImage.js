saveImage.addEventListener("click", function (evt) {
  window.open(canvas.toDataURL("image/png"));
  evt.preventDefault();
}, false);