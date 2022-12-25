import BetterLink from "@/components/BetterLink/BetterLink";
import moment from "moment";
import { useRouter } from "next/router";
import styled from 'styled-components'

const Box = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 47.5px 47.5px auto 47.5px 47.5px;
    grid-gap: 12px;
    margin: 12px 0;
    text-align: center;
    ${this} a {
        width: 100%;
        margin: auto;
    }
    ${this} div{
        width: calc( 100% - 16px );
        background: #f0f1f6;
        margin: auto;
        text-align: center;
        border-radius: 4px;
        padding: 11.75px 8px;
    }
    ${this} div:nth-child(3) {
        background: #333;
        color: #fff;
        padding: 20px 8px;
    }
`

const DateChangerFast = () => {
    const router: any = useRouter()

    return (
        <Box>
            <BetterLink
                href={`/${router.query.login}/consumed/${moment(router.query.date).add(-2, 'days').format('YYYY-MM-DD')}`}>
                <div>{moment(router.query.date).add(-2, 'days').format('DD')}</div>
            </BetterLink>
            <BetterLink
                href={`/${router.query.login}/consumed/${moment(router.query.date).add(-1, 'days').format('YYYY-MM-DD')}`}>
                <div>{moment(router.query.date).add(-1, 'days').format('DD')}</div>
            </BetterLink>
            <div>{moment(router.query.date).format('DD.MM.YYYY')}</div>
            <BetterLink
                href={`/${router.query.login}/consumed/${moment(router.query.date).add(1, 'days').format('YYYY-MM-DD')}`}>
                <div>{moment(router.query.date).add(1, 'days').format('DD')}</div>
            </BetterLink>
            <BetterLink
                href={`/${router.query.login}/consumed/${moment(router.query.date).add(2, 'days').format('YYYY-MM-DD')}`}>
                <div>{moment(router.query.date).add(2, 'days').format('DD')}</div>
            </BetterLink>
        </Box>
    )
}

export default DateChangerFast;