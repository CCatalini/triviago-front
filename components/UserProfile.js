'use client'
import React, {useEffect, useState} from 'react';
import styles from '../styles/UserProfile.module.css';
import DeleteAccountModal from './DeleteAccountModal';
import {useRequestService} from "@/service/request.service";
import EditIcon from "@mui/icons-material/Edit";
import {Button, Card, IconButton, Slide, Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import 'dayjs/locale/en-gb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserProfile = ({
                         firstName,
                         lastName,
                         email,
                         birthDate,
                         createdAt,
                         isCurrentUser,
                         userId,
                     }) => {

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const service = useRequestService();
    const [isFollowing, setIsFollowing] = useState(false);
    const id = window.location.pathname.split('/').slice(-2, -1)[0];


    useEffect(() => {
        service.isFollowing(id)
            .then(user => {
                setIsFollowing(user.isFollowing);
            })
            .catch(error => {
                console.error("Error al verificar si el usuario sigue a otro usuario:", error);
            });
    }, [userId, id]);


    const onDeleteClick = () => {
        setShowDeleteAccountModal(true);
    };

    const onFollowClick = () => {
        service.followUser(id)
            .then(response => {
                setMessage("Se siguió al usuario correctamente");
                setSeverity("success");
                setOpen(true)
                setIsFollowing(true);
            })
            .catch(error => {
                console.error(`Error al seguir al usuario con ID ${id}: ${error.message}`);
            });
    };

    const [isEditingName, setIsEditingName] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({firstName: "", lastName: "", birthDate: ""});
    const [info, setInfo] = useState({firstName: firstName, lastName: lastName, birthDate: birthDate.join('-')});

    const onUnfollowClick = () => {
        service.unFollowUser(id)
            .then(response => {
                setMessage("Se dejo de seguir al usuario correctamente");
                setSeverity("success");
                setOpen(true);
                setIsFollowing(false);

            })
            .catch(error => {
                console.error(`Error al dejar de seguir al usuario con ID ${id}: ${error.message}`);
            });
    }
    const [isEditingBirthDate, setIsEditingBirthDate] = useState(false);

    // Snackbar related variables
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");

    useEffect(() => {
        setInfo({
            firstName: firstName,
            lastName: lastName,
            birthDate: formatBirthDate(birthDate)
        })
    }, [])

    const parseCreatedAccountDate = (date) => {
        const day = date[2];
        const month = date[1];
        const year = date[0];

        const dayNumber = parseInt(day, 10);

        const parsedDate = new Date(`${year}-${month}-${dayNumber}`);

        const monthNames = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const monthName = monthNames[parsedDate.getMonth()];

        return dayNumber + " de " + monthName + " del " + year;
    }

    const formatBirthDate = (dateArray) => {
        const year = dateArray[0].toString();
        const month = dateArray[1].toString().padStart(2, '0');
        const day = dateArray[2].toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const showDate = (birthDate) => {
        const dateArray = birthDate.split('-')

        const year = dateArray[0]
        const month = dateArray[1]
        const day = dateArray[2]

        return `${month}/${day}/${year}`;
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Card className={styles.userInfoContainer}>
            <AccountCircleIcon style={{ fontSize: 156, color: '#667085' }}/>
            <div>
                <Typography
                    className={styles.userText}
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        color: "#000",
                        fontFamily: "sans-serif",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                >
                    {email}
                </Typography>
                {isEditingName
                    ? <div>
                        <div style={{display: 'flex'}}>
                            <input
                                type="text"
                                value={updatedInfo.firstName}
                                onChange={(e) => setUpdatedInfo({...updatedInfo, firstName: e.target.value})}
                                className={styles.editInput}
                                style={{maxWidth: "200px", width: "100%"}}
                                placeholder="Introducir nombre:"
                            />
                            <Box width={8}/>
                            <input
                                type="text"
                                value={updatedInfo.lastName}
                                onChange={(e) => setUpdatedInfo({...updatedInfo, lastName: e.target.value})}
                                className={styles.editInput}
                                style={{maxWidth: "200px", width: "100%"}}
                                placeholder="Introducir apellido:"
                            />
                        </div>
                        <div style={{height: '32px', display: 'flex', flexDirection: 'row', marginTop: '8px'}}>
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditingName(false)}
                                className={styles.cancelButton}
                                style={{color: '#000', borderColor: '#000'}}
                            >
                                Cancelar
                            </Button>
                            <Box width={8}/>
                            <Button
                                variant="contained"
                                className={styles.saveButton}
                                // disabled={updatedInfo.firstName.trim() === '' || updatedInfo.lastName.trim() === '' }
                                onClick={() => {
                                    if (updatedInfo.firstName.trim() === '') {
                                        setMessage("No se puede dejar el nombre vacío");
                                        setSeverity("error");
                                        setOpen(true);
                                        return;
                                    }
                                    if (updatedInfo.lastName.trim() === '') {
                                        setMessage("No se puede dejar el apellido vacío");
                                        setSeverity("error");
                                        setOpen(true);
                                        return;
                                    }
                                    if (updatedInfo.firstName.length >= 255) {
                                        setMessage("No se puede agregar un nombre con más de 255 caracteres");
                                        setSeverity("error");
                                        setOpen(true);
                                        return;
                                    }
                                    if (updatedInfo.lastName.length >= 255) {
                                        setMessage("No se puede agregar un apellido con más de 255 caracteres");
                                        setSeverity("error");
                                        setOpen(true);
                                        return;
                                    }

                                    const userId = window.location.pathname.split('/')[2]
                                    service.editUserInformation(userId, updatedInfo).then(() => {
                                        setInfo(updatedInfo)
                                        setIsEditingName(false)
                                        setMessage("Se modifico el nombre correctamente");
                                        setSeverity("success");
                                        setOpen(true);
                                    }).catch(error => {
                                        setIsEditingName(false)
                                        setMessage("Error modificando el nombre");
                                        setSeverity("error");
                                        setOpen(true);
                                        console.error("Error editing info:", error);
                                    });
                                }}
                                style={{color: '#FFF', backgroundColor: '#00CC66'}}
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                    : <div className={styles.userInfoEditableContainer} style={{maxWidth: '400px'}}>
                        <Typography
                            className={styles.userText}
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "2",
                                WebkitBoxOrient: "vertical",
                                color: "#000",
                                fontFamily: "sans-serif",
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                            }}
                        >
                            {info.firstName + ' ' + info.lastName}
                        </Typography>
                        {isCurrentUser &&
                            <IconButton
                                aria-label="Editar nombre"
                                color="#667085;"
                                // sx={{position: 'relative', zIndex: 0}}
                                onClick={() => {
                                    setIsEditingName(true)
                                    setUpdatedInfo({
                                        firstName: info.firstName,
                                        lastName: info.lastName,
                                        birthDate: info.birthDate
                                    })
                                }}
                            >
                                <EditIcon/>
                            </IconButton>
                        }
                    </div>
                }

                {isEditingBirthDate ? (
                    <div className={styles.labelContainer}>
                        <input
                            id="date"
                            type="date"
                            value={updatedInfo.birthDate}
                            className={styles.inputCalendar}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setUpdatedInfo({...updatedInfo, birthDate: e.target.value})}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                        <div style={{height: '32px', display: 'flex', flexDirection: 'row', marginTop: '8px'}}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setIsEditingBirthDate(false);
                                }}
                                className={styles.cancelButton}
                                style={{color: '#000', borderColor: '#000'}}
                            >
                                Cancelar
                            </Button>
                            <Box width={8}/>
                            <Button
                                variant="contained"
                                className={styles.saveButton}
                                disabled={updatedInfo.birthDate.toString().trim() === ''}
                                onClick={() => {
                                    const currentDate = new Date();
                                    const userBirthDate = new Date(updatedInfo.birthDate);
                                    let age = currentDate.getFullYear() - userBirthDate.getFullYear();
                                    const monthDiff = currentDate.getMonth() - userBirthDate.getMonth();
                                    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < userBirthDate.getDate())) {
                                        age--;
                                    }
                                    if (age < 6) {
                                        setMessage("Debes tener 6 años o más para ser un usuario de esta página");
                                        setSeverity("error");
                                        setOpen(true);
                                        return;
                                    }

                                    const userId = window.location.pathname.split('/')[2]
                                    service.editUserInformation(userId, updatedInfo).then((response) => {
                                        setInfo(updatedInfo)
                                        setIsEditingBirthDate(false)
                                        setMessage("Se actualizó exitosamente la fecha de nacimiento");
                                        setSeverity("success");
                                        setOpen(true);
                                    }).catch(error => {
                                        setIsEditingBirthDate(false)
                                        setMessage("Hubo un error al actualizar la fecha de nacimienot");
                                        setSeverity("error");
                                        setOpen(true);
                                        console.error("Error editing info:", error);
                                    });
                                }}
                                style={{color: '#FFF', backgroundColor: '#00CC66'}}
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.userInfoEditableContainer}>
                        {/*<Typography className={styles.userInfoSubtitle}>{info.birthDate.split('-').reverse().join('/')}</Typography>*/}
                        <Typography className={styles.userInfoSubtitle} style={{
                            color: "#000",
                            fontFamily: "sans-serif",
                            fontSize: "18px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal"
                        }}> {showDate(info.birthDate)}</Typography>
                        {isCurrentUser &&
                            <IconButton
                                aria-label="Editar fecha de nacimiento"
                                color="#667085;"
                                // sx={{position: 'relative', zIndEex: 0}}
                                onClick={() => {
                                    setIsEditingBirthDate(true);
                                    setUpdatedInfo({
                                        firstName: info.firstName,
                                        lastName: info.lastName,
                                        birthDate: info.birthDate
                                    });
                                }}
                            >
                                <EditIcon/>
                            </IconButton>
                        }
                    </div>
                )}
                <Typography className={styles.userInfoSubtitle} style={{
                    marginTop: '8px', color: "#000",
                    fontFamily: "sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                }}>{`Miembro desde el ${parseCreatedAccountDate(createdAt)}`}</Typography>
            </div>
            <div>
                {isCurrentUser ? (
                    <>
                        <Button
                            variant="contained"
                            onClick={onDeleteClick}
                            className={styles.userActionDeleteButton}
                            style={{color: '#FFF', backgroundColor: '#EA0E0E', width: '175px'}}
                            // style={{width: '150px'}}
                            // color={'error'}
                        >
                            Eliminar cuenta
                        </Button>
                        {
                            showDeleteAccountModal &&
                            <div className={styles.modalBackdrop}>
                                <DeleteAccountModal
                                    onClose={() => setShowDeleteAccountModal(false)}
                                    isOpen={showDeleteAccountModal}
                                    showSnackbar={(message, severity) => {
                                        setSeverity(severity)
                                        setMessage(message);
                                        setOpen(true);
                                    }}
                                    userId={userId}
                                />
                            </div>
                        }
                    </>
                ) : (
                    isFollowing === undefined
                        ? <></>
                        : isFollowing
                            ?
                            <button onClick={onUnfollowClick} className={styles.userActionFollowButton}>
                                Dejar de seguir
                            </button>
                            :
                            <button onClick={onFollowClick} className={styles.userActionFollowButton}>
                                Seguir
                            </button>
                )}
            </div>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                TransitionComponent={Slide}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default UserProfile;
