export const API_CONFIG = {
    // "/api" : servi par nginx en production, par proxy.conf.json avec ng serve en local
    BASE_URL: '/api',
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