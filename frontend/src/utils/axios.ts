//'use server';
import axios from 'axios';

import { getFingerprint } from './getFingerprint';

const baseURL = '/api/proxy';
const { fingerprint } = getFingerprint();

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Fingerprint': fingerprint,
  },
  withCredentials: true,
});
export default axiosClient;
