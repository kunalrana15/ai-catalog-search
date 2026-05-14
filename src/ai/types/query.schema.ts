import * as z from 'zod';


export const SearchTitleSchema = z.object({
                                        tool: z.literal('searchTitles'),
                                        filters: z.object({
                                            genres: z.array(z.string()).optional(),
                                            isLive: z.boolean().optional(),
                                            language: z.union([z.string(),z.array(z.string())]).optional(),
                                            type: z.enum(['series','movie']).optional(),
                                            releaseYear: z.object({
                                                $gt: z.number().optional(),
                                                $lt: z.number().optional()
                                            }).optional()
                                        }).strict()
                                }).strict()
