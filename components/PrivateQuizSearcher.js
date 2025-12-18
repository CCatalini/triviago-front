import React, {useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {Card, IconButton, InputAdornment, Slide, Snackbar, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useRequestService} from "@/service/request.service";
import {useRouter} from "next/navigation";
import {Alert} from "@mui/lab";

const PrivateQuizSearcher = () => {
    const service = useRequestService()
    const router = useRouter()
    const [invitationCode, setInvitationCode] = useState('')
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')

    const search = () => {
        service.getPrivateQuiz(invitationCode)
            .then((r) => {
                if (r.status === 200) {
                    router.push(`/quiz/${r.data.id}/details`)
                } else if (r.response.status === 404) {
                    setMessage('No se encontró un quiz con el código proporcionado')
                    setOpen(true)
                } else {
                    setMessage('Hubo un error al buscar el quiz, intente más tarde')
                    setOpen(true)
                }
            })
            .catch((e) => {
                if (e.response.status === 404) {
                    setMessage('No se encontró un quiz con el código proporcionado')
                } else {
                    setMessage('Hubo un error al buscar el quiz, intente más tarde')
                }
                setOpen(true)
            })
    }

    return (
        <Card style={{padding: '16px'}}>
            <Typography style={{marginBottom: '8px', fontWeight: 'bold'}}>Código de invitación</Typography>
            <TextField
                onChange={(e) => setInvitationCode(e.target.value)}
                value={invitationCode}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={search}
                                disabled={invitationCode === ''}
                            >
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={() => setOpen(false)}
                TransitionComponent={Slide}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={() => setOpen(false)} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default PrivateQuizSearcher;
