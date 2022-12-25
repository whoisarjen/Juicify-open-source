import Link from "next/link";

const BetterLink = ({ children, href, style }: any) => {
    return (
        <Link href={href}>
            <a {...{ style }}>
                {children}
            </a>
        </Link>
    )
}

export default BetterLink;