import { SizeType } from './types/common.types';

export const colors = {
  serviceColor: '#366af3',
  serviceColorBg: '#eceef6',
  serviceColorHover: '#3365E8',
  serviceColorActive: '#2E5AD1',
  serviceSecondColorHover: '#dde6ff',
  serviceSecondColorActive: '#becfff',
  serviceSecondColorDisabled: '#9fb8ff',
  grayscaleBackground: '#e6e6e6',
  grayscaleLightBg: '#f6f6f6',
  grayscaleMediumBg: '#f0f0f0',
  grayscaleDarkBg: '#d6d6d6',
  grayscaleText: '#222222',
  grayscaleSecondaryText: '#757575',
  grayscaleDisabledText: '#adadad',
  errorShape: '#ff5a49',
  errorBorder: '#fe4c4c',
  warningBorder: '#ef8b17',
  chartLine: '#618aff',
  chartPoint: '#618aff',
  chartBg50: 'rgba(97, 138, 255, 0.16)',
  chartBg100: 'rgba(97, 138, 255, 0.2)',
};

export const NOT_DATA_CAPTION = '-';

export const DEFAULT_PAGE_SIZE = 20;

export const FAKE_RESPONSE_TIMEOUT = 500;

export const blankPagedList = {
  items: [],
  page: 1,
  total_items: 0,
  total_pages: 0,
  size: 0,
};

export const blankChartData = {
  labels: [],
  datasets: [],
};

interface ISizeConfig {
  fontSize: number;
  lineHeight: string;
}

export const SizeConfig: Record<SizeType, ISizeConfig> = {
  small: { fontSize: 14, lineHeight: '20px' },
  medium: { fontSize: 16, lineHeight: '22px' },
  large: { fontSize: 18, lineHeight: '24px' },
};
