import React, { useState, useEffect } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    aspectRatio?: string; // e.g., "aspect-[4/3]"
    src: string; // Make src mandatory
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
    src,
    alt,
    className,
    aspectRatio = "aspect-square",
    ...props
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Generate Low-Quality Image Placeholder (LQIP) URL
    // We assume Supabase storage URLs here, which support transformation params
    const lqipSrc = src.includes('?')
        ? `${src}&width=20&quality=20`
        : `${src}?width=20&quality=20`;

    // Full High-Quality Image
    const fullSrc = src;

    // Use useEffect to eager-load the image in JS. 
    // This ensures the browser downloads it fully before we swap the state,
    // providing a guaranteed smooth fade-in from the blur placeholder.
    useEffect(() => {
        const img = new Image();
        img.src = fullSrc;

        // Optional: decode() ensures the image is decoded off the main thread before painting
        if (img.decode) {
            img.decode().then(() => setImageLoaded(true)).catch(() => setImageLoaded(true));
        } else {
            img.onload = () => setImageLoaded(true);
        }
    }, [fullSrc]);

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${aspectRatio} ${className}`}>

            {/* 1. Low Quality Blur Placeholder (Always visible initially) */}
            <img
                src={lqipSrc}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 blur-xl scale-110 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                style={{ zIndex: 1 }}
            />

            {/* 2. Skeleton Pulse Overlay */}
            {!imageLoaded && (
                <div
                    className="absolute inset-0 bg-gray-200/50 animate-pulse z-10"
                />
            )}

            {/* 3. Actual Image */}
            <img
                src={fullSrc}
                alt={alt}
                className={`relative w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                style={{ zIndex: 2 }}
                {...props}
            />
        </div>
    );
};

export default ImageWithSkeleton;
