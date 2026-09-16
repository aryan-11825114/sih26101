import axios from 'axios';

const API_BASE_URL = '/api/ai/igot';

export interface IGotCourse {
  id: string;
  title: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  progress?: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export const igotService = {
  fetchRecommendations: async (profession: string): Promise<IGotCourse[]> => {
    const response = await axios.get(`${API_BASE_URL}/recommendations`, {
      params: { profession }
    });
    return response.data.recommendations;
  },

  updateCourseProgress: async (courseId: string, progress: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/progress`, { courseId, progress });
  }
};
