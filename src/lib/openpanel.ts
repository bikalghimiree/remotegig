import { OpenPanel } from '@openpanel/nextjs';

let _op: OpenPanel | null = null;

export function getOp(): OpenPanel {
  if (!_op) {
    _op = new OpenPanel({
      clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || '',
      clientSecret: process.env.OPENPANEL_SECRET_KEY || '',
    });
  }
  return _op;
}

// Convenience: fire-and-forget track that never throws
export const op = {
  track: (name: string, props?: Record<string, unknown>) => {
    try { getOp().track(name, props); } catch {}
  },
  identify: (props: Record<string, unknown>) => {
    try { getOp().identify(props as Parameters<OpenPanel['identify']>[0]); } catch {}
  },
};
