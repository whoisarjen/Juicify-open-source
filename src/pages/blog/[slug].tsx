import { range } from "lodash";
import Image from "next/image";
import SidebarRight from "src/layout/SidebarRight";
import styled from 'styled-components'

const Box = styled.div`
    position: relative;
    max-width: 1640px;
    margin-left: auto;
    margin-right: auto;
    padding: 12px 20px 0;
    ${this} img{
        margin: auto;
        display: block;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
        object-fit: cover;
        width: 100%;
    }
`

const ContentBox = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
`

const Content = styled.div`
    width: 100%;
    max-width: 870px;
`

const { title, img_url, content } = {
    title: 'The Witcher: Ronin has arrived on Kickstarter!',
    content: `The Witcher: Ronin is an original comic, created and published by CD PROJEKT RED, which translates the dark fantasy world of The Witcher into a feudal Japanese setting. The story focuses on monster slayer Geralt, who must venture across Yokai - infested lands while attempting to track down the mysterious Lady of Snow Yuki Onna.`,
    img_url: '/images/witcher.jpg'
}

const PostPage = () => {
    return (
        <Box>
            <Image src={img_url} alt="Juicify" width="970" height="545" />
            <ContentBox>
                <Content>
                    <h1>{title}</h1>
                    {range(5).map(x => <p key={x}>{content}</p>)}
                    <h2>asddassadasasas</h2>
                    {range(5).map(x => <p key={x}>{content}</p>)}
                    <h3>zxcxzcxzczxzcx</h3>
                    {range(5).map(x => <p key={x}>{content}</p>)}
                    <h2>asddassadasasas</h2>
                    {range(5).map(x => <p key={x}>{content}</p>)}
                </Content>
                <SidebarRight />
            </ContentBox>
        </Box>
    )
};

export default PostPage;