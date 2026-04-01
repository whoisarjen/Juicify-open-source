import { trpc } from "@/utils/trpc.utils"
import { useRouter } from "next/router";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import useTranslation from 'next-translate/useTranslation';

export const LastJoinedUsersList = () => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const { data: users = [] } = trpc.user.getAll.useQuery({ take: 10 })

    return (
        <div className="flex flex-col max-w-xs">
            <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-500">
                    {t('LAST_JOINED')}:
                </div>
                <ul>
                    {(users as User[]).map(({ id, name, username, image }) =>
                        <button key={id} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => router.push(`/${username}`)}>
                            <span className="flex items-center">
                                <CustomAvatar
                                    src={image}
                                    username={username}
                                    size="28px"
                                    margin="auto auto auto 0"
                                />
                            </span>
                            <span>{name || '-'}</span>
                        </button>
                    )}
                </ul>
            </div>
        </div>
    )
}
