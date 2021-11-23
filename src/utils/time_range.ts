export function removeServerFromTimeRangeName(name: string): string {
    let cutNum = 0;
    if (name.endsWith('_CN') || name.endsWith('_US')) {
        cutNum = 3;
    } else if (name.endsWith('_JP_KR')) {
        cutNum = 6;
    }
    return name.substring(0, name.length - cutNum);
}