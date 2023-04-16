import { range } from 'lodash'
import Image from 'next/image'
import SidebarRight from 'src/layout/SidebarRight'

const { title, img_url, content } = {
    title: 'The Witcher: Ronin has arrived on Kickstarter!',
    content: `The Witcher: Ronin is an original comic, created and published by CD PROJEKT RED, which translates the dark fantasy world of The Witcher into a feudal Japanese setting. The story focuses on monster slayer Geralt, who must venture across Yokai - infested lands while attempting to track down the mysterious Lady of Snow Yuki Onna.`,
    img_url: '/images/witcher.jpg',
}

const PostPage = () => {
    return (
        <div className="flex flex-1 flex-col gap-8">
            <Image src={img_url} alt="Juicify" width="970" height="545" />
            <div className="flex gap-8 flex-row">
                <div className="flex flex-1 flex-col gap-3">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    {range(5).map((x) => (
                        <p key={x}>{content}</p>
                    ))}
                    <h2 className="text-3xl font-bold">asddassadasasas</h2>
                    {range(5).map((x) => (
                        <p key={x}>{content}</p>
                    ))}
                    <h3 className="text-2xl font-bold">zxcxzcxzczxzcx</h3>
                    {range(5).map((x) => (
                        <p key={x}>{content}</p>
                    ))}
                    <h2 className="text-3xl font-bold">asddassadasasas</h2>
                    {range(5).map((x) => (
                        <p key={x}>{content}</p>
                    ))}
                </div>
                <div className="flex">
                    <SidebarRight />
                </div>
            </div>
        </div>
    )
}

export default PostPage
