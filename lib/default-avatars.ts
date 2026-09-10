const DICEBEAR_ADVENTURER_URL = 'https://api.dicebear.com/10.x/adventurer/svg';
const DICEBEAR_BACKGROUND_COLOR = 'ece7de';
const DICEBEAR_HAIR_COLORS = '6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58';

export const generateDefaultAvatar = (seed: string) =>
  `${DICEBEAR_ADVENTURER_URL}?seed=${encodeURIComponent(seed)}&backgroundColor=${DICEBEAR_BACKGROUND_COLOR}&hairColor=${DICEBEAR_HAIR_COLORS}`
