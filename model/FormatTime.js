export async function FormatTime(timestamp) {
    if(!timestamp || timestamp===0 || timestamp==='0') return '已完成';
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp - hours * 3600) / 60);
    const seconds = timestamp - hours * 3600 - minutes * 60;
    return `${hours}时${minutes}分${seconds}s`;
}