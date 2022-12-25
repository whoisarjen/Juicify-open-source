import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/Link';
import styled from 'styled-components'
import ButtonShare from '../../../components/ButtonShare/ButtonShare';
import CustomAvatar from '../../../components/CustomAvatar/CustomAvatar';
import { useAppSelector } from '@/hooks/useRedux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProfileTabs from '../ProfileTabs/ProfileTabs';
import { useUserByUsernameQuery } from '@/generated/graphql';

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
    const token = useAppSelector(state => state.token)
    const [{ data }, getUserByUsername] = useUserByUsernameQuery({
        variables: {
            username: router?.query?.login,
        },
        pause: true,
    })

    useEffect(() => {
        router?.query?.login && getUserByUsername()
    }, [router?.query?.login])

    return (
        <>
            {
                data?.userByUsername?.username &&
                <>
                    <Box>
                        <AvatarBox>
                            <CustomAvatar
                                id={data?.userByUsername?.id}
                                username={data?.userByUsername?.username}
                            />
                        </AvatarBox>
                        <Content>
                            <div>
                                <h2>{data?.userByUsername?.username}</h2>
                                {
                                    data?.userByUsername?.username == token.username ?
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
                            <div>{data?.userByUsername?.firstName} {data?.userByUsername?.lastName}</div>
                            <div>{data?.userByUsername?.description}</div>
                            <div>
                                {data?.userByUsername?.facebook &&
                                    <IconButton
                                        onClick={() => window.open(`https://facebook.com/${data?.userByUsername?.facebook}`, '_blank')}
                                        color="primary"
                                    >
                                        <FacebookIcon />
                                    </IconButton>
                                }
                                {data?.userByUsername?.instagram &&
                                    <IconButton
                                        onClick={() => window.open(`https://instagram.com/${data?.userByUsername?.instagram}`, '_blank')}
                                        color="primary"
                                    >
                                        <InstagramIcon />
                                    </IconButton>
                                }
                                {data?.userByUsername?.twitter &&
                                    <IconButton
                                        onClick={() => window.open(`https://twitter.com/${data?.userByUsername?.twitter}`, '_blank')}
                                        color="primary"
                                    >
                                        <TwitterIcon />
                                    </IconButton>
                                }
                                {data?.userByUsername?.website &&
                                    <IconButton
                                        onClick={() => window.open(`${data?.userByUsername?.website}`, '_blank')}
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
            }
        </>
    )
}

export default NavbarProfile;