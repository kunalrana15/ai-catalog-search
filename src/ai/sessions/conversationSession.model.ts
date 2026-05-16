// src/ai/sessions/conversationSession.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    role: 'user' | 'model';
        parts: { text?: string; functionCall?: any; functionResponse?: any }[];
        }

        export interface IConversationSession extends Document {
            sessionId: string;
                messages: IMessage[];
                    createdAt: Date;
                        updatedAt: Date;
                        }

                        const MessageSchema = new Schema<IMessage>({
                            role: { type: String, enum: ['user', 'model'], required: true },
                                parts: {
                                        type: [
                                                    {
                                                                    text: { type: String },
                                                                                    functionCall: { type: Schema.Types.Mixed },
                                                                                                    functionResponse: { type: Schema.Types.Mixed },
                                                                                                                },
                                                                                                                        ],
                                                                                                                                required: true,
                                                                                                                                    },
                                                                                                                                    });

                                                                                                                                    const ConversationSessionSchema = new Schema<IConversationSession>(
                                                                                                                                        {
                                                                                                                                                sessionId: { type: String, required: true, unique: true, index: true },
                                                                                                                                                        messages: { type: [MessageSchema], default: [] },
                                                                                                                                                            },
                                                                                                                                                                { timestamps: true }
                                                                                                                                                                );

                                                                                                                                                                export const ConversationSession = mongoose.model<IConversationSession>(
                                                                                                                                                                    'ConversationSession',
                                                                                                                                                                        ConversationSessionSchema
                                                                                                                                                                        );