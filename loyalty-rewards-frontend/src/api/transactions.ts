import { api } from './client';

export interface PartialTransaction {
    memberId?: number | null;
    pointsEarned?: number | null;
    employee?: string | null;
}

export async function getTransactions(memberId: number): Promise<PartialTransaction[]> {
    const { data } = await api.get('/LoyaltyMember/transactions', {
        params: { memberId },
    });
    return data;
}

export async function createTransaction(transaction: PartialTransaction) {
    const { data } = await api.post('/Transaction', transaction);
    return data;
}

export async function redeemReward(memberId: number, rewardId: number) {
    const { data } = await api.post('/Reward', null, { params: { rewardId } });

    // Optionally record the redemption as a transaction (if your backend expects this)
    await api.post('/Transaction', {
        memberId,
        pointsEarned: -100, // adjust for actual reward cost
        employee: 'system',
    });

    return data;
}