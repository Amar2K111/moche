'use client'

import React, { useState, useRef } from 'react'
import { Button } from './Button'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  isUploading?: boolean
  className?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  isUploading = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Regular file input for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {/* Camera input for taking pictures */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />

      {!preview ? (
        <>
          {/* Mobile Take Picture Button - Only visible on mobile */}
          <div className="block md:hidden mb-4">
            <Button
              onClick={openCamera}
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isUploading}
            >
              📸 Take Picture
            </Button>
          </div>
          
          {/* Upload Area */}
          <div
            className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">📷</div>
              <p className="text-gray-500 text-sm mb-2">
                {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-gray-400 text-xs">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors text-lg"
            disabled={isUploading}
          >
            ×
          </button>
        </div>
      )}

      {preview && !isUploading && (
        <div className="mt-4 text-center">
          <Button onClick={openFileDialog} variant="secondary" size="sm">
            📁 Choose Different Image
          </Button>
        </div>
      )}
    </div>
  )
}



