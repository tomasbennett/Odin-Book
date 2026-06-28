import { HourGlassIcon } from "../../../assets/icons/HourGlassIcon";
import { NewestIcon } from "../../../assets/icons/NewestIcon";
import { ThumbsUpIcon } from "../../../assets/icons/ThumbsUpIcon";
import { ISortOptionsWSVG } from "../models/ISortOptionsWSVG";

export const sortOptionsClient: ISortOptionsWSVG = {
    "newest": <NewestIcon />,
    "oldest": <HourGlassIcon />,
    "popular": <ThumbsUpIcon />,
}