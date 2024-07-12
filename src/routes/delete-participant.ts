import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

import { ClientError } from '../errors/client-error'

export async function deleteParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/participants/:participantId',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { participantId } = request.params

      const deleteParticipant = await prisma.participant.delete({
        where: { id: participantId },
      })

      if (!deleteParticipant) {
        throw new ClientError('Participant not found')
      }

      return { participantId }
    },
  )
}