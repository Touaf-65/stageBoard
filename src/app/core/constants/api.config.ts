export const API_CONFIG = {
    //BASE_URL: '',
    BASE_URL: 'http://172.18.0.4:5000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',

        },
        ENTREPRISE: {
            BASE: '/entreprise/',
        },
        ECHEANCE: {
            BASE: '/echeances/',

        },
        JOURNAL: {
            BASE: '/journal/',
        },
        PROFILE: {
            BASE: '/users/profile'
        }
    }

};