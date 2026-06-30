import API from "./api.js";

const categoryMap = {
  'Practice': 1,
  'Assignment': 2,
  'Project': 3,
  'Revision': 4,
  'Research': 5,
  'Others': 6
};

const taskService = {
  /**
   * Get all tasks of the logged-in user.
   * @returns {Promise<Array>}
   */
  async getTasks() {
    const response = await API.get("/tasks");
    return response.data.tasks;
  },

  /**
   * Get a single task by ID.
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async getTaskById(id) {
    const response = await API.get(`/tasks/${id}`);
    return response.data.task;
  },

  /**
   * Create a new task.
   * @param {object} taskData
   * @param {string} taskData.title
   * @param {string} taskData.category
   * @param {string} taskData.priority
   * @param {string} taskData.dueDate
   * @param {string} [taskData.description]
   * @returns {Promise<object>}
   */
  async createTask({ title, category, priority, dueDate, description }) {
    const categoryId = categoryMap[category] || 6;
    
    // Normalize priority (frontend uses 'Med', backend uses 'Medium')
    const apiPriority = priority === 'Med' ? 'Medium' : priority;

    const response = await API.post("/tasks", {
      categoryId,
      title,
      description: description || "",
      priority: apiPriority,
      dueDate,
    });
    return response.data.task;
  },

  /**
   * Update a task.
   * @param {number|string} id
   * @param {object} taskData
   * @returns {Promise<object>}
   */
  async updateTask(id, taskData) {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete a task.
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async deleteTask(id) {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Mark a task as completed (setTaskDone).
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async completeTask(id) {
    const response = await API.patch(`/tasks/${id}/complete`);
    return response.data;
  }
};

export default taskService;