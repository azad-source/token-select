import { ThemeFactory, THEME_2022_UPDATE_2024 } from '@skbkontur/react-ui';
import { AddonsTheme } from '@skbkontur/react-ui-addons';
import { DefaultTheme } from '@skbkontur/react-ui/internal/themes/DefaultTheme';
import { SideMenuTheme } from '@skbkontur/side-menu';
import { colors } from './variables';

type ThemeType = Partial<DefaultTheme & AddonsTheme & SideMenuTheme>;

const CHECKBOX_THEME: Partial<AddonsTheme> = {
  checkboxCheckedBg: colors.serviceColor,
  checkboxCheckedHoverBg: colors.serviceColorHover,
  radioCheckedBgColor: colors.serviceColor,
  radioBgColor: '#fff',
  radioHoverBg: colors.grayscaleMediumBg,
  radioCheckedHoverBgColor: colors.serviceColorHover,
};

const BUTTON_THEME: Partial<AddonsTheme> = {
  // default button
  btnDefaultHoverBg: colors.serviceSecondColorHover,
  btnDefaultHoverBorderColor: colors.serviceSecondColorActive,
  btnDefaultActiveBg: colors.serviceSecondColorActive,
  btnDefaultActiveBorderColor: colors.serviceSecondColorDisabled,

  // primary button
  btnPrimaryBg: colors.serviceColor,
  btnPrimaryHoverBg: colors.serviceColorHover,
  btnPrimaryActiveBg: colors.serviceColorActive,
  btnPrimaryBorderColor: colors.serviceColorBg,
  btnPrimaryHoverBorderColor: colors.serviceColorHover,
  btnPrimaryActiveBorderColor: colors.serviceColorActive,
  btnTextHoverBg: colors.serviceSecondColorHover,
  btnTextActiveBg: colors.serviceSecondColorActive,
};

const SIDE_MENU_THEME: Partial<SideMenuTheme> = {
  sideMenuBgColor: '#fff',
  sideMenuBoxShadow: '0 4px 40px 0 rgba(0, 0, 0, 0.06)',
  sideMenuItemActiveBg: colors.serviceColorBg,
  sideMenuItemHoverBg: colors.serviceColorBg,
  sideMenuItemContentPaddingY: '8px',
  sideMenuHeaderPaddingBottom: '16px',
};

const TOKEN_THEME: Partial<AddonsTheme> = {
  tokenBorderWidth: '0',
  tokenBorderRadius: '20px',
  tokenPaddingXMedium: '8px',
  tokenDefaultIdleBg: '#fff',
  tokenDefaultIdleBgHover: '#fff',
};

const OTHER_THEME: Partial<AddonsTheme> = {
  borderColorFocus: colors.serviceColor,
};

const CUSTOM_THEME: ThemeType = {
  ...BUTTON_THEME,
  ...CHECKBOX_THEME,
  ...SIDE_MENU_THEME,
  ...TOKEN_THEME,
  ...OTHER_THEME,
};

export function createTheme(theme?: ThemeType) {
  return ThemeFactory.create(
    { ...CUSTOM_THEME, ...theme, sideMenuProductColor: '' },
    THEME_2022_UPDATE_2024
  );
}

export default createTheme();
