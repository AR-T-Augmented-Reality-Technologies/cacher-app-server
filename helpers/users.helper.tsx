const calculateUserAge = (date: string) => {
    const ageDifferenceMonths = Date.now() - (new Date(date).getTime());
    const ageDate = new Date(ageDifferenceMonths);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
} // Source: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd

export { calculateUserAge };