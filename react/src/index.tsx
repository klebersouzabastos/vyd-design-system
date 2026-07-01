// @vyd/react — thin React components over the VYD Design System.
//
// These apply the design system's `.vyd-*` classes; the consuming app must
// import the stylesheet(s) once at its root:
//   import '@vyd/design-system/theme.css';   // tokens + primitives
//   import '@vyd/design-system/shell.css';    // app shell layout (opt-in)

export { cx } from './cx';
export { CubeMark } from './CubeMark';
export type { CubeVariant, CubeMarkProps } from './CubeMark';

export { Icon } from './Icon';
export type { IconName, IconProps } from './Icon';
export { ICONS as icons, ICON_NAMES } from './icons.generated';

export { Button, Input, Card, Mono, Text } from './primitives';
export type { ButtonProps, InputProps, CardProps, TextProps, TextVariant, ControlSize } from './primitives';

export {
  Field, Textarea, Select, Checkbox, Radio, Switch, Range, Choice, InputGroup, SearchInput,
} from './forms';
export type { FieldProps } from './forms';

export {
  Alert, Toast, Toaster, Progress, Spinner, Skeleton, EmptyState, Badge, Tag,
} from './feedback';
export type {
  AlertProps, FeedbackVariant, ProgressProps, EmptyStateProps, BadgeProps, TagProps,
} from './feedback';

export {
  Dialog, Drawer, Menu, MenuItem, MenuSeparator, MenuLabel, Popover, Tooltip, Toolbar, ToolbarSeparator,
} from './overlays';
export type { DialogProps, DrawerProps, MenuProps, MenuItemProps, PopoverProps } from './overlays';

export {
  TableWrap, Table, Thead, Tbody, Tr, Th, Td, List, ListItem, Tree, TreeItem, Stat, KeyValue, KV,
} from './data';
export type { ThProps, SortDir, ListItemProps, TreeItemProps, StatProps } from './data';

export {
  AppShell,
  TopBar,
  TopBarBrand,
  TopBarSpacer,
  ToolSwitcher,
  Avatar,
  RibbonTabs,
  RibbonTab,
  Ribbon,
  RibbonGroup,
  RibbonItem,
  LeftRail,
  RailSectionLabel,
  RailItem,
  Canvas,
  RightPanel,
  PanelSectionLabel,
  Prop,
  StatusBar,
  StatusBarSpacer,
} from './shell';
