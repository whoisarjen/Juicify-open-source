import { useRouter } from "next/router"
import { CalendarDays } from 'lucide-react'
import { useState } from "react"

import moment from 'moment'

const DateChanger = ({ where = 'consumed' }: { where?: string }) => {
    const router = useRouter()
    const [isDialog, setIsDialog] = useState(false)
    const [value, setValue] = useState(moment().format('YYYY-MM-DD'))

    const handleDateChange = () => {
        setIsDialog(false)
        router.push(`/${router.query.login}/${where}/${value}`)
    }

    return (
        <>
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsDialog(true)}>
                <CalendarDays className="text-[#90caf9]" />
            </button>
            {isDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsDialog(false)} />
                    <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-0 shadow-xl dark:bg-gray-900">
                        <div className="px-6 py-4">
                            <input
                                type="date"
                                className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={() => setIsDialog(false)}>Close</button>
                            <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800" onClick={handleDateChange}>Agree</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DateChanger
