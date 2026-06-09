export type Numeric = number | string;

export type UniClass =
  | string
  | Record<string, boolean | undefined>
  | Array<string | Record<string, boolean | undefined>>;

export interface BaseProps {
  customClass?: string;
  customStyle?: string | Record<string, string | number>;
}

export interface OptionItem {
  text?: string;
  value?: Numeric | boolean;
  icon?: string;
  disabled?: boolean;
  children?: OptionItem[];
  [key: string]: unknown;
}
