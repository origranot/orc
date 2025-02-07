import { jwtVerify } from 'jose';
import { z } from 'zod';
import { communicationPayloadSchema } from '@orc/web/lib/api/schemas/communication-payload.schema';

export type CommunicationPayload = z.infer<typeof communicationPayloadSchema>;

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the validated payload.
 * Throws an error if authentication fails.
 */
export async function authenticateRequest(request: Request): Promise<CommunicationPayload> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Unauthorized: No Authorization header provided');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized: Invalid token format');
  }

  const secret = new TextEncoder().encode(process.env.CLUSTER_COMMUNICATION_SECRET);
  let verified;
  try {
    verified = await jwtVerify(token, secret);
  } catch (err: any) {
    throw new Error(`Unauthorized: ${err.message}`);
  }

  const parsedPayload = communicationPayloadSchema.safeParse(verified.payload);
  if (!parsedPayload.success) {
    throw new Error('Unauthorized: Invalid token payload');
  }

  return parsedPayload.data;
}
