// @vyd/react — thin React components over the VYD Design System.
//
// These apply the design system's `.vyd-*` classes; the consuming app must
// import the stylesheet(s) once at its root:
//   import '@vyd/design-system/theme.css';   // tokens + primitives
//   import '@vyd/design-system/shell.css';    // app shell layout (opt-in)

export { cx } from './cx';
export { CubeMark } from './CubeMark';
export type { CubeVariant, CubeMarkProps } from './CubeMark';

export { Button, Input, Card, Mono } from './primitives';
export type { ButtonProps, InputProps, CardProps } from './primitives';

export {
  AppShell,
  TopBar,
  TopBarBrand,
  TopBarSpacer,
  ToolSwitcher,
  Avatar,
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
