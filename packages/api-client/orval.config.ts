import { defineConfig } from 'orval';

const target = process.env.ERP_OPENAPI_URL ?? 'http://localhost:5000/openapi/v1.json';

export default defineConfig({
  erp: {
    input: { target },
    output: {
      mode: 'tags-split',
      target: 'src/generated/endpoints',
      schemas: 'src/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      formatter: 'prettier',
      override: {
        mutator: { path: 'src/http/client.ts', name: 'customFetch' },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
});
