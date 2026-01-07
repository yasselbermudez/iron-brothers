import axios, { type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import type {
  LogroGalery,
  Mission, 
  GymProfile,
  Assignment, 
  User, 
  MissionCreated, 
  EventResponse, 
  UpdateUser, 
  Group, 
  MemberUpdate, 
  CreateGroup, 
  UpdateMissionsParams, 
  UpdateMissionsParamsVote, 
  GymProfileUpdate, 
  AssignmentMissionResponse, 
  MissionType, 
  EventHistory, 
  GymProfileInit
} from "./api.interfaces"

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

// Instancia de axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Para enviar cookies HTTP Only automáticamente
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  response => response,

  async (error:AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    const isRefreshError = originalRequest.url?.includes('/auth/refresh');
    const isAuthError = originalRequest.url?.includes('/users/me');
    const fromLogin = window.location.pathname === '/';

    if (isRefreshError) {
        window.location.href = '/';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthError && !fromLogin) {
      originalRequest._retry = true;
      
      try {
        // 1. Try to refresh token
        await apiClient.post(`/auth/refresh`)
        // 2. Retry doriginala solicitud
        return apiClient(originalRequest);
      } catch (refreshError) {
        
        return Promise.reject(refreshError);
      }
    }
    // Any error
    //console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


class ApiService {

  //  MÉTODOS PARA AUTENTICACIÓN
  async login(email:string,password:string): Promise<User> {

    try {
      const response: AxiosResponse<User> = await apiClient.post(`/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refresh(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.post(`/auth/refresh`);
      return response.data;
    } catch (error) {
      console.error('Refresh error:', error);
      throw error;
    }
  }
  
  async register(email:string,password:string,name:string,role:string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.post(`/auth/register`, { email, password, name, role});
      return response.data;
    } catch (error) {
      console.error('Error register user:', error);
      throw error;
    }
  }

  async logout(){
    try {
      await apiClient.post(`/auth/logout`);
    } catch (error) {
      console.error('Error logout', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  // USER METHODS
  async updateUser(updateUser:UpdateUser): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.put(`/users`,updateUser);
      return response.data;
    } catch (error) {
      console.error('Error update user:', error);
      throw error;
    }
  }


  // METODOS PARA PROFILES
  async init_profile_gamer(init_profile_data:GymProfileInit): Promise<string> {
    try {
      const response: AxiosResponse<string> = await apiClient.post(`/profiles`,init_profile_data);
      return response.data;
    } catch (error) {
      console.error('Error init profile :', error);
      throw error;
    }
  }

  //  MÉTODOS PARA MISSIONES 
  async getAllMissions(): Promise<Mission[]> {
    try {
      const response: AxiosResponse<Mission[]> = await apiClient.get('/missions');
      return response.data;
    } catch (error) {
      console.error('Error fetching missions:', error);
      throw error;
    }
  }

  async getAllLogros(): Promise<LogroGalery[]> {
    try {
      const response: AxiosResponse<LogroGalery[]> = await apiClient.get('/missions/logros');
      return response.data;
    } catch (error) {
      console.error('Error fetching logros:', error);
      throw error;
    }
  }

  async getMissionById(id: string): Promise<Mission> {
    try {
      const response: AxiosResponse<Mission> = await apiClient.get(`/missions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching mission ${id}:`, error);
      throw error;
    }
  }

  async updateMission(id: number, missionData: Partial<Mission>): Promise<Mission> {
    try {
      const response: AxiosResponse<Mission> = await apiClient.put(`/missions/${id}`, missionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating mission ${id}:`, error);
      throw error;
    }
  }

  async completeMission(id: number): Promise<Mission> {
    try {
      const response: AxiosResponse<Mission> = await apiClient.post(`/missions/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing mission ${id}:`, error);
      throw error;
    }
  }

  //  MÉTODOS PARA PERFILES DE GYM 
  async getGymGroupProfiles(groupId:string): Promise<GymProfile[]> {
    try {
      const response: AxiosResponse<GymProfile[]> = await apiClient.get(`/profiles/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gym profiles:', error);
      throw error;
    }
  }

  async getMyGymProfile(): Promise<GymProfile> {
    try {
      const response: AxiosResponse<GymProfile> = await apiClient.get(`/profiles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my gym profile:', error);
      throw error;
    }
  }

  async getAssignament(userId:string): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await apiClient.get(`/assignments/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching the assignments:', error);
      throw error;
    }
  }

  async getAssignamentAllMissions(personId:string): Promise<AssignmentMissionResponse> {
    try {
      const response: AxiosResponse<AssignmentMissionResponse> = await apiClient.get(`/assignments/${personId}/missions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching the assignments missions:', error);
      throw error;
    }
  }

  async initAssignment(): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await apiClient.post(`/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching the assignments:', error);
      throw error;
    }
  }

  async updateAssignment(missionType:MissionType): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await apiClient.put(`/assignments/missions/${missionType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching the assignments:', error);
      throw error;
    }
  }

  async updateAssignmentParams(updateData:UpdateMissionsParams): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await apiClient.put(`/assignments/missions/params`,updateData);
      return response.data;
    } catch (error) {
      console.error('Error fetching the assignments:', error);
      throw error;
    }
  }

  async updateAssignmentVote(userId:string,updateData:UpdateMissionsParamsVote): Promise<EventResponse> {
    try {
      const response: AxiosResponse<EventResponse> = await apiClient.put(`/assignments/${userId}/missions/votes`,updateData);
      return response.data;
    } catch (error) {
      console.error('Error realizando la votacion:', error);
      throw error;
    }
  }

  async createSecondaryMission(): Promise<MissionCreated> {
    try {
      const response: AxiosResponse<MissionCreated> = await apiClient.post(`/secondary`);
      return response.data;
    } catch (error) {
      console.error('Error create de secondary mission:', error);
      throw error;
    }
  }

  async updateGymProfile(profileData: GymProfileUpdate): Promise<GymProfile> {
    try {
      const response: AxiosResponse<GymProfile> = await apiClient.put(`/profiles`,profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating gym profile`, error);
      throw error;
    }
  }

  async getGroup(group_id:string): Promise<Group> {
    try {
      const response: AxiosResponse<Group> = await apiClient.get(`/groups/${group_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    }
  }

  async createGroup(group_data:CreateGroup): Promise<Group> {
    try {
      const response: AxiosResponse<Group> = await apiClient.post(`/groups`,group_data);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async deletedGroup(group_id:string): Promise<Group> {
    try {
      const response: AxiosResponse<Group> = await apiClient.delete(`/groups/${group_id}/cascade`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando group:', error);
      throw error;
    }
  }

  async getAllGroups(): Promise<Group[]> {
    try {
      const response: AxiosResponse<Group[]> = await apiClient.get(`/groups`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all groups:', error);
      throw error;
    }
  }

  async getHistory(): Promise<EventHistory[]> {
    try {
      const response: AxiosResponse<EventHistory[]> = await apiClient.get(`/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all groups:', error);
      throw error;
    }
  }

  async updateMemberGroup(group_id:string, member_data: MemberUpdate): Promise<Group> {
    try {
      const response: AxiosResponse<Group> = await apiClient.put(`/groups/members/${group_id}`,member_data);
      return response.data;
    } catch (error) {
      console.error('Error update member:', error);
      throw error;
    }
  }
 
}

// Exportar una instancia única (Singleton)
export const apiService = new ApiService();
export default apiService;