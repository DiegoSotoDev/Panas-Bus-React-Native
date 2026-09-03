import React from 'react';
import { StyleSheet } from 'react-native';
import * as LucideIcons from 'lucide-react';

function pascalCase(str: string) {
  if (!str) return 'Circle';
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

function getLucideIcon(name: string) {
  if (!name) return LucideIcons.Circle;

  // Custom mapping for frequent icon names
  const customMap: Record<string, any> = {
    'bus': LucideIcons.Bus,
    'bus-outline': LucideIcons.Bus,
    'wallet': LucideIcons.Wallet,
    'wallet-outline': LucideIcons.Wallet,
    'qr-code': LucideIcons.QrCode,
    'qr-code-outline': LucideIcons.QrCode,
    'map': LucideIcons.MapPin,
    'map-outline': LucideIcons.MapPin,
    'home': LucideIcons.Home,
    'home-outline': LucideIcons.Home,
    'checkmark': LucideIcons.Check,
    'checkmark-circle': LucideIcons.CheckCircle,
    'checkmark-circle-outline': LucideIcons.CheckCircle,
    'arrow-back': LucideIcons.ArrowLeft,
    'arrow-forward': LucideIcons.ArrowRight,
    'chevron-forward': LucideIcons.ChevronRight,
    'chevron-back': LucideIcons.ChevronLeft,
    'pencil': LucideIcons.Pencil,
    'camera': LucideIcons.Camera,
    'person': LucideIcons.User,
    'person-outline': LucideIcons.User,
    'close': LucideIcons.X,
    'copy': LucideIcons.Copy,
    'refresh': LucideIcons.RefreshCw,
    'flash': LucideIcons.Zap,
    'flash-off': LucideIcons.ZapOff,
    'time-outline': LucideIcons.Clock,
    'shield-checkmark-outline': LucideIcons.ShieldCheck,
    'cash-outline': LucideIcons.Banknote,
    'scan-outline': LucideIcons.Scan,
    'swap-horizontal': LucideIcons.Repeat,
    'notifications-outline': LucideIcons.Bell,
  };

  if (customMap[name]) return customMap[name];

  const formatted = pascalCase(name);
  if ((LucideIcons as any)[formatted]) return (LucideIcons as any)[formatted];

  return LucideIcons.Circle;
}

const IconComponent = ({ name, size = 20, color = '#000', style }: any) => {
  const LucideComp = getLucideIcon(String(name || ''));
  const flatStyle = (style ? StyleSheet.flatten(style) : {}) || {};
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...flatStyle }}>
      <LucideComp size={size} color={flatStyle.color || color} />
    </span>
  );
};

export const Ionicons = IconComponent;
export const MaterialCommunityIcons = IconComponent;
export const FontAwesome = IconComponent;
export const Feather = IconComponent;
export const MaterialIcons = IconComponent;

export default IconComponent;

