import { z } from 'zod';
import fastify from 'fastify';
import 'zod-openapi/extend';
import {
  type FastifyZodOpenApiSchema,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  FastifyZodOpenApiTypeProvider,
  serializerCompiler,
  validatorCompiler
} from 'fastify-zod-openapi';
import { getUser } from './getUser';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Test API',
      version: '1.0.0'
    },
    tags: [
      { name: 'users', description: 'User operations' }
    ]
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.withTypeProvider<FastifyZodOpenApiTypeProvider>()
  .route({
    method: 'GET',
    url: '/users/:id',
    schema: {
      tags: ['users'],
      params: z.object({
        id: z.string().openapi({
          description: 'User ID',
          example: '2415'
        })
      }),
      response: {
        200: z.object({
          id: z.number(),
          name: z.string(),
          email: z.string().email()
        }).openapi({
          description: 'User object',
          example: {
            id: 2415,
            name: 'John Doe',
            email: 'test@example.com'
          }}),
        }
    } satisfies FastifyZodOpenApiSchema,
    handler: async (req, reply) => {

      const user = await getUser(req.params.id);
      return user;
    }
  });

  // Run the server!
app.listen({ port: 3000 })