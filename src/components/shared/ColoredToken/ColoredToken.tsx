import { ThemeContext, Token, TokenProps } from '@skbkontur/react-ui';
import { createTheme } from 'theme';
import { colors } from 'variables';
import styles from './ColoredToken.module.scss';
import cx from 'clsx';
import React from 'react';

export type TokenColorScheme = 'blueDark' | 'orange' | 'greenMint' | 'purple';

interface IProps extends TokenProps {
  colorScheme?: TokenColorScheme;
}

interface ITokenConfig {
  bgDefault: string;
  bgHover: string;
  bgActive: string;
  borderDefault: string;
  borderHover: string;
  borderActive: string;
}

const colorSchemeConfig: Record<TokenColorScheme, ITokenConfig> = {
  blueDark: {
    bgDefault: '#dde6ff',
    bgHover: '#becfff',
    bgActive: '#9fb8ff',
    borderDefault: '#becfff',
    borderHover: '#9fb8ff',
    borderActive: '#80a1ff',
  },
  greenMint: {
    bgDefault: '#c6f5ec',
    bgHover: '#a8eee2',
    bgActive: '#8be7d8',
    borderDefault: '#a8eee2',
    borderHover: '#8be7d8',
    borderActive: '#6ddfcd',
  },
  orange: {
    bgDefault: '#ffe0c3',
    bgHover: '#ffd1a0',
    bgActive: '#ffc17d',
    borderDefault: '#ffd1a0',
    borderHover: '#ffc17d',
    borderActive: '#ffb259',
  },
  purple: {
    bgDefault: '#f7d7ff',
    bgHover: '#eabdf6',
    bgActive: '#dea3ec',
    borderDefault: '#eabdf6',
    borderHover: '#dea3ec',
    borderActive: '#d189e3',
  },
};

export const ColoredToken: React.FC<IProps> = ({
  colorScheme = 'blueDark',
  ...props
}) => {
  const {
    borderDefault,
    borderHover,
    borderActive,
    bgDefault,
    bgHover,
    bgActive,
  } = colorSchemeConfig[colorScheme];

  const theme = createTheme({
    tokenBorderWidth: '1px',
    tokenBorderRadius: '2px',
    tokenDefaultIdleBg: bgDefault,
    tokenDefaultIdleBgHover: bgHover,
    tokenDefaultActiveBg: bgActive,
    tokenDefaultIdleBorderColor: borderDefault,
    tokenDefaultIdleBorderColorHover: borderHover,
    tokenDefaultActiveBorderColor: borderActive,
    // Disabled
    tokenBorderColorDisabled: borderDefault,
    tokenTextColorDisabled: colors.grayscaleText,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <ThemeContext.Provider value={theme}>
      <Token
        {...props}
        onClick={handleClick}
        className={cx(props.disabled && styles.disabled)}
      />
    </ThemeContext.Provider>
  );
};
