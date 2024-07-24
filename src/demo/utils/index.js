import {userTypes} from '../contants';

export const saveVendorLoginInfo = (token, vendorId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('vendorId', vendorId);
    localStorage.setItem('userType', userTypes.vendor);
}

export const vendorLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vendorId');
    localStorage.removeItem('userType');
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const getVendorId = () => {
    return localStorage.getItem('vendorId');
}

export const getUserType = () => {
    return localStorage.getItem('userType');
}