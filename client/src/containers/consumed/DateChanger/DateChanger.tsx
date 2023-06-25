import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { useRouter } from "next/router"
import EventIcon from '@mui/icons-material/Event'
import IconButton from '@mui/material/IconButton'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useState } from "react"
import { CalendarPicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import SlideUp from '@/transition/SlideUp'
import moment from 'moment'

const DateChanger = ({ where = 'consumed' }: { where?: string }) => {
    const router = useRouter()
    const [isDialog, setIsDialog] = useState(false)
    const [value, setValue] = useState(moment().toDate())

    const handleDateChange = () => {
        setIsDialog(false)
        router.push(`/${router.query.login}/${where}/${moment(value).format('YYYY-MM-DD')}`)
    }

    return (
        <>
            <IconButton onClick={() => setIsDialog(true)}>
                <EventIcon color="primary" />
            </IconButton>
            <Dialog
                open={isDialog}
                TransitionComponent={SlideUp}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <CalendarPicker
                            date={moment(value)}
                            onChange={newDate => setValue(moment(newDate || moment()).toDate())}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialog(false)}>Close</Button>
                    <Button onClick={handleDateChange}>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DateChanger