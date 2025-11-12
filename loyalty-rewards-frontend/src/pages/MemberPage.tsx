import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMember, updateMemberPoints, type PartialMember } from '../api/members';
import { getTransactions, redeemReward, type PartialTransaction } from '../api/transactions';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';


export default function MemberPage() {
    const { id } = useParams();
    const memberId = Number(id);
    const [member, setMember] = useState<PartialMember | null>(null);
    const [transactions, setTransactions] = useState<PartialTransaction[]>([]);
    const [adjustValue, setAdjustValue] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();


    const loadMember = async () => {
        if (!memberId) return;
        const m = await getMember(memberId);
        setMember(m);
    };


    const loadTransactions = async () => {
        if (!memberId) return;
        const tx = await getTransactions(memberId);
        setTransactions(tx);
    };


    useEffect(() => {
        loadMember();
        loadTransactions();
    }, [memberId]);


    const handleAdjustPoints = async (delta: number) => {
        try {
            await updateMemberPoints(memberId, delta);
            toast.current?.show({ severity: 'success', summary: 'Points Updated', detail: `Adjusted by ${delta}` });
            await loadMember();
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Failed', detail: 'Could not update points' });
        }
    };

    const handleRedeem = async (rewardId: number) => {
        try {
            await redeemReward(memberId, rewardId);
            toast.current?.show({ severity: 'success', summary: 'Reward Redeemed' });
            await loadMember();
            await loadTransactions();
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Failed', detail: 'Could not redeem reward' });
        }
    };


    return (
        <div className="p-4 space-y-4">
            <Toast ref={toast} />


            <Button label="← Back to Search" onClick={() => navigate('/search')} className="mb-3" />


            {member && (
                <Card title={`${member.firstName} ${member.lastName}`} subTitle={member.email}>
                    <p><strong>Points:</strong> {member.points}</p>
                    <p><strong>Flags:</strong> {member.flags || 'None'}</p>


                    <div className="flex align-items-center gap-2 mt-3">
                        <InputNumber
                            value={adjustValue}
                            onValueChange={(e) => setAdjustValue(e.value ?? 0)}
                            placeholder="Points amount"
                        />
                        <Button label="Add" icon="pi pi-plus" onClick={() => handleAdjustPoints(adjustValue)} />
                        <Button label="Remove" icon="pi pi-minus" className="p-button-danger" onClick={() => handleAdjustPoints(-adjustValue)} />
                    </div>


                    <div className="mt-3">
                        <Button label="Redeem 100pt Reward" icon="pi pi-gift" onClick={() => handleRedeem(1)} />
                    </div>
                </Card>
            )}


            <Card title="Transactions">
                <DataTable value={transactions} paginator rows={8}>
                    <Column field="memberId" header="Member ID" />
                    <Column field="pointsEarned" header="Points" />
                    <Column field="employee" header="Employee" />
                </DataTable>
            </Card>
        </div>
    );
}