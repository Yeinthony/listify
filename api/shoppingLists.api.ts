import { AxiosResponse } from 'axios';
import http from '@/utils/httpClient';
import { Paginated } from '@/api/types/common';
import {
  CreatedList,
  ListCollaborator,
  ListDetail,
  ListItem,
  ListSummary,
  OptimizeResult,
  ShoppingList,
} from '@/types/shopping-lists';
import {
  AddCollaboratorPayload,
  AddItemPayload,
  CreateListPayload,
  OptimizePayload,
  UpdateCollaboratorRolePayload,
  UpdateItemPayload,
  UpdateListPayload,
} from './types/shopping-lists';

export const createList = (data: CreateListPayload): Promise<AxiosResponse<CreatedList>> =>
  http.post<CreatedList>('/shopping-lists', data);

export const getLists = (page = 1, pageSize = 20): Promise<AxiosResponse<Paginated<ListSummary>>> =>
  http.get<Paginated<ListSummary>>(`/shopping-lists?page=${page}&pageSize=${pageSize}`);

export const getListById = (id: string): Promise<AxiosResponse<ListDetail>> =>
  http.get<ListDetail>(`/shopping-lists/${id}`);

export const updateList = (id: string, data: UpdateListPayload): Promise<AxiosResponse<ShoppingList>> =>
  http.patch<ShoppingList>(`/shopping-lists/${id}`, data);

export const deleteList = (id: string): Promise<AxiosResponse<void>> =>
  http.delete<void>(`/shopping-lists/${id}`);

export const optimizeList = (id: string, data: OptimizePayload): Promise<AxiosResponse<OptimizeResult>> =>
  http.post<OptimizeResult>(`/shopping-lists/${id}/optimize`, data);

export const addListItem = (id: string, data: AddItemPayload): Promise<AxiosResponse<ListItem>> =>
  http.post<ListItem>(`/shopping-lists/${id}/items`, data);

export const updateListItem = (id: string, itemId: string, data: UpdateItemPayload): Promise<AxiosResponse<ListItem>> =>
  http.patch<ListItem>(`/shopping-lists/${id}/items/${itemId}`, data);

export const removeListItem = (id: string, itemId: string): Promise<AxiosResponse<void>> =>
  http.delete<void>(`/shopping-lists/${id}/items/${itemId}`);

export const getListCollaborators = (id: string): Promise<AxiosResponse<ListCollaborator[]>> =>
  http.get<ListCollaborator[]>(`/shopping-lists/${id}/collaborators`);

export const addListCollaborator = (id: string, data: AddCollaboratorPayload): Promise<AxiosResponse<ListCollaborator>> =>
  http.post<ListCollaborator>(`/shopping-lists/${id}/collaborators`, data);

export const updateListCollaboratorRole = (id: string, collabId: string, data: UpdateCollaboratorRolePayload): Promise<AxiosResponse<ListCollaborator>> =>
  http.patch<ListCollaborator>(`/shopping-lists/${id}/collaborators/${collabId}`, data);

export const removeListCollaborator = (id: string, collabId: string): Promise<AxiosResponse<void>> =>
  http.delete<void>(`/shopping-lists/${id}/collaborators/${collabId}`);

export const leaveList = (id: string): Promise<AxiosResponse<void>> =>
  http.post<void>(`/shopping-lists/${id}/leave`);
