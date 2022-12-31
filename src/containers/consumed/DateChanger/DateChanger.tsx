import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import EventIcon from '@mui/icons-material/Event';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useState } from "react";
import CalendarPicker from '@mui/lab/CalendarPicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import SlideUp from '../../../transition/SlideUp';

const DateChanger = ({ where = 'consumed' }: { where?: string }) => {
    const router = useRouter()
    const [isDialog, setIsDialog] = useState(false)
    const [value, setValue] = useState<Date>(new Date());

    const handleDateChange = () => {
        setIsDialog(false);
        router.push(`/${router.query.login}/${where}/${new Date(value).toJSON().slice(0, 10)}`)
    };

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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CalendarPicker date={value} onChange={(newDate: any) => setValue(newDate || new Date())} />
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