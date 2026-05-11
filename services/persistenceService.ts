import { VideoState } from '../types';

const STORAGE_KEY = 'vision_editor_project_data';
// A dummy key for demonstration purposes; in a real app, this should be derived securely.
const ENCRYPTION_KEY = 'super-secret-key-that-should-not-be-hardcoded'; 

// Simple XOR encryption for demonstration; do NOT use for actual sensitive data in production.
const encrypt = (data: string): string => {
    return btoa(data.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join(''));
};

const decrypt = (data: string): string => {
    const raw = atob(data);
    return raw.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
};

export const saveProjectData = (state: VideoState): void => {
    try {
        const { history, ...stateToSave } = state;
        const json = JSON.stringify(stateToSave);
        const encrypted = encrypt(json);
        localStorage.setItem(STORAGE_KEY, encrypted);
        console.log('Project data secured and saved.');
    } catch (error) {
        console.error('Failed to save project:', error);
    }
};

export const loadProjectData = (): VideoState | null => {
    try {
        const encrypted = localStorage.getItem(STORAGE_KEY);
        if (!encrypted) return null;
        const decryptedJson = decrypt(encrypted);
        return JSON.parse(decryptedJson) as VideoState;
    } catch (error) {
        console.error('Failed to load project:', error);
        return null;
    }
};
