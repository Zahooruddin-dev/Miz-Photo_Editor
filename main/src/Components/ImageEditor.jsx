// src/components/ImageEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import EditControls from './EditControls';
import { FiUpload, FiDownload, FiMaximize, FiMinimize } from 'react-icons/fi';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [fileType, setFileType] = useState('image/png');
  const [quality, setQuality] = useState(92);
  const [fullscreen, setFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    grayscale: 0,
    blur: 0,
    hueRotate: 0,
    opacity: 100,
    invert: 0,
    sharpen: 0,
    temperature: 0,
    tint: 0,
    exposure: 100,
    highlight: 100,
    shadow: 100,
    vignette: 0
  });
  const [transform, setTransform] = useState({
    rotate: 0,
    flipH: 1,
    flipV: 1,
    zoom: 1
  });
  
  const cropperRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      applyFiltersRealTime();
    }
  }, [filters, transform]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const applyFiltersRealTime = () => {
    const canvas = cropperRef.current?.cropper.getCroppedCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Apply base filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hueRotate}deg)
      opacity(${filters.opacity}%)
      invert(${filters.invert}%)
    `;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Apply transformations
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((transform.rotate * Math.PI) / 180);
    tempCtx.scale(transform.flipH * transform.zoom, transform.flipV * transform.zoom);
    tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);

    // Apply filters
    tempCtx.filter = ctx.filter;
    tempCtx.drawImage(canvas, 0, 0);

    // Apply custom effects
    applyCustomEffects(tempCtx, tempCanvas.width, tempCanvas.height);

    setEditedImage(tempCanvas.toDataURL(fileType, quality / 100));
  };

  const applyCustomEffects = (ctx, width, height) => {
    // Temperature adjustment
    const temperatureRGB = getTemperatureRGB(filters.temperature);
    ctx.fillStyle = `rgba(${temperatureRGB.join(',')}, 0.1)`;
    ctx.fillRect(0, 0, width, height);

    // Tint adjustment
    const tintRGB = getTintRGB(filters.tint);
    ctx.fillStyle = `rgba(${tintRGB.join(',')}, 0.1)`;
    ctx.fillRect(0, 0, width, height);

    // Vignette effect
    if (filters.vignette > 0) {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.5, `rgba(0,0,0,${filters.vignette / 200})`);
      gradient.addColorStop(1, `rgba(0,0,0,${filters.vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Exposure, highlights, and shadows
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Exposure
      const exposureFactor = filters.exposure / 100;
      data[i] *= exposureFactor;
      data[i + 1] *= exposureFactor;
      data[i + 2] *= exposureFactor;

      // Highlights and shadows
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const highlightFactor = filters.highlight / 100;
      const shadowFactor = filters.shadow / 100;

      if (brightness > 128) {
        data[i] *= highlightFactor;
        data[i + 1] *= highlightFactor;
        data[i + 2] *= highlightFactor;
      } else {
        data[i] *= shadowFactor;
        data[i + 1] *= shadowFactor;
        data[i + 2] *= shadowFactor;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getTemperatureRGB = (temp) => {
    const value = temp / 100;
    return [
      255 * Math.max(0, value),
      255 * Math.max(0, 1 - Math.abs(value)),
      255 * Math.max(0, -value)
    ];
  };

  const getTintRGB = (tint) => {
    const value = tint / 100;
    return [
      255 * Math.max(0, -value),
      255 * Math.max(0, value),
      255 * Math.max(0, -value)
    ];
  };

  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.download = `edited-image.${fileType.split('/')[1]}`;
      link.href = editedImage;
      link.click();
    }
  };

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!fullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
              <FiUpload className="inline-block mr-2" />
              Choose Image
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {fullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
          </div>

          {image && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative">
                  <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 400, width: '100%' }}
                    initialAspectRatio={16 / 9}
                    guides={true}
                    className="rounded-lg border-2 border-gray-200"
                    cropend={applyFiltersRealTime}
                  />
                </div>
                <div>
                  {editedImage && (
                    <div className="relative h-[400px] rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img
                        src={editedImage}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <EditControls
                filters={filters}
                setFilters={setFilters}
                transform={transform}
                setTransform={setTransform}
                fileType={fileType}
                setFileType={setFileType}
                quality={quality}
                setQuality={setQuality}
              />

              <button
                onClick={handleDownload}
                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                <FiDownload className="mr-2" />
                Download Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;