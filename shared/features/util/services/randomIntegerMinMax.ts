type Range = {
    min: number;
    max: number;
};

export function randomInt({ min, max }: Range): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}