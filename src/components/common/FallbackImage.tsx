"use client";
import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTAwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIGZpbGw9IiNGNEY0RjQiLz4KICA8ZyBvcGFjaXR5PSIwLjMiPgogICAgPHJlY3QgeD0iMjc1IiB5PSIzNzUiIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiByeD0iMTIiIHN0cm9rZT0iIzg4ODg4OCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSIzNTAiIGN5PSI0NTAiIHI9IjMwIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHBhdGggZD0iTTUyNSA1NTBMNDAwIDQyNUwyNzUgNTc1IiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDwvZz4KICA8dGV4dCB4PSI0MDAiIHk9IjY3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzg4ODg4OCIgc3R5bGU9ImZvbnQtZmFtaWx5OiAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE0cHg7IGxldHRlci1zcGFjaW5nOiAwLjFlbTsgZm9udC13ZWlnaHQ6IDcwMDsgZmlsbC1vcGFjaXR5OiAwLjU7Ij5QSUVDRSBQUkVWSUVXIFVOQVZBSUxBQkxFLzwvdGV4dD4KPC9zdmc+";

export default function FallbackImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: FallbackImageProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
    />
  );
}
