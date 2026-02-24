import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { schema } from '../db/schema/index.ts'
import { db } from '../db/client.ts'
import { randomUUID } from 'node:crypto'
import { dispathOrderCreated } from '../brocker/messages/order-created.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: '*' })

app.get('/health', () => {
    return 'OK';
})

app.post('/orders', {
    schema: {
        body: z.object({
            amount: z.number(),
        })
    }
}, async (request, reply) => {
    const { amount } = request.body;

    console.log('Creating and order with amout', amount);

    const orderId = randomUUID();

    dispathOrderCreated({
        orderId: orderId,
        amount: amount,
        customer: {
            id: 'a3e6375a-efdf-47ea-9626-808c9292aa37'
        }
    })

    await db.insert(schema.orders).values({
        id: orderId,
        customerId: 'a3e6375a-efdf-47ea-9626-808c9292aa37',
        amount: amount
    })

    return reply.status(201).send()
})

app.listen({host: '0.0.0.0', port: 3333 }).then(() => {
    console.log('[Orders] HTTP Server running!');
})