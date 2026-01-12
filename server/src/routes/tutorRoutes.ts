import express from 'express';
import { getAllTutors, getTutorById } from '../controllers/tutorController';

const router = express.Router();

router.get('/', getAllTutors);
router.get('/:id', getTutorById);

export default router;
