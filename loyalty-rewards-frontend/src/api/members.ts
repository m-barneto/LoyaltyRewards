import { api } from './client';

export interface PartialMember {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    meta?: string | null;
    birthdayMonth?: string | null;
    points?: number | null;
    flags?: string | null;
}

export async function searchMembers(
    query: string,
    page: number = 0,
    entries: number = 8
): Promise<PartialMember[]> {
    const { data } = await api.get('/LoyaltyMember/search', {
        params: { query, page, entries },
    });
    return data;
}

export async function listMembers(
    page: number = 0,
    entries: number = 8
): Promise<PartialMember[]> {
    const { data } = await api.get('/LoyaltyMember/list', {
        params: { page, entries },
    });
    return data["item2"];
}

export async function getMember(memberId: number): Promise<PartialMember> {
    const { data } = await api.get('/LoyaltyMember', { params: { memberId } });
    return data["item2"];
}

export async function updateMemberPoints(memberId: number, delta: number) {
    const { data } = await api.patch(
        '/LoyaltyMember',
        { points: delta },
        { params: { memberId } }
    );
    return data;
}
