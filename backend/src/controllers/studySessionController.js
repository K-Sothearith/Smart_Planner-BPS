import StudySession from "../models/StudySession.js";

const studySessionController = {
  async createSession(req, res) {
    try {
      const userId = req.user.userId;
      const {
        taskId,
        title,
        startTime,
        durationMinutes,
        focusTechnique,
        breakDuration,
        burnoutPrevention,
        isCompleted
      } = req.body;

      if (!startTime || !durationMinutes || !title) {
        return res.status(400).json({
          status: "ERROR",
          message: "Title, start time, and duration are required."
        });
      }

      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const formatMySQLDateTime = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        const yyyy = date.getFullYear();
        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const min = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
      };

      const mySQLStart = formatMySQLDateTime(start);
      const mySQLEnd = formatMySQLDateTime(end);

      const session = await StudySession.create({
        userId,
        taskId,
        startTime: mySQLStart,
        endTime: mySQLEnd,
        durationMinutes,
        title,
        focusTechnique,
        breakDuration,
        burnoutPrevention,
        isCompleted: isCompleted !== undefined ? isCompleted : false
      });

      return res.status(201).json({
        status: "SUCCESS",
        message: "Study session created successfully.",
        session
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to create study session.",
        error: error.message
      });
    }
  },

  async getSessions(req, res) {
    try {
      const userId = req.user.userId;
      const sessions = await StudySession.findAllByUser(userId);
      return res.status(200).json({
        status: "SUCCESS",
        sessions
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to retrieve study sessions.",
        error: error.message
      });
    }
  },

  async updateSession(req, res) {
    try {
      const userId = req.user.userId;
      const sessionId = req.params.id;

      const session = await StudySession.findById(sessionId);

      if (!session) {
        return res.status(404).json({
          status: "ERROR",
          message: "Study session not found."
        });
      }

      if (Number(session.user_id) !== Number(userId)) {
        return res.status(403).json({
          status: "ERROR",
          message: "Unauthorized."
        });
      }

      const {
        taskId,
        title,
        startTime,
        durationMinutes,
        focusTechnique,
        breakDuration,
        burnoutPrevention,
        isCompleted
      } = req.body;

      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationMinutes * 60000);

      const formatMySQLDateTime = (date) => {
        const pad = (n) => String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      await StudySession.update(sessionId,{
        taskId,
        startTime: formatMySQLDateTime(start),
        endTime: formatMySQLDateTime(end),
        durationMinutes,
        title,
        focusTechnique,
        breakDuration,
        burnoutPrevention,
        isCompleted
      });

      return res.json({
        status:"SUCCESS",
        message:"Study session updated successfully."
      });

    } catch(error){

      console.error(error);

      return res.status(500).json({
        status:"ERROR",
        message:"Failed to update study session.",
        error:error.message
      });

    }
  },

  async deleteSession(req, res) {
    try {
      const userId = req.user.userId;
      const sessionId = req.params.id;

      const session = await StudySession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          status: "ERROR",
          message: "Study session not found."
        });
      }

      if (Number(session.user_id) !== Number(userId)) {
        return res.status(403).json({
          status: "ERROR",
          message: "Unauthorized to delete this study session."
        });
      }

      await StudySession.delete(sessionId);

      return res.status(200).json({
        status: "SUCCESS",
        message: "Study session deleted successfully."
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to delete study session.",
        error: error.message
      });
    }
  }
};

export default studySessionController;
