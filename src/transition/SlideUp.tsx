import { TransitionProps } from "@mui/material/transitions"
import { forwardRef, ReactElement, Ref } from "react"
import Slide from '@mui/material/Slide';

const SlideUp = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default SlideUp;