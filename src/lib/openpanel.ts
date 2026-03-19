import { OpenPanel } from '@openpanel/nextjs';

export const op = new OpenPanel({
  clientId: '77fa07ac-d661-41e2-b3a8-e2e11b89bdcd',
  clientSecret: process.env.OPENPANEL_SECRET || 'sec_3b924d695bfcb8d65d2a',
});
