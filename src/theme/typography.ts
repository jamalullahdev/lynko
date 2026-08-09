import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: { [key: string]: TextStyle } = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  subhead: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
};
