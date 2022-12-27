import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BookIcon from "@mui/icons-material/Book";
import styled from 'styled-components'
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import BetterLink from "@/components/BetterLink/BetterLink";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import moment from "moment";
import IconButton from '@mui/material/IconButton';
import { useSession } from "next-auth/react";

const Box = styled.footer`
    width: 100%;
    min-height: 43px;
    line-height: 43px;
    text-align: center;
`

const Menu = styled.nav`
    height: 44px;
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%),
    0 1px 10px 0 rgb(0 0 0 / 12%);
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    z-index: 999;
    background: var(--theme-background);
    position: fixed;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    @media(min-width: 1468px) {
        display: none;
    }
`

const Copyright = styled.p`
    margin: 0;
`

const Footer = () => {
    const { data: sessionData } = useSession()

    return (
        <Box>
            {sessionData?.user?.username
                ? <Menu>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href="/coach">
                        <IconButton color="primary">
                            <SmartToyIcon color="primary" />
                        </IconButton>
                    </BetterLink>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href={`/${sessionData?.user?.username}/workout`}>
                        <IconButton color="primary">
                            <FitnessCenterIcon color="primary" />
                        </IconButton>
                    </BetterLink>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href="/measurements">
                        <IconButton color="primary">
                            <EmojiEventsIcon color="primary" />
                        </IconButton>
                    </BetterLink>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href="/barcode">
                        <IconButton color="primary">
                            <PhotoCameraIcon color="primary" />
                        </IconButton>
                    </BetterLink>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href={`/${sessionData?.user?.username}/consumed/${moment().format('YYYY-MM-DD')}`}>
                        <IconButton color="primary">
                            <BookIcon color="primary" />
                        </IconButton>
                    </BetterLink>
                    <BetterLink style={{ margin: 'auto', display: 'grid' }} href={`/${sessionData?.user?.username}`}>
                        <IconButton color="primary">
                            <CustomAvatar
                                src={sessionData?.user?.image}
                                username={sessionData?.user?.username}
                                size="28px"
                            />
                        </IconButton>
                    </BetterLink>
                </Menu>
                : <Copyright>©2022 Juicify.app</Copyright>
            }
        </Box>
    );
};

export default Footer;
