


export class ScheduleTime {
    /**
     * Defined values to use as open and close times for schedule
     * from 0 to 24
     * @param {number} hours 
     * @param {number} minutes 
     */
    constructor(hours, minutes) {
        if(hours > 23 || hours < 0)
            throw new Error(`The hour defined must be between 0 and 23 (both included)`)

        if(hours > 59 || hours < 0)
            throw new Error(`The minutes defined must be between 0 and 23 (both included)`)

        this.hours = hours
        this.minutes = minutes
    }
}


export class ScheduleDay {
    
    /**
     * 
     * @param {ScheduleTime} openTime 
     * @param {ScheduleTime} closeTime 
     */
    constructor(openTime, closeTime) {
        if(!(openTime instanceof ScheduleTime) || !(closeTime instanceof ScheduleTime))
            throw new Error(`The introduced params must be instance of ScheduleTime`)
            
        this.openTime = openTime
        this.closeTime = closeTime
    }

    getOpenTime() {
        return this.openTime
    }

    getCloseTime() {
        return this.closeTime
    }
}