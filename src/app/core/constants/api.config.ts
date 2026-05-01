export const API_CONFIG = {
    //BASE_URL: '',
    BASE_URL: 'http://0.0.0.0:5000/',
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