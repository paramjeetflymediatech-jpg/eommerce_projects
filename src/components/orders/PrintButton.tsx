"use client";

export default function PrintButton({ style }: { style?: React.CSSProperties }) {
  return (
    <button 
      onClick={() => window.print()} 
      style={style}
    >
      PRINT INVOICE
    </button>
  );
}
