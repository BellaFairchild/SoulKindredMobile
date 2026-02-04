import React, { useState } from 'react';
import { NotebookPen, MessageCircle, Sparkles, SmilePlus, X } from 'lucide-react';
import { colors } from '../theme/colors';

type DialActionKey = 'mood' | 'text' | 'journal';

interface SpeedDialProps {
  onSelect?: (action: DialActionKey) => void;
}

interface MiniOrbProps {
  action: DialActionKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  open: boolean;
  onSelect: (action: DialActionKey) => void;
}

const positions: Record<DialActionKey, { x: number; y: number }> = {
  mood: { x: -110, y: -70 },
  text: { x: 0, y: -140 },
  journal: { x: 110, y: -70 }
};

const MiniOrb: React.FC<MiniOrbProps> = ({ action, label, description, icon: Icon, color, open, onSelect }) => {
  const pos = positions[action];

  return (
    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: open ? 'auto' : 'none' }}>
      <button
        type="button"
        aria-label={label}
        onClick={() => onSelect(action)}
        style={{
          position: 'relative',
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: `1px solid ${colors.panelBorder}`,
          background: `linear-gradient(145deg, ${color}, ${colors.orbSecondary})`,
          color: '#fff',
          boxShadow: `0 12px 30px ${color}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
          display: 'grid',
          placeItems: 'center',
          opacity: open ? 1 : 0,
          transform: open ? `translate(${pos.x}px, ${pos.y}px) scale(1)` : 'translate(0, 0) scale(0.5)',
          transition: 'transform 240ms ease, opacity 180ms ease, filter 180ms ease',
          backdropFilter: 'blur(14px)',
          cursor: open ? 'pointer' : 'default'
        }}
      >
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: `${color}22`, filter: 'blur(12px)', zIndex: 0 }} />
        <Icon size={22} style={{ zIndex: 1 }} />
      </button>
      <div
        style={{
          position: 'absolute',
          top: -64,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 150,
          textAlign: 'center',
          opacity: open ? 1 : 0,
          transition: 'opacity 160ms ease 60ms',
          pointerEvents: 'none'
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, letterSpacing: 0.4 }}>{label}</div>
        <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.3 }}>{description}</div>
      </div>
    </div>
  );
};

interface PrimaryOrbButtonProps {
  open: boolean;
  toggle: () => void;
}

const PrimaryOrbButton: React.FC<PrimaryOrbButtonProps> = ({ open, toggle }) => {
  return (
    <button
      type="button"
      aria-label={open ? 'Close actions' : 'Open actions'}
      aria-expanded={open}
      onClick={toggle}
      style={{
        position: 'relative',
        width: 96,
        height: 96,
        borderRadius: '50%',
        border: `1px solid ${colors.panelBorder}`,
        background: `radial-gradient(circle at 30% 30%, ${colors.orbSecondary} 0%, ${colors.orb} 50%, #1c1a3a 100%)`,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 18px 48px rgba(88, 28, 135, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        transition: 'transform 180ms ease, box-shadow 200ms ease'
      }}
    >
      <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', background: colors.glow, filter: 'blur(18px)', opacity: 0.8 }} />
      {open ? <X size={28} strokeWidth={2.2} style={{ zIndex: 1 }} /> : <Sparkles size={28} strokeWidth={2.2} style={{ zIndex: 1 }} />}
    </button>
  );
};

export const SpeedDial: React.FC<SpeedDialProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  const actions: { key: DialActionKey; label: string; description: string; icon: React.ComponentType<{ size?: number }>; color: string }[] = [
    { key: 'mood', label: 'Mood', description: 'Quick pulse check', icon: SmilePlus, color: colors.mood },
    { key: 'text', label: 'Text', description: 'Message your companion', icon: MessageCircle, color: colors.text },
    { key: 'journal', label: 'Journal', description: 'Capture a thought', icon: NotebookPen, color: colors.journal }
  ];

  const handleSelect = (action: DialActionKey) => {
    onSelect?.(action);
    setOpen(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      <div style={{ position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        {actions.map((item) => (
          <MiniOrb
            key={item.key}
            action={item.key}
            label={item.label}
            description={item.description}
            icon={item.icon}
            color={item.color}
            open={open}
            onSelect={handleSelect}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
          <PrimaryOrbButton open={open} toggle={() => setOpen((prev) => !prev)} />
        </div>
      </div>
    </div>
  );
};

export type { DialActionKey };
export { PrimaryOrbButton };
