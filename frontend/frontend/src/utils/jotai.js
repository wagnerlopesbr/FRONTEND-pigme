import { atomWithStorage } from 'jotai/utils';

const tokenAtom = atomWithStorage('token', '');
const userAtom = atomWithStorage('user', '');
const productsAtom = atomWithStorage('products', []);

export { tokenAtom, userAtom, productsAtom };