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
            <button className="rounded-full p-2 hover:bg-[rgba(255,255,255,0.04)] transition-all" onClick={() => setIsDialog(true)}>
                <CalendarDays size={20} className="text-primary-dark" />
            </button>
            {isDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDialog(false)} />
                    <div className="relative z-[100] w-full max-w-sm glass p-6 mx-4">
                        <input
                            type="date"
                            className="w-full rounded-xl border border-glass-border bg-glass px-4 py-3 text-sm outline-none focus:border-glass-border-accent text-white"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="px-4 py-2 text-sm text-[#7a7a7a] rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-all" onClick={() => setIsDialog(false)}>Close</button>
                            <button className="px-4 py-2 text-sm font-bold text-primary-dark rounded-lg bg-[rgba(144,202,249,0.08)] hover:bg-[rgba(144,202,249,0.15)] transition-all" onClick={handleDateChange}>Agree</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DateChanger
