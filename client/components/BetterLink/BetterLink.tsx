import Link from "next/link";

const BetterLink = ({ children, href, style }: any) => {
    return (
        (<Link href={href} {...{ style }}>

            {children}

        </Link>)
    );
}

export default BetterLink;