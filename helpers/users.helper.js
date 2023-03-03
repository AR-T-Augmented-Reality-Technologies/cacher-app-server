"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateUserAge = void 0;
const calculateUserAge = (date) => {
    const ageDifferenceMonths = Date.now() - (new Date(date).getTime());
    const ageDate = new Date(ageDifferenceMonths);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}; // Source: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
exports.calculateUserAge = calculateUserAge;
