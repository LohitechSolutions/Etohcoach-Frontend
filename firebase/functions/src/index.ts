import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const REGION = 'europe-west1';

function parseSuperAdminEmails(): string[] {
  const fromConfig = (functions.config().superadmin && functions.config().superadmin.emails) || '';
  const raw = typeof fromConfig === 'string' ? fromConfig : '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Grants Firebase Auth custom claim { admin: true } to `data.uid`.
 * Authorized if caller already has admin claim OR caller's email is listed in
 * Firebase Functions config: `firebase functions:config:set superadmin.emails="a@x.com,b@y.com"`
 *
 * Bootstrap: add founder email to superadmin.emails, deploy, sign in as founder, call once, then grant others from admin UI.
 */
export const grantAdmin = functions.region(REGION).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  }

  const targetUid = typeof data?.uid === 'string' ? data.uid.trim() : '';
  if (!targetUid) {
    throw new functions.https.HttpsError('invalid-argument', 'Field "uid" is required');
  }

  const email = (context.auth.token.email || '').toLowerCase();
  const isExistingAdmin = context.auth.token.admin === true;
  const superEmails = parseSuperAdminEmails();
  const isSuper = Boolean(email && superEmails.includes(email));

  if (!isExistingAdmin && !isSuper) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Not authorized to grant admin. Use an existing admin or a superadmin email from functions config.',
    );
  }

  await admin.auth().setCustomUserClaims(targetUid, { admin: true });
  return { ok: true as const };
});
