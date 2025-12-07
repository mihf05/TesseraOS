import { apiClient } from './client';
import { Client, CreateClientDto } from '@/types';

export const clientsApi = {
  getAll: (token: string) => apiClient.get<Client[]>('/clients', token),

  getById: (id: string, token: string) =>
    apiClient.get<Client>(`/clients/${id}`, token),

  create: (data: CreateClientDto, token: string) =>
    apiClient.post<Client>('/clients', data, token),

  update: (id: string, data: Partial<CreateClientDto>, token: string) =>
    apiClient.patch<Client>(`/clients/${id}`, data, token),

  delete: (id: string, token: string) =>
    apiClient.delete(`/clients/${id}`, token),
};
