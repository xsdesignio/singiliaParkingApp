
import fetchSchedule from "./api_conn/scheduleApiConn"
import { getScheduleDict, saveScheduleDict } from "./storage/scheduleStorage"



export async function obtainSchedule () {
    let schedule = await fetchSchedule()

    if(schedule==null) {
        schedule = await getScheduleDict()

        if(schedule == null) 
            return null
        else return schedule

    } else {
        await saveScheduleDict(schedule)
    }

    return schedule
    
}
