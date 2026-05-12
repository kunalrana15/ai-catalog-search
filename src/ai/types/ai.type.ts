export interface AIQueryResponse {
    tool: string,

    filters: {
        genres?: string[];
        releaseYear?: {
            $gt?: number;
            $lt?: number;
        };
        isLive?: boolean;
        language?: string;
        type?: 'movie' | 'series';
    }
}