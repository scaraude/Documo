import { env } from '@/lib/config/env';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);
