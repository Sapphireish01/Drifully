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

  getAuditLogDetail: async (auditId: string) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/info/', audit_id: auditId }
      });
      return response.data;
    } catch (error) {
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
