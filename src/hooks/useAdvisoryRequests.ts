/**
 * Custom hooks for Advisory Requests
 * React Query hooks for managing advisory request state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyRequests,
  getPendingRequests,
  createAdvisoryRequest,
  approveRequest,
  rejectRequest,
  cancelRequest,
  getAvailableSchedules,
} from '@/api/endpoints/advisoryRequests';
import type {
  CreateAdvisoryRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
} from '@/api/types/advisoryRequests.types';

// ============================================
// QUERY KEYS
// ============================================

export const advisoryRequestsKeys = {
  all: ['advisory-requests'] as const,
  myRequests: () => [...advisoryRequestsKeys.all, 'my-requests'] as const,
  pendingRequests: () => [...advisoryRequestsKeys.all, 'pending'] as const,
  availableSchedules: (subjectDetailId: number) =>
    [...advisoryRequestsKeys.all, 'schedules', subjectDetailId] as const,
};

// ============================================
// STUDENT HOOKS
// ============================================

/**
 * Hook to fetch student's advisory requests
 * 
 * @returns Query result with student's requests
 */
export function useMyRequests() {
  return useQuery({
    queryKey: advisoryRequestsKeys.myRequests(),
    queryFn: getMyRequests,
  });
}

/**
 * Hook to create a new advisory request
 * 
 * @returns Mutation for creating request
 */
export function useCreateAdvisoryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdvisoryRequestDto) => createAdvisoryRequest(data),
    onSuccess: () => {
      // Invalidate and refetch my requests
      queryClient.invalidateQueries({ queryKey: advisoryRequestsKeys.myRequests() });
    },
  });
}

/**
 * Hook to cancel an advisory request (student or professor)
 * 
 * @returns Mutation for cancelling request
 */
export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => cancelRequest(requestId),
    onSuccess: () => {
      // Invalidate both student and professor queries
      queryClient.invalidateQueries({ queryKey: advisoryRequestsKeys.myRequests() });
      queryClient.invalidateQueries({ queryKey: advisoryRequestsKeys.pendingRequests() });
    },
  });
}

/**
 * Hook to get available schedules for a subject
 * 
 * @param subjectDetailId - Subject detail ID
 * @param dateFrom - Optional start date
 * @param dateTo - Optional end date
 * @param enabled - Whether to enable the query
 * @returns Query result with available schedules
 */
export function useAvailableSchedules(
  subjectDetailId: number,
  dateFrom?: string,
  dateTo?: string,
  enabled = true
) {
  return useQuery({
    queryKey: advisoryRequestsKeys.availableSchedules(subjectDetailId),
    queryFn: () => getAvailableSchedules(subjectDetailId, dateFrom, dateTo),
    enabled: enabled && subjectDetailId > 0,
  });
}

// ============================================
// PROFESSOR HOOKS
// ============================================

/**
 * Hook to fetch pending advisory requests for professor
 * 
 * @returns Query result with pending requests
 */
export function usePendingRequests() {
  return useQuery({
    queryKey: advisoryRequestsKeys.pendingRequests(),
    queryFn: getPendingRequests,
  });
}

/**
 * Hook to approve an advisory request
 * 
 * @returns Mutation for approving request
 */
export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: number; data: ApproveRequestDto }) =>
      approveRequest(requestId, data),
    onSuccess: () => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: advisoryRequestsKeys.pendingRequests() });
    },
  });
}

/**
 * Hook to reject an advisory request
 * 
 * @returns Mutation for rejecting request
 */
export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: number; data: RejectRequestDto }) =>
      rejectRequest(requestId, data),
    onSuccess: () => {
      // Invalidate pending requests to refresh the list
      queryClient.invalidateQueries({ queryKey: advisoryRequestsKeys.pendingRequests() });
    },
  });
}
