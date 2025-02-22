export const MonthOptions = [
    { id: "1", description: "January" },
    { id: "2", description: "February" },
    { id: "3", description: "March" },
    { id: "4", description: "April" },
    { id: "5", description: "May" },
    { id: "6", description: "June" },
    { id: "7", description: "July" },
    { id: "8", description: "August" },
    { id: "9", description: "September" },
    { id: "10", description: "October" },
    { id: "11", description: "November" },
    { id: "12", description: "December" },
]

export const YearsOptions = [
    { id: "2023", description: "2023" },
    { id: "2024", description: "2024" },
    { id: "2025", description: "2025" },
    { id: "2026", description: "2026" },
    { id: "2027", description: "2027" },
    { id: "2028", description: "2028" },
    { id: "2029", description: "2029" },
    { id: "2030", description: "2030" },
]

export function getMonthDescription(month: string) {
    const value = (+month).toString()

    return MonthOptions.find((m) => m.id === value)?.description
}
