export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'new' | 'in_progress' | 'pending' | 'delayed' | 'completed' | 'canceled';
  clientId?: string;
  client?: Client;
  startDate?: string;
  dueDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  projectId: string;
  project?: Project;
  assignedToId?: string;
  assignedTo?: User;
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'client';
  avatar?: string;
}

export interface Invoice {
  id: string;
  number: string;
  projectId?: string;
  project?: Project;
  clientId: string;
  client: Client;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled';
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  name: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Message {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  content: string;
  fileIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  projectId?: string;
  uploadedById: string;
  uploadedBy?: User;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  clientId?: string;
  startDate?: string;
  dueDate?: string;
  status?: Project['status'];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  clientId?: string;
  startDate?: string;
  dueDate?: string;
  status?: Project['status'];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  projectId: string;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignedToId?: string;
  dueDate?: string;
  order?: number;
}

export interface CreateClientDto {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export interface CreateInvoiceDto {
  projectId?: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'amount'>[];
  tax?: number;
  discount?: number;
  notes?: string;
}

export interface CreateMessageDto {
  projectId: string;
  content: string;
  fileIds?: string[];
}
