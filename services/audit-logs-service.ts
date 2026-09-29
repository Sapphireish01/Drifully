import { publicApi } from '@/lib/api-client';

export const auditLogsService = {
  getAuditLogs: async (queryParams?: Record<string, any>) => {
    try {
      const response = await publicApi.get('', {
        params: { 
          path: 'api/v1/admin/audit-logs/',
          ...queryParams,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuditLogDetail: async (auditId: string | number) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/info/', audit_id: auditId, id: auditId },
        skipToast: true,
      });
      if (response.data) {
        return response.data?.data || response.data?.result || response.data;
      }
    } catch (error) {
      try {
        const fallbackRes = await publicApi.get('', {
          params: { path: `api/v1/admin/audit-logs/${auditId}/` },
          skipToast: true,
        });
        if (fallbackRes.data) {
          return fallbackRes.data?.data || fallbackRes.data?.result || fallbackRes.data;
        }
      } catch {}
      console.error(`Failed to fetch audit log detail for ${auditId}:`, error);
      throw error;
    }
  },

  exportAuditLogs: async (format: string = 'csv') => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/', export: format },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  }
};
