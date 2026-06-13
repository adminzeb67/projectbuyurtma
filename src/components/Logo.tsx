import Image from "next/image";

export function Logo({ className = "w-[80px] h-[80px]" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[25%] shadow-[0_0_25px_rgba(139,92,246,0.25)] ${className}`}>
      <Image 
        src="/logo_v2.png" 
        alt="OshFast Logo" 
        fill 
        className="object-cover"
        priority
      />
    </div>
  );
}
