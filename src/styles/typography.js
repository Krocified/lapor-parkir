import { fonts } from "./fonts";

export const typography = {
  h1: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle1: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle2: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  body1: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
};
