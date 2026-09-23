import { UserProfile } from '../types';

export const SYSTEM_USERS: UserProfile[] = [
  {
    id: 'user-admin-ashwin',
    name: 'Ashwin R.',
    username: 'admin',
    role: 'admin',
    email: 'ashwin.r@amnex.com',
    organization: 'Amnex Infotechnologies / NMDC Security Control',
    designation: 'NMDC Project Lead & System Admin'
  },
  {
    id: 'user-standard-operator',
    name: 'Gate Operator / User',
    username: 'user',
    role: 'user',
    email: 'user@nmdc.co.in',
    organization: 'NMDC Donimalai / CISF Access Control Unit',
    designation: 'Authorized Pass Verifier & Viewer'
  }
];

const CURRENT_USER_KEY = 'amnex_nmdc_active_user_id';

export function getActiveUserProfile(): UserProfile {
  try {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    const found = SYSTEM_USERS.find(u => u.username === savedId || u.id === savedId);
    if (found) return found;
  } catch (e) {
    // fallback
  }
  return SYSTEM_USERS[0];
}

export function setActiveUserProfile(userIdOrUsername: string): UserProfile {
  const found = SYSTEM_USERS.find(u => u.username === userIdOrUsername || u.id === userIdOrUsername) || SYSTEM_USERS[0];
  try {
    localStorage.setItem(CURRENT_USER_KEY, found.username);
  } catch (e) {
    // ignore
  }
  return found;
}
