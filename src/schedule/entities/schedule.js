import { ScheduleDay, ScheduleTime } from "./scheduleDay"


/**
 * @typedef {Object} WeekSchedule
 * @property {ScheduleDay | null} monday - The schedule for Monday.
 * @property {ScheduleDay | null} tuesday - The schedule for Tuesday.
 * @property {ScheduleDay | null} wednesday - The schedule for Wednesday.
 * @property {ScheduleDay | null} thursday - The schedule for Thursday.
 * @property {ScheduleDay | null} friday - The schedule for Friday.
 * @property {ScheduleDay | null} saturday - The schedule for Saturday.
 * @property {ScheduleDay | null} sunday - The schedule for Sunday.
 */
export class Schedule {

    weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    constructor() {

        /**
         * @type { WeekSchedule }
         */
        this.weekSchedule = {
            "monday": null,
            "tuesday": null,
            "wednesday": null,
            "thursday":  null,
            "friday": null,
            "saturday": null,
            "sunday": null
        }
        

        this.currentDay = Date.now().getDay().toLowerCase();

        setInterval(() => {
            this.currentDay = Date.now().getDay().toLowerCase();
        }, 6000000)
    }

    /**
     * Set a certain instance of ScheduleDay as a value for a weekSchedule day.
     * @type { void }
     * @param {string} day 
     * @param {ScheduleDay} scheduleDay 
     */
    setDaySchedule(day, scheduleDay) {
        // Check paramas
        if(!(scheduleDay instanceof ScheduleDay))
            throw new Error(`The day "${day} doesn't exist`)
        if(!(day in this.weekSchedule))
            throw new Error(`The day "${day} doesn't exist`)
        
        
        this.weekSchedule[day] = scheduleDay;
    }

    /**
     * @returns {Object} The dictionary this.weekSchedule
    */
    getWeekSchedule() {
        return this.weekSchedule;
    }

    /**
     * Return the time options that user can select for tickets and bulletins creation based on current time and schedule.
     * @type {List<ScheduleDay>}
     */
    getTimeOptions() {

        let options = []
        let currentDate = Date.now()

        let currentHours = currentDate.getHours()
        let currentMinutes = currentDate.getMinutes()

        let currentSchedule = this.weekSchedule[this.currentDay];

        options.push(new ScheduleTime(currentHours, currentMinutes))

        let index = this.weekDays.indexOf(this.currentDay);

        let i = 0;
        while(i < 4) {

            if(currentHours + 1 >= currentSchedule.getCloseTime()){
                currentSchedule = this.weekSchedule[this.weekDays[++index]];
                currentHours = currentSchedule.getOpenTime().hours()
                currentMinutes = 0;
            }
            options.push(new ScheduleTime(currentHours, currentMinutes))

            i++;
        }
    }
}