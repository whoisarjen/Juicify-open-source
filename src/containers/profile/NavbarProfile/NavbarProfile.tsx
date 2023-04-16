import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkIcon from '@mui/icons-material/Link'
import ButtonShare from '../../../components/ButtonShare/ButtonShare'
import CustomAvatar from '../../../components/CustomAvatar/CustomAvatar'
import { useRouter } from 'next/router'
import ProfileTabs from '../ProfileTabs/ProfileTabs'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc.utils'

const NavbarProfile = ({ tab }: { tab: number }) => {
    const router: any = useRouter()
    const { data: sessionData } = useSession()

    const username = router.query.login || ''
    const isOwner = username === sessionData?.user?.username

    const { data } = trpc.user.getByUsername.useQuery(
        { username },
        { enabled: !!username && !isOwner }
    )

    const user = isOwner ? sessionData?.user : data

    return (
        <>
            <div className="flex gap-3">
                <div className="flex h-32 w-32 items-center justify-center rounded-full">
                    <CustomAvatar src={user?.image} username={user?.username} />
                </div>
                <div className="flex w-full">
                    <div className="flex flex-1">
                        <div className="flex flex-1">
                            <h2 className="text-2xl font-bold">{user?.name || '-'}</h2>
                        </div>
                        {/* TODO after making possible to change username, it should show username */}
                        <div className="flex flex-row">
                            {isOwner ? (
                                <>
                                    <ButtonShare />
                                    <div>
                                        <IconButton
                                            onClick={() =>
                                                router.push('/settings')
                                            }
                                            aria-label="settings"
                                            color="primary"
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                    </div>
                                </>
                            ) : (
                                <ButtonShare />
                            )}
                        </div>
                    </div>
                    {/* <div>{user?.firstName} {user?.lastName}</div> */}
                    <div>{user?.description}</div>
                    <div>
                        {user?.facebook && (
                            <IconButton
                                onClick={() =>
                                    window.open(
                                        `https://facebook.com/${user?.facebook}`,
                                        '_blank'
                                    )
                                }
                                color="primary"
                            >
                                <FacebookIcon />
                            </IconButton>
                        )}
                        {user?.instagram && (
                            <IconButton
                                onClick={() =>
                                    window.open(
                                        `https://instagram.com/${user?.instagram}`,
                                        '_blank'
                                    )
                                }
                                color="primary"
                            >
                                <InstagramIcon />
                            </IconButton>
                        )}
                        {user?.twitter && (
                            <IconButton
                                onClick={() =>
                                    window.open(
                                        `https://twitter.com/${user?.twitter}`,
                                        '_blank'
                                    )
                                }
                                color="primary"
                            >
                                <TwitterIcon />
                            </IconButton>
                        )}
                        {user?.website && (
                            <IconButton
                                onClick={() =>
                                    window.open(`${user?.website}`, '_blank')
                                }
                                color="primary"
                            >
                                <LinkIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
            <ProfileTabs tab={tab} />
        </>
    )
}

export default NavbarProfile
