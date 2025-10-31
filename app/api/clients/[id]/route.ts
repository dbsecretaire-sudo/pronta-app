import { Router } from 'express';
import { deleteClient, updateClient, getClientById } from './controller';

const router = Router({ mergeParams: true });

router.get('/', getClientById);
router.put('/', updateClient);
router.delete('/', deleteClient);

export default router;
