export const getUTCDate = (dateString: string) => {
    return new Date(dateString);
};

export const getLocalDate = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

export const getFormattedDate = (localDate: Date) => {
    return localDate.toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const getFormattedTime = (localDate: Date) => {
    return localDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatDate = (dateString: string) => {
    const utcDate = getUTCDate(dateString);
    const localDate = getLocalDate(utcDate);
    const formattedDate = getFormattedDate(localDate);
    const formattedTime = getFormattedTime(localDate);

    return `${formattedDate}, ${formattedTime}`;
};
