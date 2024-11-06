export interface ITokenSelectItem {
  value: string;
  label: string;
  isParent?: boolean;
  counter?: number;
}

export interface ITokenSelectDropdownItem extends ITokenSelectItem {
  children?: ITokenSelectDropdownItem[];
}
