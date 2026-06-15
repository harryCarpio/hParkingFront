import api from "../utils/axiosInstance";

export const getBandChartData = (from,to,bucketMinutes=60) =>{
    return api.get("/v1/analytics/availability/band-chart",{
        params: {from,to,bucketMinutes}
    })
}
