import z from "zod";

export type IScrollFetchParams = {
    url: string;
    fetchBody: RequestInit;
    appendData: (data: unknown) => { success: false } | { success: true, dataLength: number };
    limit: number;
    originalOffset: number;
    isOriginalFetchLoading: boolean;
    isMoreAvailable: boolean;
}


