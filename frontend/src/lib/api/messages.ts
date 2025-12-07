import { apiClient } from './client';
import { Message, CreateMessageDto } from '@/types';

export const messagesApi = {
  getByProject: (projectId: string, token: string, page = 1, limit = 50) =>
    apiClient.get<{ messages: Message[]; total: number }>(
      `/projects/${projectId}/messages?page=${page}&limit=${limit}`,
      token
    ),

  create: (data: CreateMessageDto, token: string) =>
    apiClient.post<Message>(`/projects/${data.projectId}/messages`, data, token),

  delete: (id: string, token: string) =>
    apiClient.delete(`/messages/${id}`, token),
};
