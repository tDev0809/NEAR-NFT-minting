import { Alert, Button, Fade, Grow, IconButton, Slide, Snackbar } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

function TransitionSlideLeft(props) {
    return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props) {
    return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props) {
    return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props) {
    return <Slide {...props} direction="down" />;
}

function GrowTransition(props) {
    return <Grow {...props} />;
}

const animation = {
    SlideLeft: TransitionSlideLeft,
    SlideUp: TransitionSlideUp,
    SlideRight: TransitionSlideRight,
    SlideDown: TransitionSlideDown,
    Grow: GrowTransition,
    Fade
};

export const MUISnackbar = ({ data }) => {

    const [initialState, setInitialState] = useState({
        action: false,
        open: false,
        message: '123456789',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        variant: 'alert',
        alert: {
            color: 'primary',
            variant: 'filled'
        },
        transition: 'SlideLeft',
        close: true,
        actionButton: false
    });
    console.log(initialState)

    const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = initialState;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setInitialState({ ...initialState, open: false })
    };

    useEffect(() => {
        if (data) {
            const { openN, messageN, alertN } = data;
            let temp = initialState;
            temp.open = openN;
            temp.message = messageN;
            temp.alert = alertN;
            setInitialState(temp);
        }

    }, [data])

    return (
        <>
            {/* default snackbar */}
            {variant === 'default' && (
                <Snackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={message}
                    TransitionComponent={animation[transition]}
                    action={
                        <>
                            <Button color="secondary" size="small" onClick={handleClose}>
                                UNDO
                            </Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25 }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    }
                />
            )}

            {/* alert snackbar */}
            {variant === 'alert' && (
                <Snackbar
                    TransitionComponent={animation[transition]}
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        variant={alert.variant}
                        color={alert.color}
                        action={
                            <>
                                {actionButton !== false && (
                                    <Button size="small" onClick={handleClose} sx={{ color: 'background.paper' }}>
                                        UNDO
                                    </Button>
                                )}
                                {close !== false && (
                                    <IconButton sx={{ color: 'background.paper' }} size="small" aria-label="close" onClick={handleClose}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </>
                        }
                        sx={{
                            ...(alert.variant === 'outlined' && {
                                bgcolor: 'background.paper'
                            })
                        }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

export const openSnackbar = (message, color) => {
    let data = {
        open: true,
        message,
        alert: { color }
    }
    console.log(data)
    return (
        <MUISnackbar data={data} />
    )
}
