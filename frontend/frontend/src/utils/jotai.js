import { atomWithStorage } from 'jotai/utils';

const tokenAtom = atomWithStorage('token', '');
const userAtom = atomWithStorage('user', '');

export { tokenAtom, userAtom };