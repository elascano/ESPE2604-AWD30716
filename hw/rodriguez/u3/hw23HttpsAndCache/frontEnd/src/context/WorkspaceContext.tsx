import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import type { Workspace, SriConnectionStatus } from '../types';
import { useAuth } from './AuthContext';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

interface WorkspaceContextValue {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  sriConnectionStatus: SriConnectionStatus;
  createWorkspace: (name: string, description: string, workspaceLocation: string, period: any) => Promise<Workspace | null>;
  deleteWorkspace: (workspaceId: string) => Promise<boolean>;
  selectWorkspace: (workspace: Workspace) => void;
  loadWorkspaces: () => Promise<void>;
  connectToSri: (username: string, password: string) => Promise<boolean>;
  disconnectFromSri: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('currentWorkspace') : null;
    return stored ? JSON.parse(stored) : null;
  });
  
  const [sriConnectionStatus, setSriConnectionStatus] = useState<SriConnectionStatus>('disconnected');

  const mapBackendWorkspace = (ws: any): Workspace => {
    return {
      ...ws,
      period: {
        type: ws.periodType || 'monthly',
        year: ws.periodYear,
        month: ws.periodMonth,
        semester: ws.periodSemester
      },
      // Ensure arrays and objects expected by frontend aren't undefined
      processTracer: ws.processTracer || {
        invoicedDownloadStatus: false,
        atsXlsmGenerationStatus: false,
        atsXmlGenerationStatus: false,
      }
    };
  };

  const loadWorkspaces = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const response = await axios.get(`${BUSINESS_SERVICE_URL}/workspaces/user/${currentUser.id}`);
      if (response.data && response.data.data) {
        const mappedWorkspaces = response.data.data.map(mapBackendWorkspace);
        setWorkspaces(mappedWorkspaces);
      }
    } catch (error) {
      console.error("Error loading workspaces:", error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setSriConnectionStatus('disconnected');
    }
  }, [isAuthenticated, currentUser, loadWorkspaces]);

  const createWorkspace = useCallback(async (name: string, description: string, workspaceLocation: string, period: any): Promise<Workspace | null> => {
    if (!currentUser) return null;
    try {
      const payload = {
        name,
        description,
        ownerId: currentUser.id,
        workspaceLocation,
        period
      };
      const response = await axios.post(`${BUSINESS_SERVICE_URL}/workspaces`, payload);
      if (response.data && response.data.data) {
        const newWorkspace = mapBackendWorkspace(response.data.data);
        setWorkspaces(prev => [...prev, newWorkspace]);
        return newWorkspace;
      }
      return null;
    } catch (error) {
      console.error("Error creating workspace:", error);
      return null;
    }
  }, [currentUser]);

  const deleteWorkspace = useCallback(async (workspaceId: string): Promise<boolean> => {
    try {
      await axios.delete(`${BUSINESS_SERVICE_URL}/workspaces/${workspaceId}`);
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
        localStorage.removeItem('currentWorkspace');
      }
      return true;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      return false;
    }
  }, [currentWorkspace]);

  const selectWorkspace = useCallback((workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    try {
      localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
    } catch { }
  }, []);

  // Todo: Real SRI connection logic to backend
  const connectToSri = useCallback(async (username: string, password: string): Promise<boolean> => {
    setSriConnectionStatus('pending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (username && password) {
      setSriConnectionStatus('connected');
      return true;
    }
    setSriConnectionStatus('disconnected');
    return false;
  }, []);

  const disconnectFromSri = useCallback(() => {
    setSriConnectionStatus('disconnected');
  }, []);

  const contextValue: WorkspaceContextValue = {
    workspaces,
    currentWorkspace,
    sriConnectionStatus,
    createWorkspace,
    deleteWorkspace,
    selectWorkspace,
    loadWorkspaces,
    connectToSri,
    disconnectFromSri
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
