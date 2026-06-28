import { ISortPostByQuery } from "../../../../../shared/features/posts/models/ISortPostsByQuery";

export type ISortOptionsWSVG = {
    [K in ISortPostByQuery]: React.ReactNode
}