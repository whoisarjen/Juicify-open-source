import Image from 'next/image'

const Logo = ({ size }: { size: number }) => {
    return <Image width={size} height={size} alt="juicify.app" src="/images/logo.png" />
}

export default Logo