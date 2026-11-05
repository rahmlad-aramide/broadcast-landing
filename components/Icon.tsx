import Image from 'next/image';

export default function Icon({ height = 24 }: { height?: number }) {
    return <Image src="/favicon.png" alt="Broadcast Icon" width={height} height={height} style={{ width: height, height }} unoptimized priority />;
}
