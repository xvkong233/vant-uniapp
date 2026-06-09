import type { InjectionKey, Ref } from 'vue';
import type { Numeric } from './types';

export interface CheckboxGroupContext {
  value: Ref<Array<Numeric>>;
  disabled: Ref<boolean>;
  direction: Ref<'horizontal' | 'vertical'>;
  max: Ref<number | undefined>;
  toggle: (name: Numeric, checked: boolean) => void;
}

export interface RadioGroupContext {
  value: Ref<Numeric | boolean | undefined>;
  disabled: Ref<boolean>;
  direction: Ref<'horizontal' | 'vertical'>;
  update: (name: Numeric | boolean) => void;
}

export interface GridContext {
  square: Ref<boolean>;
  gutter: Ref<Numeric>;
  clickable: Ref<boolean>;
  columnNum: Ref<number>;
  center: Ref<boolean>;
  border: Ref<boolean>;
  direction: Ref<string>;
  iconSize: Ref<Numeric | undefined>;
  reverse: Ref<boolean>;
}

export interface RowContext {
  gutter: Ref<number>;
}

export interface TabbarContext {
  active: Ref<Numeric | boolean | undefined>;
  activeColor: Ref<string | undefined>;
  inactiveColor: Ref<string | undefined>;
  update: (name: Numeric | boolean) => void;
}

export interface SidebarContext {
  activeKey: Ref<number>;
  update: (index: number) => void;
}

export interface TabsContext {
  active: Ref<Numeric | boolean | undefined>;
  color: Ref<string | undefined>;
  titleActiveColor: Ref<string | undefined>;
  titleInactiveColor: Ref<string | undefined>;
  lazyRender: Ref<boolean>;
  register: (tab: TabDescriptor) => number;
  unregister: (id: number) => void;
  update: (tab: Partial<TabDescriptor> & { name: Numeric | boolean }, index: number) => void;
}

export interface TabDescriptor {
  id: number;
  name: Numeric | boolean;
  title: string;
  disabled?: boolean;
  dot?: boolean;
  info?: Numeric | null;
  titleStyle?: string;
}

export interface CollapseContext {
  value: Ref<Numeric | Numeric[] | undefined>;
  accordion: Ref<boolean>;
  border: Ref<boolean>;
  update: (name: Numeric, expanded: boolean) => void;
}

export interface DropdownMenuContext {
  activeColor: Ref<string | undefined>;
  overlay: Ref<boolean>;
  zIndex: Ref<number>;
  closeOnClickOverlay: Ref<boolean>;
  openName: Ref<Numeric | undefined>;
  toggle: (name: Numeric, show?: boolean) => void;
  close: () => void;
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> =
  Symbol('checkboxGroup');
export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol('radioGroup');
export const gridKey: InjectionKey<GridContext> = Symbol('grid');
export const rowKey: InjectionKey<RowContext> = Symbol('row');
export const tabbarKey: InjectionKey<TabbarContext> = Symbol('tabbar');
export const sidebarKey: InjectionKey<SidebarContext> = Symbol('sidebar');
export const tabsKey: InjectionKey<TabsContext> = Symbol('tabs');
export const collapseKey: InjectionKey<CollapseContext> = Symbol('collapse');
export const dropdownMenuKey: InjectionKey<DropdownMenuContext> =
  Symbol('dropdownMenu');
