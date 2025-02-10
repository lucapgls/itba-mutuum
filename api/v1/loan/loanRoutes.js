import express from 'express';
import { fetchloan, fetchLoanById, fetchLoanByLendingPostId, createLoan, updateFeesPaid } from './loan.js';

const router = express.Router();


router.get('/', async (req, res) => {
    const { id, lendingPostId } = req.query;

    try {
        let loans;
        if (id){
            loans = await fetchLoanById(id);
        }
        else if (lendingPostId) {
            loans = await fetchLoanByLendingPostId(lendingPostId);
        } else {
            loans = await fetchloan();
        }

        res.status(200).json({ loans });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching loans', details: error.message });
    }
});

router.post('/create', async (req, res) => {
    console.log('Received body:', req.body);
    const { lendingPostId, borrowerId, loanAmount } = req.body;

    if (!lendingPostId || !borrowerId || !loanAmount) {
        return res.status(400).json({ error: 'lendingPostId, borrowerId, and loanAmount are required' });
    }

    try {
        const loan = await createLoan(lendingPostId, borrowerId, loanAmount);
        res.status(200).json({ loan });
    } catch (error) {
        res.status(500).json({ error: 'Error creating loan', details: error.message });
    }
});



export default router;