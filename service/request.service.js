import axios from "axios";
import {error} from "next/dist/build/output/log";
import Cookies from "js-cookie";

const url = "http://localhost:8080"

const RequestService = {

    signUp: async (signUpData) => {
        const response = await axios.post(`${url}/auth/signup`, signUpData)

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token)
            Cookies.set("jwt", response.data.token, {expires: 7})
        } else if (response.status === 409) {
            throw new error("Ya existe un usuario con el correo electronico")
        } else {
            throw new error(response.data.error)
        }
    },

    login: async (loginData) => {
        const response = await axios.post(`${url}/auth/login`, loginData)

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token)
            Cookies.set("jwt", response.data.token, {expires: 7})
        } else if (response.status === 400) {
            throw new error("Credenciales incorrectas.")
        } else if (response.status === 401) {
            throw new error("Credenciales incorrectas.")
        } else if (response.status === 500) {
            throw new error("Error. Intente mas tarde por favor")
        } else {
            throw new error(response.data.error)
        }

    },

    fetchComments: async (quizId) => {
        try {
            const response = await axios.get(`${url}/quiz/${quizId}/comment`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });

            if (response.status === 200) {
                return response.data        // devuelve la lista de comentarios
            }
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
        }
    },

    logComment: async (commentContent) => {
        const response = await axios.post(`${url}/comment`, commentContent,
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            }
        );

        if (response.status === 200) {
            return response.data
        }
    },

    likeComment: async (commentId) => {
        const response = await axios.post(
            `${url}/comment/${commentId}/like`,
            {},
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            }
        );
        if (response.status === 200) {
            return response.data;
        }

    },

    dislikeComment: async (commentId) => {
        const response = await axios.post(
            `${url}/comment/${commentId}/dislike`,
            {},
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            }
        );
        if (response.status === 200) {
            return response.data;
        }
    },

    removeLikeComment: async (commentId) => {
        const response = await axios.delete(
            `${url}/comment/${commentId}/removeLike`,
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            }
        );
        if (response.status === 200) {
            return response.data;
        }
    },

    editComment: async (id, newContent) => {
        try {
            const response = await axios.put(
                `${url}/comment/${id}`,
                {newContent: newContent},
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(error);
        }
    },

    deleteComment: async (id) => {
        try {
            const response = await axios.delete(`${url}/comment/${id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(error);
        }
    },

    getLabels: async () => {
        try {
            const response = await axios.get(`${url}/label`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });

            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(error);
        }

    },

    filterQuizzes: async (quizFilter, onlyFollowing) => {
        // Codificar los valores de los parámetros en la URL
        const response = await axios.get(
            `${url}/quiz`, {
                params: {...quizFilter, onlyFollowing: onlyFollowing},
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });

        if (response.status === 200) {
            return response.data;
        }
    },

    saveQuiz: async (quizId, saved) => {
        try {

            const response = await axios.put(`${url}/user/${!saved ? "save-quiz" : "remove-quiz"}/${quizId}`,
                {},
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });

            if (response.status === 200) {
                return response.data
            } else {
                throw new Error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    getSavedQuizzes: async () => {
        try {
            const response = await axios.get(`${url}/user/saved-quizzes`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });

            if (response.status === 200) {
                return response.data
            } else {
                throw new Error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    getQuiz: async (quizId) => {
        try {
            const response = await axios.get(`${url}/quiz/${quizId}`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });

            if (response.status === 200) {
                return response.data
            } else {
                throw new Error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    rateQuiz: async (quizId, rating) => {
        try {
            const response = await axios.post(
                `${url}/quiz/${quizId}/rate`,
                {rating},
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt'),
                    },
                }
            );
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            throw new Error("Hubo un error al calificar el quiz, por favor intenta más tarde");
        }
    },

    createQuiz: async (quizData) => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Token en el header
            },
        };
        const response = await axios.post(url + "/quiz", quizData, config);
        if (response.status === 200) {
            return response.data;
        } else throw new error()
    },

    getUserInformation: async (userId) => {
        try{
            const response = await axios.get(`${url}/user/${userId}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });
            if (response.status === 200) {
                return response.data
            }

        } catch (error) {
            throw error;
        }
    },

    getQualification: async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Token en el header
            },
        };
        const response = await axios.get(url + "/quiz/leaderboard/" + id, config);
        if (response.status === 200) {
            return response.data;
        }
        else throw new error()
    },

    deleteUser: async (userId) => {
        try {
            return await axios.delete(`${url}/user/${userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });
        } catch (error) {
            throw error;
        }
    },

    editUserInformation: async (id, userInfo) => {
        try {
            const response = await axios.put(
                `${url}/user/${id}`,
                {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    birthDate: userInfo.birthDate,
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            console.error(error);
        }
    },

    getPrivateQuiz: async (invitationCode) => {
        try {
            return await axios.get(
                url + "/quiz/private/" + invitationCode,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
        } catch (error) {
            console.log(error)
            return error
        }
    },

    passwordReset: async (mail) => {
        try {
            const response = await axios.post(
                `${url}/user/password-reset`,
                {
                    mail: mail,
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            return response.status;
        } catch (error) {
            return error.response.status;
        }
    },

    passwordUpdate: async (data) => {
        try {
            const response = await axios.put(
                `${url}/user/password-update`,
                {
                    newPassword: data.newPassword,
                    token: data.token
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
            return response.status;
        } catch (error) {
            return error.response.status;
        }
    },

    deleteQuiz: async (id) => {
        try {
            return await axios.delete(`${url}/quiz/${id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return error.response;
        }
    },
    followUser: async (id) => {
        try {
            const response = await axios.post(`${url}/user/follow/${id}`,
                {},
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });
        } catch (error) {
            console.error('Error al seguir el usuario:', error);
        }
    },

    unFollowUser: async (id) => {
        try {
            const response = await axios.delete(`${url}/user/unfollow/${id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('jwt')
                    }
                });
        } catch (error) {
            console.error('Error al seguir el usuario:', error);
        }
    },

    getUserFollowers: async (myId) => {
        try {
            const response = await axios.get(`${url}/user/${myId}/following`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });
            const followingList = response.data;
            return { followingList };
        } catch (error) {
            throw new Error("Error al verificar al obtener la lista de seguidos de un usuario.");
        }
    },

    isFollowing: async (id) => {
        try {
            const response = await axios.get(`${url}/user/isfollowing/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });
            const isFollowing = response.data;
            console.log(response.data)
            return {isFollowing};
        }catch (error) {
            throw new Error("Error al verificar si el usuario sigue a otro usuario.");
        }
    },

    getUserQuizzes: async (userId) => {
        try {
            const response = await axios.get(`${url}/quiz?userId=${userId}`,  {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('jwt')
                }
            });
            if (response.status === 200) {
                return response.data
            }
        }catch (error) {
            console.error('Error al obtener los quizzes del usuario:', error);
        }
    }
}

export const useRequestService = () => RequestService
