import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { listMembers, searchMembers, type PartialMember } from '../api/members';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [members, setMembers] = useState<PartialMember[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        try {
            let results = null;
            if (query == '') {
                results = await listMembers();
            } else {
                results = await searchMembers(query);
            }
            setMembers(results);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">Member Search</h2>
            <div className="flex gap-2 mb-3">
                <InputText
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or email"
                    className="w-64"
                />
                <Button label="Search" onClick={handleSearch} loading={loading} />
            </div>
            <DataTable value={members} paginator rows={8} loading={loading}>
                <Column field="firstName" header="First Name" sortable />
                <Column field="lastName" header="Last Name" sortable />
                <Column field="email" header="Email" />
                <Column field="points" header="Points" />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <Button
                            label="View"
                            icon="pi pi-user"
                            onClick={() => navigate(`/member/${rowData.id}`)}
                        />
                    )}
                />
            </DataTable>
        </div>
    );
}
