export function formatMemberSince(dateString){
    const date=new Date(dateString);
    const month=date.toLocaleString("default",{month:"long"});
    const year=date.getFullYear();
    return `${month} ${year}`;
}

export function formatPublicDate(dateString){
    const date=new Date(dateString);
    const month=date.toLocaleString("default",{month:"long"});
    const day=date.getDate();
    const year=date.getFullYear();
    return `${month} ${day} ${year}`;
}