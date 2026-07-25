import z from "zod";

export type IScrollFetchParams = {
    url: string;
    additionalQuery?: Record<string, string | number | boolean | undefined> | undefined;
    fetchBody: RequestInit;
    appendData: (data: unknown) => { success: false } | { success: true, dataLength: number };
    limit: number;
    originalOffset: number;
    isOriginalFetchLoading: boolean;
    isMoreAvailable: boolean;
}


