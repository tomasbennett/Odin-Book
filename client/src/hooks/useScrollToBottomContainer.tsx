import { RefObject, useEffect } from "react"

export function useScrollToBottomContainer(
    element: RefObject<HTMLElement | null>,
    distanceFromBottomPxl: number,
    functionality: () => Promise<void> | void,
    enabled: boolean = true
) {

    useEffect(() => {
        console.log("useScrollToBottomContainer useEffect hook running attaching an event listener!!!");

        if (!enabled) return;

        const container = element.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            const isAtBottom =
                scrollTop + containerHeight >= scrollHeight - distanceFromBottomPxl;

            if (isAtBottom) {
                functionality();
            }
        };

        container.addEventListener("scroll", handleScroll);


        return () => {
            container.removeEventListener("scroll", handleScroll);
            console.log("THE REMOVAL OF AN EVENT LISTENER!!!");
        };

    }, [enabled, functionality]);

}