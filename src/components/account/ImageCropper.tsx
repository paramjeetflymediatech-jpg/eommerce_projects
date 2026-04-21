"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleApply = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <h3 style={s.title}>Adjust Your Profile Picture</h3>
        <p style={s.desc}>Drag to reposition and use the slider to zoom.</p>
        
        <div style={s.cropContainer}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div style={s.controls}>
          <div style={s.sliderWrap}>
            <span style={s.icon}>−</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              style={s.slider}
            />
            <span style={s.icon}>+</span>
          </div>
          
          <div style={s.actions}>
            <button onClick={onCancel} style={s.btnCancel}>Cancel</button>
            <button onClick={handleApply} style={s.btnApply}>Apply & Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 },
  modal: { background: "#fff", width: "100%", maxWidth: 450, padding: 32, borderRadius: 2, display: "flex", flexDirection: "column", gap: 20 },
  title: { fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#000" },
  desc: { fontSize: "0.85rem", color: "#666", margin: 0 },
  cropContainer: { position: "relative", width: "100%", height: 300, background: "#333", borderRadius: 1, overflow: "hidden" },
  controls: { display: "flex", flexDirection: "column", gap: 24 },
  sliderWrap: { display: "flex", alignItems: "center", gap: 12 },
  icon: { fontSize: "1.2rem", color: "#000", fontWeight: 500 },
  slider: { flex: 1, cursor: "pointer", accentColor: "#000" },
  actions: { display: "flex", gap: 12 },
  btnCancel: { flex: 1, padding: "14px", background: "none", border: "1px solid #ddd", color: "#000", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" },
  btnApply: { flex: 1, padding: "14px", background: "#000", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }
};
