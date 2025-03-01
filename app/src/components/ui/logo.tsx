import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 35, height = 35 }) => {
  return <Image src="/static/logo.svg" alt="Tech Event Challenge" width={width} height={height} />
}

export default Logo