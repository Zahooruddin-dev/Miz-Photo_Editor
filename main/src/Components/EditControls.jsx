
// src/components/EditControls.jsx
import React from 'react';
import { FiSliders, FiRotateCw, FiImage, FiDownload } from 'react-icons/fi';

const EditControls = ({
  filters,
  setFilters,
  transform,
  setTransform,
  fileType,
  setFileType,
  quality,
  setQuality
}) => {
  const filterCategories = {
    'Basic Adjustments': ['brightness', 'contrast', 'saturation', 'exposure'],
    'Color Effects': ['temperature', 'tint', 'hueRotate', 'sepia', 'grayscale', 'invert'],
    'Light & Shadow': ['highlight', 'shadow', 'opacity'],
    'Effects': ['blur', 'sharpen', 'vignette']
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleTransformChange = (name, value) => {
    setTransform(prev => ({ ...prev, [name]: value }));
  };

  const getFilterRange = (filterName) => {
    const ranges = {
      brightness: [0, 200],
      contrast: [0, 200],
      saturation: [0, 200],
      sepia: [0, 100],
      grayscale: [0, 100],
      blur: [0, 20],
      hueRotate: [0, 360],
      opacity: [0, 100],
      invert: [0, 100],
      sharpen: [0, 100],
      temperature: [-100, 100],
      tint: [-100, 100],
      exposure: [0, 200],
      highlight: [0, 200],
      shadow: [0, 200],
      vignette: [0, 100]
    };
    return ranges[filterName] || [0, 100];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(filterCategories).map(([category, filterNames]) => (
          <div key={category} className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FiSliders className="text-blue-600" />
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>
            {filterNames.map(name => {
              const [min, max] = getFilterRange(name);
              return (
                <div key={name} className="space-y-2">
                  <label className="flex justify-between text-sm font-medium text-gray-700">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                    <span>{filters[name]}</span>
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={filters[name]}
                    onChange={(e) => handleFilterChange(name, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FiRotateCw className="text-blue-600" />
            <h3 className="text-lg font-semibold">Transform</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                Rotate
                <span>{transform.rotate}°</span>
              </label>
              <input
                type="range"
                min={-180}
                max={180}
                value={transform.rotate}
                onChange={(e) => handleTransformChange('rotate', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                Zoom
                <span>{transform.zoom.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={transform.zoom}
                onChange={(e) => handleTransformChange('zoom', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTransformChange('flipH', transform.flipH * -1)}
                className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border"
              >
                Flip H
              </button>
              <button
                onClick={() => handleTransformChange('flipV', transform.flipV * -1)}
                className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border"
              >
                Flip V
              </button>// src/components/EditControls.jsx (continued from previous)
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FiDownload className="text-blue-600" />
            <h3 className="text-lg font-semibold">Export Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/gif">GIF</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                Quality
                <span>{quality}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="pt-4">
              <div className="text-xs text-gray-500">
                Recommended settings:
                <ul className="list-disc list-inside mt-1">
                  <li>Photos: JPEG, 85-95% quality</li>
                  <li>Graphics: PNG for transparency</li>
                  <li>Web optimized: WebP, 75-85% quality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditControls;