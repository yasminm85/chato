import express from 'express';
import { getHistoryMessage, deleteMsgs } from '../controllers/messageController.js';

const msgsRouter = express.Router();

msgsRouter.get('/:user1/:user2', getHistoryMessage);
msgsRouter.delete('/:user1/:user2', deleteMsgs);

export default msgsRouter;
