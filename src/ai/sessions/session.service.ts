import { randomUUID } from 'crypto';
import { ConversationSession,IMessage } from './conversationSession.model.js'

const MAX_TURNS = 5;

export class SessionService {
    
        async createSession(): Promise<string> {
                const sessionId = randomUUID();
                        await ConversationSession.create({ sessionId,messages: [] });
                                return sessionId;
                                    }

                                        async getHistory(sessionId: string): Promise<IMessage[]> {
                                                const session = await ConversationSession.findOne({ sessionId });

                                                        if (!session) return [];

                                                                return session.messages.slice(-(MAX_TURNS*2));
                                                                    } 

                                                                        async appendTurn(
                                                                                sessionId: string,
                                                                                        userText: string,
                                                                                                functionCall: { name: string; args: any }
                                                                                                    ): Promise<void> {

                                                                                                            const userMessage: IMessage = {
                                                                                                                        role: 'user',
                                                                                                                                    parts: [{ text: userText }]
                                                                                                                                            };

                                                                                                                                                    const modelMessage: IMessage = {
                                                                                                                                                                role: 'model',
                                                                                                                                                                            parts: [{ functionCall }]
                                                                                                                                                                                    };

                                                                                                                                                                                            await ConversationSession.updateOne(
                                                                                                                                                                                                        {sessionId},
                                                                                                                                                                                                                    { $push: { messages: { $each: [userMessage,modelMessage] } } }
                                                                                                                                                                                                                            );

                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                    async sessionExist(sessionId: string): Promise<boolean> {
                                                                                                                                                                                                                                            const count = await ConversationSession.countDocuments({ sessionId });
                                                                                                                                                                                                                                                    return count > 0;
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                        }