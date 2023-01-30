import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/Link';
import styled from 'styled-components'
import ButtonShare from '../../../components/ButtonShare/ButtonShare';
import CustomAvatar from '../../../components/CustomAvatar/CustomAvatar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProfileTabs from '../ProfileTabs/ProfileTabs';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc.utils'

const Box = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 130px auto;
`

const AvatarBox = styled.div`
    width: 120px;
    height: 120px;
    margin: 12px auto;
    border: 1px solid #e4e4e4;
    border-radius: 50%;
    display: grid;
`

const Content = styled.div`
    width: calc( 100% - 20px );
    padding: 10px;
    display: grid;
    grid-template-rows: auto auto auto auto;
    ${this} div:nth-child(1){
        display: grid;
        grid-template-columns: auto 40px 40px;
        width: 100%;
        margin: auto;
    }
    ${this} div:nth-child(2){
        font-weight: bold;
    }
`

const NavbarProfile = ({ tab }: { tab: number }) => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login || ''
    const isOwner = username === sessionData?.user?.username

    const {
        data,
    } = trpc
        .user
        .getByUsername
        .useQuery({ username }, { enabled: !!username && !isOwner })

    const user = isOwner ? sessionData?.user : data

    return (
        <>
            <Box>
                <AvatarBox>
                    <CustomAvatar
                        src={user?.image}
                        username={user?.username}
                    />
                </AvatarBox>
                <Content>
                    <div>
                        <h2>{user?.name || '-'}</h2> {/* TODO after making possible to change username, it should show username */}
                        {isOwner ?
                            <>
                                <ButtonShare />
                                <IconButton onClick={() => router.push('/settings')} sx={{ margin: 'auto' }} aria-label="settings" color="primary">
                                    <SettingsIcon />
                                </IconButton>
                            </>
                            :
                            <>
                                <div />
                                <ButtonShare />
                            </>
                        }
                    </div>
                    {/* <div>{user?.firstName} {user?.lastName}</div> */}
                    <div>{user?.description}</div>
                    <div>
                        {user?.facebook &&
                            <IconButton
                                onClick={() => window.open(`https://facebook.com/${user?.facebook}`, '_blank')}
                                color="primary"
                            >
                                <FacebookIcon />
                            </IconButton>
                        }
                        {user?.instagram &&
                            <IconButton
                                onClick={() => window.open(`https://instagram.com/${user?.instagram}`, '_blank')}
                                color="primary"
                            >
                                <InstagramIcon />
                            </IconButton>
                        }
                        {user?.twitter &&
                            <IconButton
                                onClick={() => window.open(`https://twitter.com/${user?.twitter}`, '_blank')}
                                color="primary"
                            >
                                <TwitterIcon />
                            </IconButton>
                        }
                        {user?.website &&
                            <IconButton
                                onClick={() => window.open(`${user?.website}`, '_blank')}
                                color="primary"
                            >
                                <LinkIcon />
                            </IconButton>
                        }
                    </div>
                </Content>
            </Box>
            <ProfileTabs tab={tab} />
        </>
    )
}

export default NavbarProfile;