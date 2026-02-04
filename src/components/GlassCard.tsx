import React, { ReactNode } from 'react';
import { colors } from '../theme/colors';

interface GlassCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div
      style={{
        position: 'relative',
        background: colors.panel,
        border: `1px solid ${colors.panelBorder}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(14px)',
        color: colors.textPrimary
      }}
    >
      <div style={{ position: 'absolute', inset: -6, borderRadius: 22, background: colors.glow, filter: 'blur(26px)', opacity: 0.2 }} />
      <div style={{ position: 'relative' }}>
        {title && (
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, letterSpacing: 0.2 }}>
            {title}
          </div>
        )}
        {subtitle && (
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
            {subtitle}
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
      </div>
    </div>
  );
};
