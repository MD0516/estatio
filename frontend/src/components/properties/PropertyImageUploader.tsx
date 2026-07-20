"use client"

import { useDeletePropertyImage, useUpdatePropertyImages, useUploadPropertyImages } from "@/hooks/useProperty"
import { PropertyImage, UpdateImageInput } from "@/types"
import { getAssetUrl } from "@/utils/getAssetUrl"
import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import { FiX, FiCheck, FiImage, FiUpload } from "react-icons/fi"
import { MdOutlineFileUpload } from "react-icons/md"

type PropertyImageUploaderTypes = {
    images: PropertyImage[],
    setImages: Dispatch<SetStateAction<PropertyImage[]>>,
    editMode?: boolean,
    propertyId?: number
}
const PropertyImageUploader = ({
    images,
    setImages,
    editMode,
    propertyId
}: Readonly<PropertyImageUploaderTypes>) => {
    const { mutate: uploadImages } = useUploadPropertyImages()
    const { mutate: updateImages } = useUpdatePropertyImages()
    const { mutate: deleteImage } = useDeletePropertyImage()
    const fileRef = useRef<HTMLInputElement>(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const isEditMode = images.length > 0 ? true : false

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        if (editMode) {
            if (!propertyId) return

            uploadImages(files, {
                onSuccess: (data) => {
                    const formattedImages = data.images.map((url, index) => ({
                        url,
                        order: images.length + index + 1,
                        isCover: images.length === 0 && index === 0
                    }));

                    updateImages({
                        propertyId,
                        data: {
                            images: formattedImages
                        }
                    })
                }
            })
        } else {
            uploadImages(files, {
                onSuccess: (data) => {
                    setImages((prev) => {
                        const formattedImages = data.images.map((url, index) => ({
                            url,
                            order: prev.length + index + 1,
                            isCover: prev.length === 0 && index === 0
                        }));

                        return [...prev, ...formattedImages];
                    });
                }
            });
        }
    };

    const handleRemove = (id: number) => {
        if (!propertyId) return;
        deleteImage({ imageId: id, propertyId })
    }

    const handleToggleCover = (index: number) => {
        setImages(prev => prev.map((img, i) => ({
            ...img,
            isCover: i === index
        })))
    }

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault()

        if (draggedIndex === null || draggedIndex === index) {
            setDraggedIndex(null)
            setDragOverIndex(null)
            return
        }

        setImages(prev => {
            const newImages = [...prev]
            const [draggedItem] = newImages.splice(draggedIndex, 1)
            newImages.splice(index, 0, draggedItem)

            return newImages.map((img, i) => ({
                ...img,
                order: i + 1
            }))
        })

        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    return (
        <div className="upload-images flex flex-col items-center gap-6 w-full">
            {/* Upload Area */}
            <div
                className={`upload-area rounded-xl p-10 text-center cursor-pointer w-full max-w-2xl ${isEditMode && "hidden"}`}
                onClick={() => fileRef.current?.click()}
            >
                <input
                    type='file'
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                />
                <div className="flex flex-col items-center gap-4">
                    <div className="icon p-5 transition-transform duration-200">
                        <MdOutlineFileUpload size={56} className="text-accent" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-text text-lg">Click to upload images</p>
                        <p className="text-sm text-text-muted">PNG, JPG, JPEG, WEBP • Max 5MB each</p>
                    </div>
                    <div className="flex gap-2 text-xs text-text-muted/70">
                        <span className="px-2 py-1 bg-surface-dark rounded-full">Multiple files</span>
                    </div>
                </div>
            </div>

            {/* Images Scrollable Flex Container */}
            {images.length > 0 && (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <FiImage size={20} className="text-primary" />
                            <h3 className="font-medium text-text">Uploaded Images ({images.length})</h3>
                        </div>
                        <p className="text-xs text-text-muted">Drag to reorder • Check to set as cover</p>
                    </div>

                    <div className="image-section flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`
                                    relative group image-preview flex-shrink-0 rounded-lg overflow-hidden
                                    border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
                                    aspect-[16/9] w-[400px]
                                    ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                                    ${dragOverIndex === index ? 'border-accent ring-2 ring-accent/30 scale-105' : 'border-border-light'}
                                    hover:shadow-lg hover:border-accent/50
                                `}
                            >
                                {/* Image */}
                                <img
                                    src={getAssetUrl(image?.url)}
                                    alt={`Property Image ${index + 1}`}
                                    draggable={false}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    onClick={() => image?.id && handleRemove(image?.id)}
                                    className="absolute top-3 left-3 z-10 p-1.5 bg-red-500/90 text-white rounded-full opacity-100 hover:bg-red-600 hover:scale-110 shadow-sm"
                                >
                                    <FiX size={16} />
                                </button>

                                {/* Cover Checkbox */}
                                <div className="absolute top-3 right-3 z-10">
                                    <label className="relative flex items-center justify-center w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white transition-all shadow-sm">
                                        <input
                                            type="checkbox"
                                            checked={image.isCover}
                                            onChange={() => handleToggleCover(index)}
                                            className="peer sr-only"
                                        />
                                        <div className={`
                                            w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                            ${image.isCover ? 'border-accent bg-accent' : 'border-border-dark'}
                                            peer-checked:border-accent peer-checked:bg-accent
                                        `}>
                                            {image.isCover && (
                                                <FiCheck size={12} className="text-white" />
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Cover Badge */}
                                {image.isCover && (
                                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-accent text-white text-xs font-medium rounded-md shadow-sm">
                                        Cover
                                    </div>
                                )}

                                {/* Order Badge */}
                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-md backdrop-blur-sm">
                                    #{image.order}
                                </div>

                                {/* Drag Handle Indicator */}
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex items-center justify-center gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload More Button */}
            {images.length > 0 && (
                <button
                    onClick={() => fileRef.current?.click()}
                    className="btn btn-accent-subtle flex items-center justify-center gap-2"
                >
                    <FiUpload size={18} />
                    Upload more images
                </button>
            )}
        </div>
    )
}

export default PropertyImageUploader