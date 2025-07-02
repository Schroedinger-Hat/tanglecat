import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 45, height = 45 }) => {
  return <Image src="/tanglecat-red.png" alt="Tech Event Challenge" width={width} height={height} />
}

export default Logo