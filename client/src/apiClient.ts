import createClient from 'openapi-react-query';
import createFetchClient from "openapi-fetch";
import type { paths } from './api/types';


const fetchClient = createFetchClient<paths>({
  baseUrl: "https://myapi.dev/v1/",
});

export const apiClient = createClient(fetchClient);