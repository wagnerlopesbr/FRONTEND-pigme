import { atomWithStorage } from 'jotai/utils';

const tokenAtom = atomWithStorage('token', '');
const userAtom = atomWithStorage('user', '');
const productsAtom = atomWithStorage('products', []);
const listsAtom = atomWithStorage('lists', []);

export { tokenAtom, userAtom, productsAtom, listsAtom };