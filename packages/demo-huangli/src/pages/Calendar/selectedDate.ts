import { defineStore } from 'pinia';

export const useSelectedDate = defineStore('selectedDate', {
    state() {
        const today = new Date();
        return {
            selectedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        }
    },
    actions: {
        select(newDate: Date) {
            this.selectedDate = newDate;
        }
    }
})