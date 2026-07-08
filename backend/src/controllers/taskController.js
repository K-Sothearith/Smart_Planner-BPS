import Task from "../models/Task.js";

const taskController = {
    async createTask(req, res) {
        try{
            const userId = req.user.userId;

            const {
                categoryId,
                title,
                description,
                priority,
                dueDate,
            } = req.body;

            if (!title || !priority || !dueDate){
                return res.status(400).json({
                    status: "ERROR",
                    message: "Title, priority and due date are required.",
                });
            }
            const task = await Task.create({
                userId,
                categoryId,
                title,
                description,
                priority,
                dueDate,
            });
            
            return res.status(201).json({
                status: "SUCCESS",
                message: "Task created successfully.",
                task,
            });
        } catch (error){
            console.error(error);
            return res.status(500).json({
                status: "ERROR",
                message: "Failed to create task.",
                error: error.message,
            });
        }
    },

    async getTasks(req, res) {
        try{
            const userId = req.user.userId;

            const tasks = await Task.findAllByUser(userId);
            
            return res.status(200).json({
                status: "SUCCESS",
                tasks,
            });
        }catch (error){
            console.error(error);

            return res.status(500).json({
                status: "ERROR",
                message: "Failed to retrive tasks.",
                error: error.message,
            });
        }
    },
    
    async getTaskById(req, res) {
        try{
            const task = await Task.findById(req.params.id);

            if(!task){
                return res.status(404).json({
                    status: "ERROR",
                    message: "Task not found.",
                });
            }
            return res.status(200).json({
                status: "SUCCESS",
                task,
            });
        }catch(error){
            console.error(error);

            return res.status(500).json({
                status: "ERROR",
                message: "Failed to retrive task.",
                error: error.message,
            });
        }
    },

    async updateTask(req, res){
        try{
            await Task.update(req.params.id, req.body);

            return res.status(200).json({
                status: "SUCCESS",
                message: "Task update successfully.",
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                status: "ERROR",
                message: "Failed to update task.",
                error: error.message,
            });
        }
    },
    
    async deleteTask(req, res){
        try{
            await Task.delete(req.params.id);

            return res.status(200).json({
                status: "SUCCESS",
                message: "Task deleted successfully.",
            });
        } catch (error){
            console.error(error);

            return res.status(500).json({
                status: "ERROR",
                message: "Failed to delete task.",
                error: error.message,
            });
        }
    },

    async completeTask(req, res){
        try{
            const taskId = req.params.id;
            const userId = req.user.userId;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    status: "ERROR",
                    message: "Task not found.",
                });
            }

            if (Number(task.user_id) !== Number(userId)) {
                return res.status(403).json({
                    status: "ERROR",
                    message: "Unauthorized to complete this task.",
                });
            }

            await Task.complete(taskId);

            return res.status(200).json({
                status: "SUCCESS",
                message: "Task marked as completed successfully.",
            });
        } catch (error){
            console.error(error);

            return res.status(500).json({
                status: "ERROR",
                message: "Failed to complete task.",
                error: error.message,
            });
        }
    },
};

export default taskController;