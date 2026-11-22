export type Guide = { title: string; href: string };

export function pickGuides(groups: Guide[][]) {
    const remaining = [...groups];

    return Array.from({ length: Math.min(3, remaining.length) }, () => {
        const [group] = remaining.splice(Math.floor(Math.random() * remaining.length), 1);
        return group[Math.floor(Math.random() * group.length)];
    });
}
