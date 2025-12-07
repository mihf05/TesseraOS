import { apiClient } from './client';
import { Invoice, CreateInvoiceDto } from '@/types';

export const invoicesApi = {
  getAll: (token: string) => apiClient.get<Invoice[]>('/invoices', token),

  getById: (id: string, token: string) =>
    apiClient.get<Invoice>(`/invoices/${id}`, token),

  create: (data: CreateInvoiceDto, token: string) =>
    apiClient.post<Invoice>('/invoices', data, token),

  update: (id: string, data: Partial<CreateInvoiceDto>, token: string) =>
    apiClient.patch<Invoice>(`/invoices/${id}`, data, token),

  markAsPaid: (id: string, token: string) =>
    apiClient.patch<Invoice>(`/invoices/${id}`, { status: 'paid' }, token),

  markAsUnpaid: (id: string, token: string) =>
    apiClient.patch<Invoice>(`/invoices/${id}`, { status: 'pending' }, token),

  getPdf: (id: string, token: string) =>
    apiClient.get<Blob>(`/invoices/${id}/pdf`, token),

  delete: (id: string, token: string) =>
    apiClient.delete(`/invoices/${id}`, token),
};
