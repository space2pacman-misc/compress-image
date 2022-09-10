class CompressImage {
  constructor(src) {
    this._src = src;
    this._image = null;
  }

  compress(callback) {
    this._image = new Image();
    this._image.src = this._src;
    this._image.crossOrigin = 'Anonymous';
    this._image.onload = () => {
      this._onLoadImage.call(this, callback);
    }
  }

  _onLoadImage(callback) {
    const canvas = {
      original: document.createElement('canvas'),
      compressed: document.createElement('canvas')
    }
    const ctx = {
      original: canvas.original.getContext('2d'),
      compressed: canvas.compressed.getContext('2d')
    }

    canvas.original.width = this._image.width;
    canvas.original.height = this._image.height;
    canvas.compressed.width = this._image.width;
    canvas.compressed.height = this._image.height;
    ctx.original.drawImage(this._image, 0, 0);

    for(let i = 0; i < this._image.width; i += 5) {
      for(let j = 0; j < this._image.height; j++) {
        const compressedImage = ctx.compressed.createImageData(1, 1);
        const compressedImageData  = compressedImage.data;
        const originalImage = ctx.original.getImageData(i, j, 1, 1);
        const originalImageData = originalImage.data;

        compressedImageData[0] = originalImageData[0];
        compressedImageData[1] = originalImageData[1];
        compressedImageData[2] = originalImageData[2];  
        compressedImageData[3] = originalImageData[3];

        ctx.compressed.putImageData(compressedImage, i, j);
        ctx.compressed.putImageData(compressedImage, i + 1, j);
        ctx.compressed.putImageData(compressedImage, i + 2, j);
        ctx.compressed.putImageData(compressedImage, i + 3, j);
        ctx.compressed.putImageData(compressedImage, i + 4, j);
      }
    }

    callback(canvas.compressed.toDataURL());
  }
}