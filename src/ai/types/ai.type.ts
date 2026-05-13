
import { z } from 'zod';
import { SearchTitleSchema } from './query.schema.js';

export type AIQueryResponse = z.infer<typeof SearchTitleSchema>;