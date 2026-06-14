import Image from "next/image";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ className = "w-[80px] h-[80px]", style }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[25%] shadow-[0_0_25px_rgba(139,92,246,0.25)] ${className}`} style={style}>
      <Image 
        src="/logo_v2.png" 
        alt="OshFast Logo" 
        fill 
        sizes="100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
