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
