import { useEffect, useState } from "react";
import { leadService } from "../../api/lead";

const useLeadData = (leadId: string) => {
    const [leadDetail, setLeadDetail] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getLeadDetail = async () => {
            setLoading(true);
            try {
                const response: any = await leadService.getLeadById(leadId);
                setLeadDetail(response);
            } catch (error) {
                console.error("Error fetching lead detail", error);
            } finally {
                setLoading(false);
            }
        };

        if (leadId) {
            getLeadDetail();
        }
    }, [leadId]);

    return { leadDetail, loading };
}

export default useLeadData;
