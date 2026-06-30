import { pool } from "../config/db.js";

const Task = {
    /**
     * Create a new task.
     */
    async create({
        userId,
        categoryId,
        title,
        description,
        priority,
        dueDate,
    }) {
        const query = `
        INSERT INTO Tasks
        (
            user_id,
            category_id,
            title,
            description,
            priority,
            status,
            due_date,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, 'Undone', ?, CURDATE())
        `;

        const [result] = await pool.query(query, [
        userId,
        categoryId,
        title,
        description,
        priority,
        dueDate,
        ]);

        return {
        taskId: result.insertId,
        };
    },

    /**
     * Get all tasks for a user.
     */
    async findAllByUser(userId) {
        const query = `
        SELECT
            t.*,
            c.type AS category
        FROM Tasks t
        LEFT JOIN Categories c
            ON t.category_id = c.category_id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
        `;

        const [rows] = await pool.query(query, [userId]);

        return rows;
    },

    /**
     * Get all tasks by ID
     */
    async findById(taskId){
        const query = `
        SELECT * FROM Tasks 
        WHERE task_id = ?
        `;
        const [rows] = await pool.query(query, [taskId]);
        
        if (rows.length === 0){
            return null;
        }
        
        return rows[0];
    },

    /**
     * Update task
     */
    async update(
        taskId,
        {
            categoryId,
            title,
            description,
            priority,
            status,
            dueDate,
            completeAt,
        }
    ){
        const query = `
            UPDATE Tasks 
            SET 
                category_id=?,
                title=?,
                description=?,
                priority=?,
                status=?,
                dueDate=?,
                completeAt=?,
            WHERE task_id=?
            `;
        await pool.query(query, [
            categoryId,
            title,
            description,
            priority,
            status,
            dueDate,
            completeAt,
            taskId,
        ]);
    },

    /**
     * Delete a task
     */
    async delete(taskId){
        await pool.query(
            "DELETE FROM Tasks WHERE task_id=?",
            [taskId]
        );
    },
};

export default Task;